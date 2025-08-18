// src/services/user.service.ts
export type LoginPayload = { email: string; password: string };

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    token?: string;
    refreshToken?: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const userService = {
    async login(_: LoginPayload): Promise<UserProfile> {
        // имитация запроса — можно убрать/уменьшить
        await sleep(300);

        // ВСЕГДА логиним тестового пользователя
        return {
            id: 'test',
            name: 'voxport',
            email: 'test@voxport.net',
            token: 'dev-token',
        };
    },

    async logout(): Promise<void> {
        await sleep(200);
        return;
    },

    async getProfile(token: string): Promise<UserProfile> {
        await sleep(200);
        return { id: 'test', name: 'voxport', email: 'test@voxport.net', token };
    },
};
