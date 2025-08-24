// global.store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "voxport:auth";

export type AuthData = {
    accessToken: string | null;
    refreshToken?: string | null;
    expiresAt?: number | null; // unix ms
    userId?: number | string | null;
    email?: string | null;
};

type GlobalState = {
    auth: AuthData;
};

type Listener = () => void;

const initialState: GlobalState = {
    auth: {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        userId: null,
        email: null,
    },
};

class GlobalStore {
    private _state: GlobalState = initialState;
    private listeners = new Set<Listener>();
    private _hydrated = false;

    get state(): Readonly<GlobalState> {
        return this._state;
    }

    get hydrated(): boolean {
        return this._hydrated;
    }

    /** Подписка на любые изменения стора */
    subscribe(fn: Listener) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    private notify() {
        for (const fn of this.listeners) fn();
    }

    private setState(patch: Partial<GlobalState>, notify = true) {
        this._state = { ...this._state, ...patch };
        if (notify) this.notify();
    }

    /** Инициализация: подтянуть сохранённые данные авторизации */
    async init() {
        try {
            const raw = await AsyncStorage.getItem(AUTH_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as GlobalState["auth"];
                this.setState({ auth: { ...initialState.auth, ...parsed } }, false);
            }
        } catch {
            // ignore
        } finally {
            this._hydrated = true;
            this.notify();
        }
    }

    /** Сохранить авторизацию (и персистнуть) */
    async setAuth(auth: Partial<AuthData>) {
        const next: AuthData = { ...this._state.auth, ...auth };
        this.setState({ auth: next });
        try {
            await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(next));
        } catch {
            // ignore persist errors
        }
    }

    /** Установить только accessToken */
    async setAccessToken(token: string | null) {
        await this.setAuth({ accessToken: token });
    }

    /** Очистить авторизацию полностью */
    async clearAuth() {
        this.setState({ auth: { ...initialState.auth } });
        try {
            await AsyncStorage.removeItem(AUTH_KEY);
        } catch {
            // ignore
        }
    }
}

export const globalStore = new GlobalStore();

/**
 * Вызови один раз при старте приложения (например, в index.tsx)
 *   await globalStore.init()
 */
