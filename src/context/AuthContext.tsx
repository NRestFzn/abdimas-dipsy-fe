import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../service/authService";
import type { APIError } from "../types/ErrorFallbackType";
import { useQueryClient } from "@tanstack/react-query";
import type { LoginPayload, LoginResidentPayload, RegisterPayload, UserMeResponse } from "../types/AuthTypes/authTypes";

interface AuthContextType {
	user: UserMeResponse | null;
	isAuthenticated: boolean;
	login: (data: LoginPayload) => Promise<any>;
	loginResident: (data: LoginResidentPayload) => Promise<any>;
	register: (data: RegisterPayload) => Promise<void>;
	logout: () => void;
	isLoadingUser: boolean;
	isLoading: boolean;
	error: APIError | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const queryClient = useQueryClient();

	const [user, setUserState] = useState<UserMeResponse | null>(null);
	const [isLoading, setIsLoading] = useState({
		loadingUser: true,
		loadingBtn: false
	});
	const [error, setError] = useState<APIError | null>(null);

	const setUser = useCallback((userData: UserMeResponse | null) => {
		if (userData) {
			setUserState(userData);
			if (userData.accessToken) {
				localStorage.setItem("authToken", userData.accessToken);
			}
			localStorage.setItem("userData", JSON.stringify(userData));
		} else {
			setUserState(null);
			localStorage.removeItem("authToken");
			localStorage.removeItem("userData");
		}
	}, []);

	const logout = useCallback(() => {
		setUser(null);
		queryClient.clear();
	}, [queryClient, setUser]);

	useEffect(() => {
		const initAuth = async () => {
			const token = localStorage.getItem("authToken");

			if (!token) {
				setIsLoading((prev) => ({ ...prev, loadingUser: false }));
				return;
			}

			try {
				const response = await authService.getProfile();

				if (response.data) {
					const userDataWithToken: UserMeResponse = {
						...response.data,
						accessToken: token
					};

					setUser(userDataWithToken);
				}
			} catch (error) {
				console.error("Session expired or invalid:", error);
				logout();
			} finally {
				setIsLoading((prev) => ({ ...prev, loadingUser: false }));
			}
		};

		initAuth();
	}, [setUser, logout]);

	const login = async (loginData: LoginPayload) => {
		setIsLoading((prev) => ({ ...prev, loadingBtn: true }));
		setError(null);

		try {
			const response = await authService.login(loginData);
			return await handleLoginSuccess(response)
		} catch (err: any) {
			console.error("Login Error:", err);
			setError(err as APIError);
			throw err;
		} finally {
			setIsLoading((prev) => ({ ...prev, loadingBtn: false }));
		}
	};

	const loginResident = async (loginData: LoginResidentPayload) => {
		setIsLoading((prev) => ({ ...prev, loadingBtn: true }));

		try {
			const response = await authService.loginResident(loginData)
			return await handleLoginSuccess(response)
		} catch (error) {
			console.error("Resident Login Error:", error);
			setError(error as APIError);
			throw error;
		} finally {
			setIsLoading((prev) => ({ ...prev, loadingBtn: false }));
		}
	}

	const register = async (registerData: RegisterPayload): Promise<void> => {
		setIsLoading((prev) => ({ ...prev, loadingBtn: true }));
		setError(null);
		try {
			const response = await authService.register(registerData);
			if (response.statusCode === 200 || response.statusCode === 201) {
				await login({ email: registerData.email, password: registerData.password });
			} else {
				throw new Error(response.message || "Registration failed");
			}
		} catch (err: any) {
			setError(err as APIError);
			throw err;
		} finally {
			setIsLoading((prev) => ({ ...prev, loadingBtn: false }));
		}
	};

	const handleLoginSuccess = async (response: any) => {
		if (response?.statusCode === 200 && response?.data) {
			const loginResponseData = response.data;
			const token = loginResponseData.accessToken;

			localStorage.setItem("authToken", token as string);

			const profileResponse = await authService.getProfile();

			if (profileResponse.data) {
				const fullUserData: UserMeResponse = {
					...profileResponse.data,
					accessToken: token
				};
				setUser(fullUserData);
				return { data: fullUserData };
			}
		} else {
			throw new Error(response.message || "Login failed");
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				login,
				loginResident,
				register,
				logout,
				isLoading: isLoading.loadingBtn,
				isLoadingUser: isLoading.loadingUser,
				error,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
