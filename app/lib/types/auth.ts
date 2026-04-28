type RegisterPayload = {
    name: string;
    email: string;
    password: string;
}

type LoginPayload = {
    email: string;
    password: string;
}

type RefreshPayload = {
    refresh_token: string;
}

type TokenPairResponse = {
    access_token: string;
    refresh_token: string;
    token_type: "bearer";
}

type UserResponse = {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export type { RegisterPayload, LoginPayload, RefreshPayload, TokenPairResponse, UserResponse };