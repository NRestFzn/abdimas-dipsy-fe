import type {
  CreateOdgjResidentPayload,
  CreateOdgjSchedulePayload,
  GetOdgjResidentParams,
  OdgjResidentResponse,
  UpdateOdgjResidentPayload,
  UpdateOdgjSchedulePayload,
} from "../../../types/odgjResidentType";
import { api } from "../../api";

export const odgjResidentService = {
  getAll: async (params?: GetOdgjResidentParams) => {
    const response = await api.get<OdgjResidentResponse>("/v1/odgj-resident", {
      params,
    });
    return response.data;
  },

  create: async (payload: CreateOdgjResidentPayload) => {
    const response = await api.post("/v1/odgj-resident", payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateOdgjResidentPayload) => {
    const response = await api.put(`/v1/odgj-resident/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/v1/odgj-resident/${id}`);
    return response.data;
  },

  createSchedule: async (
    odgjResidentId: string,
    payload: CreateOdgjSchedulePayload
  ) => {
    const response = await api.post(
      `/v1/odgj-resident/${odgjResidentId}/schedules`,
      payload
    );
    return response.data;
  },

  updateSchedule: async (
    odgjResidentId: string,
    scheduleId: string,
    payload: UpdateOdgjSchedulePayload
  ) => {
    const response = await api.put(
      `/v1/odgj-resident/${odgjResidentId}/schedules/${scheduleId}`,
      payload
    );
    return response.data;
  },

  deleteSchedule: async (odgjResidentId: string, scheduleId: string) => {
    const response = await api.delete(
      `/v1/odgj-resident/${odgjResidentId}/schedules/${scheduleId}`
    );
    return response.data;
  },
};
