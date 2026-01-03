import type { ResponseData } from "../types/commons";
import type { ResidentMe, UpdateProfileResidentPayload } from "../types/Resident/residentType";
import { api } from "./api";

export const residentService = {
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
