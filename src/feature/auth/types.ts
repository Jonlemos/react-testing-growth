export type User = {
    id: string;
    name: string;
    email: string;
    segment: string;
}

export type LoginCredentials = {
    email: string;
    password: string;
}

export type LoginResponse = {
    user: User;
}

export type AuthState = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}