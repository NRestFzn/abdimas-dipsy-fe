import { useEffect } from "react";
import { App, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import {
  useCreateOdgjSchedule,
  useUpdateOdgjSchedule,
} from "../../../../../hooks/Admin/AdminDesa/useOdgjResident";
import type {
  OdgjResidentData,
  OdgjScheduleData,
  OdgjScheduleStatus,
} from "../../../../../types/odgjResidentType";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import ScheduleRecurrenceFields from "./ScheduleRecurrenceFields";
import {
  scheduleRecurrenceInitialValues,
  type ScheduleRecurrenceFormValues,
} from "./scheduleRecurrenceForm";

interface ScheduleFormValues extends ScheduleRecurrenceFormValues {
  status?: OdgjScheduleStatus;
  notes?: string | null;
}

interface ScheduleFormModalProps {
  open: boolean;
  odgjResident: OdgjResidentData | null;
  editingSchedule: OdgjScheduleData | null;
  onCancel: () => void;
}

export default function ScheduleFormModal({
  open,
  odgjResident,
  editingSchedule,
  onCancel,
}: ScheduleFormModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<ScheduleFormValues>();
  const createSchedule = useCreateOdgjSchedule();
  const updateSchedule = useUpdateOdgjSchedule();

  useEffect(() => {
    if (!open) return;

    form.resetFields();

    if (editingSchedule) {
      form.setFieldsValue({
        examinationDate: dayjs(editingSchedule.examinationDate),
        status: editingSchedule.status,
        notes: editingSchedule.notes,
      });
      return;
    }

    form.setFieldsValue({
      status: "scheduled",
      ...scheduleRecurrenceInitialValues,
    });
  }, [editingSchedule, form, open]);

  const handleClose = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: ScheduleFormValues) => {
    if (!odgjResident || !values.examinationDate || !values.status) return;

    const payload = {
      examinationDate: values.examinationDate.format("YYYY-MM-DD"),
      status: values.status,
      notes: values.notes || null,
      ...(!editingSchedule && values.isRecurring
        ? {
            recurrenceType: values.recurrenceType,
            recurrenceCount: values.recurrenceCount,
          }
        : {}),
    };

    if (editingSchedule) {
      updateSchedule.mutate(
        {
          odgjResidentId: odgjResident.id,
          scheduleId: editingSchedule.id,
          payload,
        },
        {
          onSuccess: () => {
            message.success("Jadwal pemeriksaan berhasil diperbarui");
            handleClose();
          },
          onError: (error) => message.error(getErrorMessage(error)),
        }
      );
      return;
    }

    createSchedule.mutate(
      {
        odgjResidentId: odgjResident.id,
        payload,
      },
      {
        onSuccess: () => {
          message.success(
            values.isRecurring
              ? `${values.recurrenceCount} jadwal pemeriksaan berhasil ditambahkan`
              : "Jadwal pemeriksaan berhasil ditambahkan"
          );
          handleClose();
        },
        onError: (error) => message.error(getErrorMessage(error)),
      }
    );
  };

  const isPending = createSchedule.isPending || updateSchedule.isPending;

  return (
    <Modal
      title={editingSchedule ? "Edit Jadwal Pemeriksaan" : "Tambah Jadwal"}
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText={editingSchedule ? "Simpan Perubahan" : "Simpan"}
      cancelText="Batal"
      centered
      destroyOnHidden
      okButtonProps={{ className: "!bg-[#70B748]" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tanggal Pemeriksaan"
          name="examinationDate"
          rules={[{ required: true, message: "Tanggal pemeriksaan wajib diisi" }]}
        >
          <DatePicker
            className="w-full"
            format="DD MMMM YYYY"
            placeholder="Pilih tanggal"
          />
        </Form.Item>

        {!editingSchedule && <ScheduleRecurrenceFields form={form} />}

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Status wajib dipilih" }]}
          initialValue="scheduled"
        >
          <Select
            options={[
              { value: "scheduled", label: "Terjadwal" },
              { value: "completed", label: "Sudah" },
              { value: "missed", label: "Terlewat" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Catatan Jadwal" name="notes">
          <Input.TextArea
            rows={4}
            placeholder="Catatan singkat pemeriksaan"
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
