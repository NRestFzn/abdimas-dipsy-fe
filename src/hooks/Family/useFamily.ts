import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";
import { authService } from "../../service/authService";

export const useMyFamily = () => {
    return useQuery({
        queryKey: ["my-family"],
        queryFn: async () => {
            const response = await api.get("/v1/family/me/my-family");
            return response.data.data;
        },
    });
};

export const useAddFamilyMemberByNik = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { nik: string }) => {
            const response = await api.post("/v1/family/me/my-family/members/by-nik", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-family"] });
        },
    });
};

export const useRemoveFamilyMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await api.delete(`/v1/family/me/my-family/members/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-family"] });
        },
    });
};

export const useRegisterAndAddFamilyMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            fullname: string;
            nik: string;
            email?: string | null;
            password: string;
            confirmPassword: string;
            phoneNumber?: string | null;
            gender: "m" | "f";
            birthDate: string;
            profession: string;
            RukunWargaId: string;
            RukunTetanggaId: string;
            EducationId: string;
            MarriageStatusId: string;
            SalaryRangeId: string;
        }) => {
            await authService.register({ ...data, email: data.email ?? null, phoneNumber: data.phoneNumber ?? null });
            const res = await api.post("/v1/family/me/my-family/members/by-nik", { nik: data.nik });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-family"] });
        },
    });
};
