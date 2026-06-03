import type { Dayjs } from "dayjs";
import type { OdgjScheduleRecurrenceType } from "../../../../../types/odgjResidentType";

export interface ScheduleRecurrenceFormValues {
  examinationDate?: Dayjs;
  isRecurring?: boolean;
  recurrenceType?: OdgjScheduleRecurrenceType;
  recurrenceCount?: number;
}

export const scheduleRecurrenceInitialValues = {
  isRecurring: false,
  recurrenceType: "weekly" as const,
  recurrenceCount: 2,
};
