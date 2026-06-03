import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { odgjResidentService } from "../../../service/Admin/AdminDesa/odgjResidentService";
import type {
  CreateOdgjResidentPayload,
  CreateOdgjSchedulePayload,
  GetOdgjResidentParams,
  UpdateOdgjResidentPayload,
  UpdateOdgjSchedulePayload,
} from "../../../types/odgjResidentType";

export const useOdgjResidents = (params?: GetOdgjResidentParams) => {
  return useQuery({
    queryKey: ["odgj-residents", params],
    queryFn: () => odgjResidentService.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useCreateOdgjResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOdgjResidentPayload) =>
      odgjResidentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odgj-residents"] });
    },
  });
};

export const useUpdateOdgjResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOdgjResidentPayload;
    }) => odgjResidentService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odgj-residents"] });
    },
  });
};

export const useDeleteOdgjResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => odgjResidentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odgj-residents"] });
    },
  });
};

export const useCreateOdgjSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      odgjResidentId,
      payload,
    }: {
      odgjResidentId: string;
      payload: CreateOdgjSchedulePayload;
    }) => odgjResidentService.createSchedule(odgjResidentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odgj-residents"] });
    },
  });
};

export const useUpdateOdgjSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      odgjResidentId,
      scheduleId,
      payload,
    }: {
      odgjResidentId: string;
      scheduleId: string;
      payload: UpdateOdgjSchedulePayload;
    }) =>
      odgjResidentService.updateSchedule(odgjResidentId, scheduleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odgj-residents"] });
    },
  });
};

export const useDeleteOdgjSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      odgjResidentId,
      scheduleId,
    }: {
      odgjResidentId: string;
      scheduleId: string;
    }) => odgjResidentService.deleteSchedule(odgjResidentId, scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odgj-residents"] });
    },
  });
};
