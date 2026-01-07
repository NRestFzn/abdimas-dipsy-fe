import type { ResponseData } from "../types/commons";
import type { GetResidentsParams, ResidentMe, UpdateProfileResidentPayload } from "../types/Resident/residentType";
import { api } from "./api";

export const residentService = {
  getAllResidents: async (params: GetResidentsParams) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== "")
    );

    const response = await api.get("/v1/resident", { params: cleanParams });
    return response.data;
  },

  getResidentProfile: async () => {
    const response = await api.get<ResponseData<ResidentMe>>("/v1/resident/me");
    return response.data;
  },

  updateProfile: async (payload: UpdateProfileResidentPayload) => {
    const response = await api.put("/v1/resident/me", payload);
    return response.data;
  },

  updateProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await api.put("/v1/user/update/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
