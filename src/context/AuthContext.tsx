import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../service/authService";
import type { APIError } from "../types/ErrorFallbackType";
import { useQueryClient } from "@tanstack/react-query";
import type { LoginPayload, LoginResidentPayload, RegisterPayload, Role, UserMeResponse } from "../types/AuthTypes/authTypes";
import { ROLE_ID } from "../constants";

interface AuthContextType {
	user: UserMeResponse | null;
	activeRole: Role | null;
	isAuthenticated: boolean;
	login: (data: LoginPayload) => Promise<any>;
	loginResident: (data: LoginResidentPayload) => Promise<any>;
	register: (data: RegisterPayload) => Promise<void>;
	logout: () => void;
	switchRole: (role: Role) => void;
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
	const [activeRole, setActiveRole] = useState<Role | null>(null);
	const [isLoading, setIsLoading] = useState({
		loadingUser: true,
		loadingBtn: false
	});
	const [error, setError] = useState<APIError | null>(null);

	const getPriorityRole = (roles: Role[]): Role | null => {
		if (!roles || roles.length === 0) return null;

		const priorityOrder = [ROLE_ID.ADMIN_DESA, ROLE_ID.ADMIN_MEDIS, ROLE_ID.KADER, ROLE_ID.WARGA];

		for (const roleId of priorityOrder) {
			const found = roles.find(r => r.id === roleId);
			if (found) return found;
		}

		return roles[0];
	};

	const setUser = useCallback((userData: UserMeResponse | null) => {
		if (userData) {
			setUserState(userData);
			if (userData.roles && userData.roles.length > 0) {
				const savedRoleId = localStorage.getItem("activeRoleId");
				const savedRole = userData.roles.find(r => r.id === savedRoleId);

				const nextRole = savedRole || getPriorityRole(userData.roles);
				setActiveRole(nextRole);

				if (nextRole) {
					localStorage.setItem("activeRoleId", nextRole.id);
				}
			}

			if (userData.accessToken) {
				localStorage.setItem("authToken", userData.accessToken);
			}

			const { accessToken, ...rest } = userData;
			localStorage.setItem("userData", JSON.stringify(rest));
		} else {
			setUserState(null);
			setActiveRole(null);
			localStorage.removeItem("authToken");
			localStorage.removeItem("userData");
			localStorage.removeItem("activeRoleId");
		}
	}, []);

	const logout = useCallback(() => {
		setUser(null);
		queryClient.clear();
	}, [queryClient, setUser]);

	const switchRole = (role: Role) => {
		setActiveRole(role);
		localStorage.setItem("activeRoleId", role.id);
		window.location.reload();
	};

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
				activeRole,
				login,
				loginResident,
				register,
				logout,
				switchRole,
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
