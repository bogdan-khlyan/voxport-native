// src/api/calls/calls.store.ts
import 'react-native-get-random-values';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const CALLS_SLICE_KEY = 'calls' as const;
const CALLS_KEY = 'voxport:calls:v1';

/* ----------------------------- Types ----------------------------- */
export type CallDirection = 'in' | 'out';
export type CallStatus = 'completed' | 'missed' | 'rejected' | 'canceled' | 'ongoing';

export type CallItem = {
    id: string;
    peerId: string;
    peerName: string;
    direction: CallDirection;
    isVideo: boolean;
    status: CallStatus;
    startedAt: number;
    endedAt?: number;
    durationSec?: number;
    endReason?: string;
    favorite?: boolean;
    note?: string;
};

type CallsState = {
    items: CallItem[];
    hydrating: boolean;
    loading: boolean;
    error?: string;
};

const initialState: CallsState = {
    items: [],
    hydrating: true,
    loading: false,
};

/* --------------------------- Utils --------------------------- */
const sortByNewest = (arr: CallItem[]) =>
    arr.slice().sort((a, b) => (b.endedAt ?? b.startedAt) - (a.endedAt ?? a.startedAt));

const persist = (items: CallItem[]) =>
    AsyncStorage.setItem(CALLS_KEY, JSON.stringify({ items })).catch(() => {});

type Rootish = { [CALLS_SLICE_KEY]?: CallsState };
const getItems = (s: Rootish) => s[CALLS_SLICE_KEY]?.items ?? [];

/* --------------------------- Thunks --------------------------- */
export const hydrateCalls = createAsyncThunk<CallItem[] | null>(
    `${CALLS_SLICE_KEY}/hydrate`,
    async () => {
        const raw = await AsyncStorage.getItem(CALLS_KEY);
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw) as { items?: CallItem[] } | CallItem[];
            const items = Array.isArray(parsed) ? parsed : parsed?.items ?? [];
            return sortByNewest(items);
        } catch {
            await AsyncStorage.removeItem(CALLS_KEY);
            return [];
        }
    }
);

type AddInput = Omit<CallItem, 'id' | 'startedAt' | 'status'> & Partial<Pick<CallItem, 'startedAt' | 'status'>>;

export const addCall = createAsyncThunk<CallItem[], AddInput, { state: Rootish }>(
    `${CALLS_SLICE_KEY}/add`,
    async (input, { getState }) => {
        const now = Date.now();
        const next: CallItem = {
            id: uuidv4(),
            startedAt: input.startedAt ?? now,
            status: input.status ?? 'ongoing',
            ...input,
        };
        const items = sortByNewest([next, ...getItems(getState())]);
        await persist(items);
        return items;
    }
);

export const endCall = createAsyncThunk<
    CallItem[],
    { id: string; endedAt?: number; durationSec?: number; status?: Exclude<CallStatus, 'ongoing'>; endReason?: string },
    { state: Rootish }
>(`${CALLS_SLICE_KEY}/end`, async (p, { getState }) => {
    const items = getItems(getState()).map((c) => {
        if (c.id !== p.id) return c;
        const endedAt = p.endedAt ?? Date.now();
        const durationSec = p.durationSec ?? Math.max(0, Math.round((endedAt - c.startedAt) / 1000));
        return { ...c, endedAt, durationSec, status: p.status ?? (durationSec > 0 ? 'completed' : 'canceled'), endReason: p.endReason ?? c.endReason };
    });
    const sorted = sortByNewest(items);
    await persist(sorted);
    return sorted;
});

export const updateCall = createAsyncThunk<CallItem[], { id: string } & Partial<CallItem>, { state: Rootish }>(
    `${CALLS_SLICE_KEY}/update`,
    async (patch, { getState }) => {
        const items = getItems(getState()).map((c) => (c.id === patch.id ? { ...c, ...patch, id: c.id } : c));
        const sorted = sortByNewest(items);
        await persist(sorted);
        return sorted;
    }
);

export const deleteCall = createAsyncThunk<CallItem[], { id: string }, { state: Rootish }>(
    `${CALLS_SLICE_KEY}/delete`,
    async ({ id }, { getState }) => {
        const items = getItems(getState()).filter((c) => c.id !== id);
        const sorted = sortByNewest(items);
        await persist(sorted);
        return sorted;
    }
);

export const clearCalls = createAsyncThunk<CallItem[]>(
    `${CALLS_SLICE_KEY}/clear`,
    async () => {
        await AsyncStorage.setItem(CALLS_KEY, JSON.stringify({ items: [] }));
        return [];
    }
);

export const toggleFavorite = createAsyncThunk<CallItem[], { id: string; value?: boolean }, { state: Rootish }>(
    `${CALLS_SLICE_KEY}/toggleFavorite`,
    async ({ id, value }, { getState }) => {
        const items = getItems(getState()).map((c) => (c.id === id ? { ...c, favorite: value ?? !c.favorite } : c));
        const sorted = sortByNewest(items);
        await persist(sorted);
        return sorted;
    }
);

export const addNote = createAsyncThunk<CallItem[], { id: string; note: string }, { state: Rootish }>(
    `${CALLS_SLICE_KEY}/addNote`,
    async ({ id, note }, { getState }) => {
        const items = getItems(getState()).map((c) => (c.id === id ? { ...c, note } : c));
        const sorted = sortByNewest(items);
        await persist(sorted);
        return sorted;
    }
);

/* --------------------------- Slice --------------------------- */
const callsSlice = createSlice({
    name: CALLS_SLICE_KEY,
    initialState,
    reducers: {
        setAll(state, action: PayloadAction<CallItem[]>) {
            state.items = sortByNewest(action.payload);
        },
    },
    extraReducers: (b) => {
        b.addCase(hydrateCalls.pending,   (s) => { s.hydrating = true; s.error = undefined; })
            .addCase(hydrateCalls.fulfilled, (s, { payload }) => { s.items = payload ?? []; s.hydrating = false; })
            .addCase(hydrateCalls.rejected,  (s, a) => { s.hydrating = false; s.error = a.error?.message; })

            .addCase(addCall.fulfilled,         (s, { payload }) => { s.items = payload; })
            .addCase(endCall.fulfilled,         (s, { payload }) => { s.items = payload; })
            .addCase(updateCall.fulfilled,      (s, { payload }) => { s.items = payload; })
            .addCase(deleteCall.fulfilled,      (s, { payload }) => { s.items = payload; })
            .addCase(clearCalls.fulfilled,      (s, { payload }) => { s.items = payload; })
            .addCase(toggleFavorite.fulfilled,  (s, { payload }) => { s.items = payload; })
            .addCase(addNote.fulfilled,         (s, { payload }) => { s.items = payload; });
    },
});

export const { setAll } = callsSlice.actions;
export default callsSlice.reducer;

/* ------------------------- Selectors (safe) ------------------------- */
export const selectCallsState = (s: Rootish): CallsState => s[CALLS_SLICE_KEY] ?? initialState;
export const selectCalls      = (s: Rootish) => selectCallsState(s).items;
export const selectHydrating  = (s: Rootish) => selectCallsState(s).hydrating;
export const selectError      = (s: Rootish) => selectCallsState(s).error;
export const selectById       = (id: string) => (s: Rootish) => selectCalls(s).find(i => i.id === id);
