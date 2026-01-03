import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { residentService } from "../service/residentService";
import { message } from "antd";
import type { UpdateProfileResidentPayload } from "../types/Resident/residentType";

export const useResident = () => {
  return useQuery({
    queryKey: ["resident", "me"],
    queryFn: residentService.getResidentProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileResidentPayload) => residentService.updateProfile(payload),
    onSuccess: () => {
      message.success("Profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["resident", "me"] });
    },
    onError: (error: any) => {
      console.error(error);
      message.error(error.response?.data?.message || "Gagal memperbarui profil");
    },
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => residentService.updateProfilePicture(file),
    onSuccess: () => {
      message.success("Foto profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["resident", "me"] });
    },
    onError: (error: any) => {
      console.error(error);
      message.error(error.response?.data?.message || "Gagal mengupload foto");
    },
  });
};