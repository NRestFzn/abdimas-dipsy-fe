import { useMutation } from "@tanstack/react-query";
import { authService } from "../service/authService";
import type { LoginPayload, RegisterPayload } from "../types/AuthTypes/authTypes";

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (data: LoginPayload) => authService.login(data),
    });
};

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: (data: RegisterPayload) => authService.register(data),
    });
};