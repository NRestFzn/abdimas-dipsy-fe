import { useEffect, useMemo, useState } from "react";
import { Calendar, Empty, Modal, Spin, Tag } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import type { OdgjResidentData } from "../../../../../types/odgjResidentType";
import {
  flattenSchedules,
  formatDate,
  getDisplayScheduleStatus,
  getPrimarySchedule,
  scheduleStatusColor,
  scheduleStatusLabel,
} from "../odgjUtils";

interface ScheduleCalendarModalProps {
  open: boolean;
  records: OdgjResidentData[];
  focusRecord: OdgjResidentData | null;
  loading: boolean;
  onClose: () => void;
}

export default function ScheduleCalendarModal({
  open,
  records,
  focusRecord,
  loading,
  onClose,
}: ScheduleCalendarModalProps) {
  const focusSchedule = getPrimarySchedule(focusRecord?.schedules);
  const [calendarValue, setCalendarValue] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const schedules = useMemo(() => flattenSchedules(records), [records]);

  useEffect(() => {
    if (!open) return;

    const nextValue = focusSchedule?.examinationDate
      ? dayjs(focusSchedule.examinationDate)
      : dayjs();

    setCalendarValue(nextValue);
    setSelectedDate(nextValue.format("YYYY-MM-DD"));
  }, [focusSchedule?.examinationDate, open]);

  const schedulesByDate = useMemo(() => {
    const map = new Map<string, typeof schedules>();

    schedules.forEach((schedule) => {
      const key = dayjs(schedule.examinationDate).format("YYYY-MM-DD");
      const current = map.get(key) || [];
      map.set(key, [...current, schedule]);
    });

    return map;
  }, [schedules]);

  const selectedSchedules = schedulesByDate.get(selectedDate) || [];

  const cellRender = (current: Dayjs, info: any) => {
    if (info.type !== "date") return info.originNode;

    const dateKey = current.format("YYYY-MM-DD");
    const daySchedules = schedulesByDate.get(dateKey) || [];

    if (!daySchedules.length) return null;

    return (
      <div className="odgj-calendar-events">
        {daySchedules.slice(0, 3).map((schedule) => {
          const status = getDisplayScheduleStatus(schedule);

          return (
            <div
              key={schedule.id}
              className={`odgj-calendar-event odgj-calendar-event-${status}`}
              title={schedule.odgjResident.resident?.fullname}
            >
              {schedule.odgjResident.resident?.fullname || "Warga"}
            </div>
          );
        })}
        {daySchedules.length > 3 && (
          <div className="text-[11px] text-gray-500">
            +{daySchedules.length - 3} jadwal
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      title="Kalender Pemeriksaan ODGJ"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1040}
      centered
      className="odgj-calendar-modal"
    >
      <Spin spinning={loading}>
        <Calendar
          value={calendarValue}
          fullscreen
          cellRender={cellRender}
          onSelect={(date) => {
            setCalendarValue(date);
            setSelectedDate(date.format("YYYY-MM-DD"));
          }}
          onPanelChange={(date) => setCalendarValue(date)}
        />

        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-semibold text-gray-800">
              {formatDate(selectedDate)}
            </p>
            <Tag color={selectedSchedules.length ? "green" : "default"}>
              {selectedSchedules.length} jadwal
            </Tag>
          </div>

          {selectedSchedules.length ? (
            <div className="grid gap-2 md:grid-cols-2">
              {selectedSchedules.map((schedule) => {
                const status = getDisplayScheduleStatus(schedule);

                return (
                  <div
                    key={schedule.id}
                    className="rounded-md border border-gray-200 bg-white p-3"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="font-medium text-gray-800">
                        {schedule.odgjResident.resident?.fullname || "-"}
                      </p>
                      <Tag color={scheduleStatusColor[status]}>
                        {scheduleStatusLabel[status]}
                      </Tag>
                    </div>
                    <p className="text-sm text-gray-500">
                      RW{" "}
                      {schedule.odgjResident.resident?.userDetail?.rukunWarga
                        ?.name || "-"}{" "}
                      / RT{" "}
                      {schedule.odgjResident.resident?.userDetail?.rukunTetangga
                        ?.name || "-"}
                    </p>
                    {schedule.notes && (
                      <p className="mt-2 text-sm text-gray-600">
                        {schedule.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Tidak ada jadwal"
            />
          )}
        </div>
      </Spin>
    </Modal>
  );
}
