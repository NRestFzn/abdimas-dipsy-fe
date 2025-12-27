import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { adminMedisService } from "../service/adminMedisService";

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => adminMedisService.updateProfilePicture(file),
    onSuccess: () => {
      message.success("Foto profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["admin-medis", "me"] });
    },
    onError: (error: any) => {
      console.error(error);
      message.error(error.response?.data?.message || "Gagal mengupload foto");
    },
  });
};

export const useAdminMedisProfile = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: adminMedisService.getMe,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};