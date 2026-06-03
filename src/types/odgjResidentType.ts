import type { ResponseData } from "./commons";
import type { ResidentData } from "./Resident/residentType";

export type OdgjScheduleStatus = "scheduled" | "completed" | "missed";
export type OdgjScheduleRecurrenceType = "weekly" | "monthly";

export interface OdgjScheduleRecurrencePayload {
  recurrenceType?: OdgjScheduleRecurrenceType;
  recurrenceCount?: number;
}

export interface OdgjScheduleData {
  id: string;
  OdgjResidentId: string;
  examinationDate: string;
  status: OdgjScheduleStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OdgjResidentData {
  id: string;
  UserId: string;
  notes?: string | null;
  resident?: ResidentData;
  schedules?: OdgjScheduleData[];
  createdAt: string;
  updatedAt: string;
}

export interface GetOdgjResidentParams {
  page?: number;
  pageSize?: number;
  fullname?: string;
  startDate?: string;
  endDate?: string;
  order?: string;
}

export interface CreateOdgjResidentPayload extends OdgjScheduleRecurrencePayload {
  UserId: string;
  examinationDate: string;
  status?: OdgjScheduleStatus;
  notes?: string | null;
}

export interface UpdateOdgjResidentPayload {
  notes?: string | null;
}

export interface CreateOdgjSchedulePayload extends OdgjScheduleRecurrencePayload {
  examinationDate: string;
  status?: OdgjScheduleStatus;
  notes?: string | null;
}

export interface UpdateOdgjSchedulePayload {
  examinationDate: string;
  status: OdgjScheduleStatus;
  notes?: string | null;
}

export type OdgjResidentResponse = ResponseData<OdgjResidentData[]>;
