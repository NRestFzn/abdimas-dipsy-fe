import type { LoginPayload, RegisterPayload, AuthResponse, UserMeResponse } from "../types/AuthTypes/authTypes";
import type { ResponseData } from "../types/commons";
import { api } from "./api";


export const authService = {
	login: async (loginData: LoginPayload): Promise<ResponseData<AuthResponse>> => {
		const { data } = await api.post<ResponseData<AuthResponse>>("/v1/auth/signin", loginData);
		return data;
	},

	register: async (registerData: RegisterPayload): Promise<ResponseData<AuthResponse>> => {
		const { data } = await api.post<ResponseData<AuthResponse>>("/v1/auth/signup", registerData);
		return data;
	},

	getProfile: async (): Promise<ResponseData<UserMeResponse>> => {
        const { data } = await api.get<ResponseData<UserMeResponse>>("/v1/user/me");
        return data;
    },
};
