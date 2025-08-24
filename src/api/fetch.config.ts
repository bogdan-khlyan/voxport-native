// fetch.config.ts
/** Настройки */
const BASE_URL = "https://voxport.devserver.host";

import { globalStore } from "@/api/global/global.store";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions<TBody = any> = {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: TBody;
    params?: Record<string, string | number | boolean | null | undefined>;
    skipAuth?: boolean;
    baseURL?: string;
};

export type ApiResponse<T> = {
    ok: boolean;
    status: number;
    data: T;
    headers: Headers;
};

export class HttpError<T = any> extends Error {
    status: number;
    data?: T;

    constructor(message: string, status: number, data?: T) {
        super(message || `HTTP ${status}`);
        this.name = "HttpError";
        this.status = status;
        this.data = data;

        Object.defineProperties(this, {
            message: { value: this.message, enumerable: true },
            status: { value: this.status, enumerable: true },
            data: { value: this.data, enumerable: true },
            name: { value: this.name, enumerable: true },
        });

        Object.setPrototypeOf(this, HttpError.prototype);
    }

    toJSON() {
        return { name: this.name, message: this.message, status: this.status, data: this.data };
    }
}

/** Утилиты */
const toQuery = (params?: RequestOptions["params"]) => {
    if (!params) return "";
    const q = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&");
    return q ? `?${q}` : "";
};

const isFormData = (v: any): v is FormData =>
    typeof v === "object" && v != null && typeof (v as any).append === "function";

async function getToken() {
    // Токен берём из глобального стора (синхронно, но возвращаем как Promise для совместимости)
    return globalStore.state.auth.accessToken ?? null;
}

/** Интерсепторы */
type RequestInterceptor = (
    url: string,
    init: RequestInit
) => Promise<[string, RequestInit]> | [string, RequestInit];
type ResponseInterceptor = (res: Response) => Promise<Response> | Response;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export function addRequestInterceptor(fn: RequestInterceptor) {
    requestInterceptors.push(fn);
}
export function addResponseInterceptor(fn: ResponseInterceptor) {
    responseInterceptors.push(fn);
}

/** Ядро */
async function coreHttp<T = any>(
    path: string,
    { method = "GET", headers = {}, body, params, skipAuth, baseURL = BASE_URL }: RequestOptions = {}
): Promise<ApiResponse<T>> {
    let url = `${baseURL}${path}${toQuery(params)}`;

    const finalHeaders: Record<string, string> = { ...headers };

    // если есть тело и это не FormData/строка — шлём JSON
    const shouldSetJson =
        body !== undefined && !isFormData(body) && typeof body !== "string" && !finalHeaders["Content-Type"];
    if (shouldSetJson) finalHeaders["Content-Type"] = "application/json";

    if (!skipAuth) {
        const token = await getToken();
        if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
    }

    let init: RequestInit = {
        method,
        headers: finalHeaders,
        body:
            body === undefined
                ? undefined
                : isFormData(body)
                    ? (body as any)
                    : typeof body === "string"
                        ? body
                        : JSON.stringify(body),
    };

    for (const i of requestInterceptors) {
        [url, init] = await i(url, init);
    }

    let res = await fetch(url, init);

    for (const i of responseInterceptors) {
        res = await i(res);
    }

    const ctype = res.headers.get("Content-Type") || "";
    const isJson = ctype.includes("application/json");

    const payload: any =
        res.status === 204
            ? undefined
            : isJson
                ? await res.json().catch(() => undefined)
                : await res.text();

    if (!res.ok) {
        const status =
            (payload?.error?.status as number | undefined) ??
            (typeof payload?.status === "number" ? payload.status : undefined) ??
            res.status;

        const message =
            (payload?.error?.message as string | undefined) ??
            (typeof payload === "string" && payload.trim() ? payload : undefined) ??
            (res.statusText || `HTTP ${res.status}`);

        throw new HttpError(message, status, payload);
    }

    const data: any =
        payload && typeof payload === "object" && "data" in payload
            ? (payload.data as T)
            : (payload as T);

    return { ok: true, status: res.status, data, headers: res.headers };
}

/** axios-подобный объект */
type HttpCallable = {
    <T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
    get<T = any>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<ApiResponse<T>>;
    delete<T = any>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<ApiResponse<T>>;
    post<T = any, B = any>(path: string, body?: B, options?: Omit<RequestOptions<B>, "method" | "body">): Promise<ApiResponse<T>>;
    put<T = any, B = any>(path: string, body?: B, options?: Omit<RequestOptions<B>, "method" | "body">): Promise<ApiResponse<T>>;
    patch<T = any, B = any>(path: string, body?: B, options?: Omit<RequestOptions<B>, "method" | "body">): Promise<ApiResponse<T>>;
};

const httpFn = (path: string, options?: RequestOptions) => coreHttp(path, options);
(httpFn as HttpCallable).get    = (path, options) => coreHttp(path, { ...options, method: "GET" });
(httpFn as HttpCallable).delete = (path, options) => coreHttp(path, { ...options, method: "DELETE" });
(httpFn as HttpCallable).post   = (path, body, options) => coreHttp(path, { ...options, method: "POST", body });
(httpFn as HttpCallable).put    = (path, body, options) => coreHttp(path, { ...options, method: "PUT", body });
(httpFn as HttpCallable).patch  = (path, body, options) => coreHttp(path, { ...options, method: "PATCH", body });

export const http: HttpCallable = httpFn as HttpCallable;
export default http;
