import { createSlice, createAsyncThunk, PayloadAction, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userService, UserProfile } from "./user.service";

export const STORAGE_KEYS = { PROFILE: "voxport:profile" } as const;

type UserState = {
    profile: UserProfile | null;
    hydrating: boolean;
    loading: boolean;
    error?: string;
};

const initialState: UserState = {
    profile: null,
    hydrating: true,
    loading: false,
};

// --- Thunks ---
export const hydrateUser = createAsyncThunk<UserProfile | null>(
    "user/hydrate",
    async () => {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
        if (!raw) return null;
        return JSON.parse(raw) as UserProfile;
    }
);

export const login = createAsyncThunk<UserProfile, { email: string; password: string }>(
    "user/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const profile = await userService.login({ email, password });
            await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
            return profile;
        } catch (err: any) {
            return rejectWithValue(err.message || "Ошибка авторизации");
        }
    }
);

export const logout = createAsyncThunk("user/logout", async () => {
    await userService.logout();
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
});

// --- Slice ---
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        patchProfile(state, action: PayloadAction<Partial<UserProfile>>) {
            if (state.profile) Object.assign(state.profile, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // hydrate
            .addCase(hydrateUser.pending, (s) => { s.hydrating = true; })
            .addCase(hydrateUser.fulfilled, (s, { payload }) => {
                s.profile = payload;
                s.hydrating = false;
            })
            .addCase(hydrateUser.rejected, (s) => { s.hydrating = false; })

            // login
            .addCase(login.pending, (s) => { s.loading = true; s.error = undefined; })
            .addCase(login.fulfilled, (s, { payload }) => { s.profile = payload; s.loading = false; })
            .addCase(login.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string; })

            // logout
            .addCase(logout.fulfilled, (s) => { s.profile = null; });
    },
});

export const { patchProfile } = userSlice.actions;

// ---------- ЕДИНЫЙ STORE ----------
export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ---------- Селекторы ----------
export const selectors = {
    userState: (s: RootState) => s.user,
    profile: (s: RootState) => s.user.profile,
    hydrating: (s: RootState) => s.user.hydrating,
    loading: (s: RootState) => s.user.loading,
    error: (s: RootState) => s.user.error,
    isAuthed: (s: RootState) => !!s.user.profile,
};

// ---------- Pinia-подобный фасад ----------
export const userStore = {
    // реактивности как в Pinia нет, но можно читать актуальное состояние
    get state() {
        return selectors.userState(store.getState());
    },
    get profile() {
        return selectors.profile(store.getState());
    },
    get loading() {
        return selectors.loading(store.getState());
    },
    get hydrating() {
        return selectors.hydrating(store.getState());
    },
    get error() {
        return selectors.error(store.getState());
    },

    // методы
    hydrate: () => store.dispatch(hydrateUser()),
    login: (creds: { email: string; password: string }) => store.dispatch(login(creds)).unwrap(),
    logout: () => store.dispatch(logout()),
    patchProfile: (patch: Partial<UserProfile>) => store.dispatch(patchProfile(patch)),

    // подписка на изменения (например, для side-effects вне React)
    subscribe: (listener: () => void) => store.subscribe(listener),
};

// ---------- React-хук в стиле Pinia useStore ----------
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

export const useUserStore = () => {
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(selectors.profile);
    const hydrating = useSelector(selectors.hydrating);
    const loading = useSelector(selectors.loading);
    const error = useSelector(selectors.error);
    const isAuthed = useSelector(selectors.isAuthed);

    const actions = useMemo(() => ({
        hydrate: () => dispatch(hydrateUser()),
        login: (creds: { email: string; password: string }) => dispatch(login(creds)),
        logout: () => dispatch(logout()),
        patchProfile: (patch: Partial<UserProfile>) => dispatch(patchProfile(patch)),
    }), [dispatch]);

    return { profile, hydrating, loading, error, isAuthed, ...actions };
};
