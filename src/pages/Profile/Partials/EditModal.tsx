import {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Alert, Row, Col, Select} from 'antd';
import {Info} from 'lucide-react';
import {useUpdateProfile} from '../../../hooks/useResident';
import {getErrorMessage} from '../../../utils/getErrorMessage';
import {useMasterData} from '../../../hooks/useMasterData';
import type { ResidentMe } from '../../../types/Resident/residentType';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialData: ResidentMe;
}

export default function EditProfileModal({
  open,
  onClose,
  initialData,
}: EditProfileModalProps) {
  const [form] = Form.useForm();
  const updateMutation = useUpdateProfile();

  const [errorMsg, setErrorMsg] = useState('');

  const {salaryRanges} = useMasterData();

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        phoneNumber: initialData.userDetail.phoneNumber,
        SalaryRangeId: initialData.userDetail?.salaryRange?.id,
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: any) => {
    const payload = {
      phoneNumber: values.phoneNumber,
      SalaryRangeId: values.SalaryRangeId,
      ...(values.newPassword
        ? {
            password: values.newPassword,
            confirmNewPassword: values.confirmNewPassword,
          }
        : {}),
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
        form.resetFields(['newPassword', 'confirmNewPassword']);
      },
      onError: (err) => {
        const msg = getErrorMessage(err);
        setErrorMsg(msg);
      },
    });
  };

  return (
    <Modal
      title="Edit Profil"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
    >
      <Alert
        title="Perbarui Data Diri"
        description="Pastikan data pekerjaan dan pendidikan yang Anda masukkan adalah data terbaru."
        type="info"
        showIcon
        icon={<Info size={20} />}
        className="mb-6 bg-blue-50 border-blue-200 text-blue-800"
      />

      <br />

      {errorMsg && (
        <Alert
          title="Gagal Menyimpan"
          description={errorMsg}
          type="error"
          showIcon
        />
      )}

      <br />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={updateMutation.isPending}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nomor Telepon"
              name="phoneNumber"
              rules={[{required: true, message: 'Nomor telepon wajib diisi'}]}
            >
              <Input placeholder="Contoh: 08123456789" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Rentang Gaji"
              name="SalaryRangeId"
              rules={[{required: true, message: 'Pilih rentang gaji'}]}
            >
              <Select
                placeholder="Pilih Rentang Gaji"
                loading={salaryRanges.isLoading}
              >
                {salaryRanges.data?.map((salary) => (
                  <Select.Option key={salary.id} value={salary.id}>
                    Rp {parseInt(salary.minRange).toLocaleString()} - Rp{' '}
                    {parseInt(salary.maxRange).toLocaleString()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 mt-2">
          <p className="text-xs text-gray-500 font-bold mb-3 uppercase">
            Ubah Password (Opsional)
          </p>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Password Baru"
                name="newPassword"
                rules={[{min: 8, message: 'Min 8 karakter'}]}
              >
                <Input.Password placeholder="Kosongkan jika tidak ubah" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
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
            Simpan Perubahan
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
