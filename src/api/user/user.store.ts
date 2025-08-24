import { createSlice, createAsyncThunk, PayloadAction, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userService, User, LoginPayload, LoginResponseDTO } from "@/api/user/user.service";
import { globalStore } from "@/api/global/global.store";
import callsReducer, { CALLS_SLICE_KEY } from '@/api/calls/calls.store';

type UserState = {
    user: User | null;
    hydrating: boolean;
    loading: boolean;
    error?: string;
};

const USER_KEY = "voxport:user";

const initialState: UserState = {
    user: null,
    hydrating: true,
    loading: false,
};

// --- Thunks ---
export const hydrateUser = createAsyncThunk<User | null>(
    "user/hydrate",
    async () => {
        const raw = await AsyncStorage.getItem(USER_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as User;
    }
);

export const login = createAsyncThunk<User, LoginPayload>(
    "user/login",
    async (payload, { rejectWithValue }) => {
        try {
            const { accessToken, refreshToken, user }: LoginResponseDTO = await userService.login(payload);

            // токены и базовые данные в глобальный стор
            await globalStore.setAuth({
                accessToken,
                refreshToken,
                userId: user.id,
                email: user.username, // у тебя email приходит в username
            });

            // сохраняем user
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

            return user;
        } catch (err: any) {
            return rejectWithValue(err?.message || "Ошибка авторизации");
        }
    }
);

export const logout = createAsyncThunk("user/logout", async () => {
    await userService.logout();
    await AsyncStorage.removeItem(USER_KEY);
    await globalStore.clearAuth();
});

// --- Slice ---
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        patchUser(state, action: PayloadAction<Partial<User>>) {
            if (state.user) Object.assign(state.user, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(hydrateUser.pending, (s) => { s.hydrating = true; })
            .addCase(hydrateUser.fulfilled, (s, { payload }) => {
                s.user = payload;
                s.hydrating = false;
            })
            .addCase(hydrateUser.rejected, (s) => { s.hydrating = false; })

            .addCase(login.pending, (s) => { s.loading = true; s.error = undefined; })
            .addCase(login.fulfilled, (s, { payload }) => { s.user = payload; s.loading = false; })
            .addCase(login.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string; })

            .addCase(logout.fulfilled, (s) => { s.user = null; });
    },
});

export const { patchUser } = userSlice.actions;

// ---------- STORE ----------
export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        [CALLS_SLICE_KEY]: callsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ---------- Селекторы ----------
export const selectors = {
    userState: (s: RootState) => s.user,
    user:      (s: RootState) => s.user.user,
    hydrating: (s: RootState) => s.user.hydrating,
    loading:   (s: RootState) => s.user.loading,
    error:     (s: RootState) => s.user.error,
    isAuthed:  (s: RootState) => !!s.user.user,
};

// ---------- Pinia-подобный фасад ----------
export const userStore = {
    get state()     { return selectors.userState(store.getState()); },
    get user()      { return selectors.user(store.getState()); },
    get loading()   { return selectors.loading(store.getState()); },
    get hydrating() { return selectors.hydrating(store.getState()); },
    get error()     { return selectors.error(store.getState()); },

    hydrate: () => store.dispatch(hydrateUser()),
    login:   (creds: LoginPayload) => store.dispatch(login(creds)).unwrap(),
    logout:  () => store.dispatch(logout()),
    patch:   (patch: Partial<User>) => store.dispatch(patchUser(patch)),

    subscribe: (listener: () => void) => store.subscribe(listener),
};

// ---------- React-хук ----------
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

export const useUserStore = () => {
    const dispatch  = useDispatch<AppDispatch>();
    const user      = useSelector(selectors.user);
    const hydrating = useSelector(selectors.hydrating);
    const loading   = useSelector(selectors.loading);
    const error     = useSelector(selectors.error);
    const isAuthed  = useSelector(selectors.isAuthed);

    const actions = useMemo(() => ({
        hydrate: () => dispatch(hydrateUser()),
        login:   (creds: LoginPayload) => dispatch(login(creds)),
        logout:  () => dispatch(logout()),
        patch:   (patch: Partial<User>) => dispatch(patchUser(patch)),
    }), [dispatch]);

    return { user, hydrating, loading, error, isAuthed, ...actions };
};
