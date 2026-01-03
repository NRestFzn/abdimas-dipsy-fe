import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { residentService } from "../../../service/Admin/AdminDesa/residentServices";
import type { GetResidentsParams } from "../../../types/Resident/residentType";

export const useResident = () => {
    const queryClient = useQueryClient();

    const getResidents = (params: GetResidentsParams) => {
        return useQuery({
            queryKey: ["residents", params],
            queryFn: () => residentService.getAllResidents(params),
            placeholderData: keepPreviousData,
        });
    };

    const getResidentDetail = (id: string | null) => {
        return useQuery({
            queryKey: ["resident", id],
            queryFn: () => residentService.getResidentById(id!),
            enabled: !!id,
        });
    };

    const createResidentMutation = useMutation({
        mutationFn: (data: any) => residentService.createResident(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["residents"] });
        },
    });

    const updateResidentMutation = useMutation({
        mutationFn: (vals: { id: string; data: any }) => 
            residentService.updateResident(vals.id, vals.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["residents"] });
        },
    });

    const deleteResidentMutation = useMutation({
        mutationFn: (id: string) => residentService.deleteResident(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["residents"] });
        },
    });

    return {
        getResidents,
        getResidentDetail,
        createResidentMutation,
        updateResidentMutation,
        deleteResidentMutation
    };
};