import { LoginPayload, RegisterPayload, TokenPairResponse, UserResponse } from "../types/auth";
import api from "./client";
import endpoints from "./endpoints";

const register = async (
    payload: RegisterPayload
): Promise<UserResponse> => {
    const res = await api.post(endpoints.auth.register, payload);
    return res.data;
}

const login = async (
    payload: LoginPayload
): Promise<TokenPairResponse> => {
    const res = await api.post(endpoints.auth.login, payload);
    return res.data;
}

const me = async () => {
    const res = await api.get(endpoints.auth.me);
    return res.data;
}

const logout = async () => {
    const res = await api.post(endpoints.auth.logout);
    return res.data;
};

export { register, login, me, logout };