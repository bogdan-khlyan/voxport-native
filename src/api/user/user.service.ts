// src/services/user.service.ts
import { http, HttpError } from "@/api/fetch.config";

/** ---- Backend DTOs ---- */
export type User = {
    id: number;
    username: string; // у тебя в ответе email лежит в username
    link: string;
    users: User[];
};

export type LoginResponseDTO = {
    accessToken: string;
    refreshToken: string;
    user: User;
};

export type LoginPayload = { email: string; password: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const userService = {
    async login(payload: LoginPayload): Promise<LoginResponseDTO> {
        const res = await http.post<LoginResponseDTO>("/api/auth/custom-login", {
            identifier: payload.email,
            password: payload.password,
        });
        return res?.data;
    },

    async logout(): Promise<void> {
        await sleep(100);
        return;
    },

    // async getProfile(token: string): Promise<User> {
    //     await sleep(100);
    //     // заглушка пока нет ендпоинта
    //     return {
    //         accessToken: 'asd',
    //         refreshToken: '',
    //         user: {}
    //     };
    // },
};
