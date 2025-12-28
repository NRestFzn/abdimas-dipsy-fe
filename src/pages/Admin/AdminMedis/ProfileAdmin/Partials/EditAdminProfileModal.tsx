import {useEffect} from 'react';
import {Modal, Form, Input, Select, DatePicker, Button, message} from 'antd';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import dayjs from 'dayjs';
import type {AdminProfile} from '../../../../../types/adminMedisService';
import {adminMedisService} from '../../../../../service/adminMedisService';

interface EditAdminProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialData: AdminProfile;
}

export default function EditAdminProfileModal({
  open,
  onClose,
  initialData,
}: EditAdminProfileModalProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: adminMedisService.updateProfile,
    onSuccess: () => {
      message.success('Profil Admin berhasil diperbarui');
      queryClient.invalidateQueries({queryKey: ['admin-medis', 'me']});
      onClose();
      form.resetFields(['newPassword', 'confirmNewPassword']);
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || 'Gagal memperbarui profil'
      );
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        fullname: initialData.fullname,
        gender: initialData.gender,
        email: initialData.email,
        birthDate: initialData.birthDate ? dayjs(initialData.birthDate) : null,
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: any) => {
    const payload = {
      fullname: values.fullname,
      gender: values.gender,
      birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : '',
      ...(values.newPassword
        ? {
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmNewPassword,
          }
        : {}),
    };

    updateMutation.mutate(payload as any);
  };

  return (
    <Modal
      title="Edit Profil Admin"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <br />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={updateMutation.isPending}
      >
        <Form.Item
          label="Nama Lengkap"
          name="fullname"
          rules={[{required: true, message: 'Nama lengkap wajib diisi'}]}
        >
          <Input placeholder="Nama Lengkap" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {required: true, message: 'Email wajib diisi'},
            {type: 'email', message: 'Format email tidak valid'},
          ]}
        >
          <Input placeholder="Contoh: nama@email.com" />
        </Form.Item>

        <Form.Item
          label="Jenis Kelamin"
          name="gender"
          rules={[{required: true, message: 'Pilih jenis kelamin'}]}
        >
          <Select
            options={[
              {label: 'Laki-laki', value: 'm'},
              {label: 'Perempuan', value: 'f'},
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Tanggal Lahir"
          name="birthDate"
          rules={[{required: true, message: 'Tanggal lahir wajib diisi'}]}
        >
          <DatePicker className="w-full" format="DD MMMM YYYY" />
        </Form.Item>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 mt-4">
          <p className="text-xs text-gray-500 font-bold mb-3 uppercase">
            Ubah Password (Opsional)
          </p>
          <Form.Item
            label="Password Baru"
            name="newPassword"
            rules={[{min: 8, message: 'Minimal 8 karakter'}]}
          >
            <Input.Password placeholder="Kosongkan jika tidak ubah" />
          </Form.Item>

          <Form.Item
            label="Konfirmasi Password"
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  if (!getFieldValue('newPassword') && !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password tidak cocok!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Ulangi password baru" />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} disabled={updateMutation.isPending}>
            Batal
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateMutation.isPending}
            className="bg-[#70B748] hover:bg-[#5a9639]"
          >
            Simpan
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
