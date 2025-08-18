// components/data/users.ts
export type User = {
    id: string;
    name: string;
    username: string;
    email?: string;
    avatarUrl?: string;
};

export const USERS: User[] = [
    { id: 'u1', name: 'Alice Johnson',   username: 'alice',   email: 'alice@example.com' },
    { id: 'u2', name: 'Anton Petrov',    username: 'anton',   email: 'anton@example.com' },
    { id: 'u3', name: 'Charles Lee',     username: 'charles', email: 'charles@example.com' },
    { id: 'u4', name: 'Diana Kravets',   username: 'diana' },
    { id: 'u5', name: 'Ethan Brown',     username: 'ethan' },
    { id: 'u6', name: 'Fiona McKenzie',  username: 'fiona' },
    { id: 'u7', name: 'George Kim',      username: 'george' },
    { id: 'u8', name: 'Hiro Tanaka',     username: 'hiro' },
    { id: 'u9', name: 'Ivy Gonzalez',    username: 'ivy' },
    { id: 'u10',name: 'Jack Miller',     username: 'jack' },
];
