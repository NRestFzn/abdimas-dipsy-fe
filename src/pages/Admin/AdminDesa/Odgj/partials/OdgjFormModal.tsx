import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  App,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Spin,
} from 'antd';
import {
  useCreateOdgjResident,
  useUpdateOdgjResident,
} from '../../../../../hooks/Admin/AdminDesa/useOdgjResident';
import {residentService} from '../../../../../service/Admin/AdminDesa/residentServices';
import type {
  OdgjResidentData,
  OdgjScheduleStatus,
} from '../../../../../types/odgjResidentType';
import {getErrorMessage} from '../../../../../utils/getErrorMessage';
import ScheduleRecurrenceFields from './ScheduleRecurrenceFields';
import {
  scheduleRecurrenceInitialValues,
  type ScheduleRecurrenceFormValues,
} from './scheduleRecurrenceForm';

interface OdgjFormValues extends ScheduleRecurrenceFormValues {
  UserId?: string;
  status?: OdgjScheduleStatus;
  notes?: string | null;
}

interface OdgjFormModalProps {
  open: boolean;
  editingData: OdgjResidentData | null;
  onCancel: () => void;
}

export default function OdgjFormModal({
  open,
  editingData,
  onCancel,
}: OdgjFormModalProps) {
  const {message} = App.useApp();
  const [form] = Form.useForm<OdgjFormValues>();
  const [residentSearch, setResidentSearch] = useState('');

  const createMutation = useCreateOdgjResident();
  const updateMutation = useUpdateOdgjResident();

  const {data: residentsResponse, isFetching: isFetchingResidents} = useQuery({
    queryKey: ['odgj-resident-options', residentSearch],
    enabled: open && !editingData,
    queryFn: () =>
      residentService.getAllResidents({
        page: 1,
        pageSize: 20,
        fullname: residentSearch || undefined,
        order: '[["fullname", "asc"]]',
      }),
  });

  useEffect(() => {
    if (!open) return;

    form.resetFields();

    if (editingData) {
      form.setFieldsValue({notes: editingData.notes});
      return;
    }

    form.setFieldsValue({
      status: 'scheduled',
      ...scheduleRecurrenceInitialValues,
    });
    setResidentSearch('');
  }, [editingData, form, open]);

  const handleClose = () => {
    form.resetFields();
    setResidentSearch('');
    onCancel();
  };

  const handleSubmit = (values: OdgjFormValues) => {
    if (editingData) {
      updateMutation.mutate(
        {
          id: editingData.id,
          payload: {notes: values.notes || null},
        },
        {
          onSuccess: () => {
            message.success('Catatan warga ODGJ berhasil diperbarui');
            handleClose();
          },
          onError: (error) => message.error(getErrorMessage(error)),
        },
      );
      return;
    }

    if (!values.UserId || !values.examinationDate) return;

    createMutation.mutate(
      {
        UserId: values.UserId,
        examinationDate: values.examinationDate.format('YYYY-MM-DD'),
        status: values.status,
        notes: values.notes || null,
        ...(values.isRecurring
          ? {
              recurrenceType: values.recurrenceType,
              recurrenceCount: values.recurrenceCount,
            }
          : {}),
      },
      {
        onSuccess: () => {
          message.success('Warga ODGJ berhasil ditambahkan');
          handleClose();
        },
        onError: (error) => message.error(getErrorMessage(error)),
      },
    );
  };

  const residentOptions =
    residentsResponse?.data?.map((resident) => ({
      value: resident.id,
      label: (
        <div className="flex flex-col leading-tight">
          <span className="font-medium text-gray-800">{resident.fullname}</span>
          <span className="text-xs text-gray-500">
            NIK {resident.userDetail?.nik || '-'}
          </span>
        </div>
      ),
    })) || [];

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={editingData ? 'Ubah Catatan ODGJ' : 'Tambah Warga ODGJ'}
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText={editingData ? 'Simpan Perubahan' : 'Simpan'}
      cancelText="Batal"
      width={560}
      centered
      destroyOnHidden
      okButtonProps={{className: '!bg-[#70B748]'}}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {!editingData && (
          <>
            <Form.Item
              label="Warga"
              name="UserId"
              rules={[{required: true, message: 'Warga wajib dipilih'}]}
            >
              <Select
                showSearch
                filterOption={false}
                placeholder="Cari nama warga"
                onSearch={setResidentSearch}
                options={residentOptions}
                loading={isFetchingResidents}
                notFoundContent={
                  isFetchingResidents ? (
                    <Spin size="small" />
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Pemeriksaan Awal"
              name="examinationDate"
              rules={[
                {required: true, message: 'Tanggal pemeriksaan wajib diisi'},
              ]}
            >
              <DatePicker
                className="w-full"
                format="DD MMMM YYYY"
                placeholder="Pilih tanggal"
              />
            </Form.Item>

            <ScheduleRecurrenceFields form={form} />

            <Form.Item
              label="Status Jadwal Awal"
              name="status"
              rules={[{required: true, message: 'Status wajib dipilih'}]}
              initialValue="scheduled"
            >
              <Select
                options={[
                  {value: 'scheduled', label: 'Terjadwal'},
                  {value: 'completed', label: 'Sudah'},
                  {value: 'missed', label: 'Terlewat'},
                ]}
              />
            </Form.Item>
          </>
        )}

        {editingData && (
          <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3">
            <p className="text-sm text-gray-500">Warga</p>
            <p className="font-semibold text-gray-800">
              {editingData.resident?.fullname || '-'}
            </p>
          </div>
        )}

        <Form.Item label="Catatan" name="notes">
          <Input.TextArea
            rows={4}
            placeholder="Catatan umum untuk warga ODGJ"
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
