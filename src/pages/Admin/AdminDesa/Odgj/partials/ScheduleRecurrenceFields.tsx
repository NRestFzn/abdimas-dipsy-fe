import { Checkbox, DatePicker, Form, InputNumber, Segmented } from "antd";
import type { FormInstance } from "antd";
import dayjs from "dayjs";
import type { ScheduleRecurrenceFormValues } from "./scheduleRecurrenceForm";

interface ScheduleRecurrenceFieldsProps<
  T extends ScheduleRecurrenceFormValues
> {
  form: FormInstance<T>;
}

export default function ScheduleRecurrenceFields<
  T extends ScheduleRecurrenceFormValues
>({ form }: ScheduleRecurrenceFieldsProps<T>) {
  const examinationDate = Form.useWatch("examinationDate", form);
  const isRecurring = Form.useWatch("isRecurring", form);
  const recurrenceType = Form.useWatch("recurrenceType", form);
  const recurrenceCount = Form.useWatch("recurrenceCount", form);

  const endDate =
    isRecurring &&
    dayjs.isDayjs(examinationDate) &&
    recurrenceType &&
    recurrenceCount &&
    recurrenceCount >= 2
      ? examinationDate.add(
          recurrenceCount - 1,
          recurrenceType === "weekly" ? "week" : "month"
        )
      : null;

  return (
    <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3">
      <Form.Item name="isRecurring" valuePropName="checked" className="!mb-0">
        <Checkbox className="font-medium text-gray-800">
          Jadwal berulang
        </Checkbox>
      </Form.Item>

      {isRecurring && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Form.Item
            label="Pola Pengulangan"
            name="recurrenceType"
            rules={[
              { required: true, message: "Pola pengulangan wajib dipilih" },
            ]}
            className="!mb-0"
          >
            <Segmented
              block
              options={[
                { label: "Mingguan", value: "weekly" },
                { label: "Bulanan", value: "monthly" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Jumlah Pertemuan"
            name="recurrenceCount"
            rules={[
              { required: true, message: "Jumlah pertemuan wajib diisi" },
              {
                type: "number",
                min: 2,
                message: "Minimal 2 pertemuan",
              },
              {
                type: "number",
                max: 120,
                message: "Maksimal 120 pertemuan",
              },
            ]}
            className="!mb-0"
          >
            <InputNumber
              min={2}
              max={120}
              precision={0}
              className="!w-full"
              placeholder="Jumlah pertemuan"
            />
          </Form.Item>

          <Form.Item label="Tanggal Berakhir" className="!mb-0 sm:col-span-2">
            <DatePicker
              value={endDate}
              className="w-full"
              format="DD MMMM YYYY"
              placeholder="Pilih tanggal pemeriksaan"
              disabled
            />
          </Form.Item>
        </div>
      )}
    </div>
  );
}
