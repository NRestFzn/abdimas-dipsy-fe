import dayjs from "dayjs";
import type {
  OdgjResidentData,
  OdgjScheduleData,
  OdgjScheduleStatus,
} from "../../../../types/odgjResidentType";

export interface OdgjCalendarSchedule extends OdgjScheduleData {
  odgjResident: OdgjResidentData;
}

export const scheduleStatusLabel: Record<OdgjScheduleStatus, string> = {
  scheduled: "Terjadwal",
  completed: "Sudah",
  missed: "Terlewat",
};

export const scheduleStatusColor: Record<OdgjScheduleStatus, string> = {
  scheduled: "blue",
  completed: "green",
  missed: "orange",
};

export const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const getDisplayScheduleStatus = (
  schedule: Pick<OdgjScheduleData, "examinationDate" | "status">
): OdgjScheduleStatus => {
  if (schedule.status !== "scheduled") return schedule.status;

  const examinationDate = dayjs(schedule.examinationDate).startOf("day");
  const today = dayjs().startOf("day");

  return examinationDate.isBefore(today) ? "missed" : "scheduled";
};

export const sortSchedules = (schedules?: OdgjScheduleData[]) => {
  return [...(schedules || [])].sort((a, b) =>
    dayjs(a.examinationDate).diff(dayjs(b.examinationDate))
  );
};

export const getPrimarySchedule = (schedules?: OdgjScheduleData[]) => {
  const sorted = sortSchedules(schedules);
  const today = dayjs().startOf("day");

  return (
    sorted.find((schedule) => {
      const status = getDisplayScheduleStatus(schedule);
      return (
        status === "scheduled" &&
        !dayjs(schedule.examinationDate).startOf("day").isBefore(today)
      );
    }) ||
    sorted[sorted.length - 1] ||
    null
  );
};

export const flattenSchedules = (records: OdgjResidentData[]) => {
  return records.flatMap((record) =>
    (record.schedules || []).map((schedule) => ({
      ...schedule,
      odgjResident: record,
    }))
  );
};
