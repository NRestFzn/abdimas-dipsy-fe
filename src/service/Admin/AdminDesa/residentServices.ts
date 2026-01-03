import type { ResponseData } from "../../../types/commons";
import type { GetResidentsParams, ResidentData } from "../../../types/Resident/residentType";
import { api } from "../../api";

export type ResidentResponse = ResponseData<ResidentData[]>;

export const residentService = {
    getAllResidents: async (params?: GetResidentsParams) => {
        const response = await api.get<ResidentResponse>("/v1/resident", { params });
        return response.data;
    },

    getResidentById: async (id: string) => {
        const response = await api.get<{ data: ResidentData }>(`/v1/resident/${id}`);
        return response.data;
    },

    createResident: async (data: any) => {
        const response = await api.post("/v1/resident", data);
        return response.data;
    },

    updateResident: async (id: string, data: any) => {
        const response = await api.put(`/v1/resident/${id}`, data);
        return response.data;
    },

    deleteResident: async (id: string) => {
        const response = await api.delete(`/v1/resident/${id}`);
        return response.data;
    },
};