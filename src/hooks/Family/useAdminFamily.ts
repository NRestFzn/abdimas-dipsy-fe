import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";

export const useAdminFamilies = () => {
    return useQuery({
        queryKey: ["admin-families"],
        queryFn: async () => {
            const response = await api.get("/v1/family");
            return response.data.data;
        },
    });
};

export const useAdminFamilyDetail = (familyId: string) => {
    return useQuery({
        queryKey: ["admin-family-detail", familyId],
        queryFn: async () => {
            const response = await api.get(`/v1/family/${familyId}`);
            return response.data.data;
        },
        enabled: !!familyId,
    });
};

export const useAdminCreateFamily = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { familyCardNumber: string; headOfFamilyId: string }) => {
            const response = await api.post("/v1/family", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-families"] });
        },
    });
};

export const useAdminUpdateFamilyHead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ familyId, headOfFamilyId }: { familyId: string, headOfFamilyId: string }) => {
            const response = await api.put(`/v1/family/${familyId}/head`, { headOfFamilyId });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-families"] });
            queryClient.invalidateQueries({ queryKey: ["admin-family-detail", variables.familyId] });
        },
    });
};

export const useAdminAddFamilyMemberByNik = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ familyId, nik }: { familyId: string, nik: string }) => {
            const response = await api.post(`/v1/family/${familyId}/members/by-nik`, { nik });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-family-detail", variables.familyId] });
        },
    });
};

export const useAdminRemoveFamilyMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ familyId, userId }: { familyId: string, userId: string }) => {
            const response = await api.delete(`/v1/family/${familyId}/members/${userId}`);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-family-detail", variables.familyId] });
        },
    });
};
