import { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Row,
  Col,
  Checkbox,
  Typography,
  Space,
} from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { adminDesaService } from '../../../../../service/adminDesaService';
import { useMasterData } from '../../../../../hooks/useMasterData';
import { useInfiniteSelectOptions } from '../../../../../hooks/Common/useInfiniteSelectOptions';
import { residentService } from '../../../../../service/Admin/AdminDesa/residentServices';

interface EditResidentModalProps {
  open: boolean;
  onClose: () => void;
  residentId: string | null;
}

export default function EditResidentModal({
  open,
  onClose,
  residentId,
}: EditResidentModalProps) {
  const [form] = Form.useForm();
  const [revealForm] = Form.useForm();

  const queryClient = useQueryClient();

  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);
  const [isNikRevealed, setIsNikRevealed] = useState(false);

  const { educations, salaryRanges, marriageStatuses, infiniteRukunWarga, infiniteRukunTetangga } = useMasterData();

  const [selectedRW, setSelectedRW] = useState<string | null>(null);

  const rwQuery = infiniteRukunWarga(20);
  const {
    options: rwOptions,
    onPopupScroll: onRWScroll,
    isLoading: loadingRW,
    isFetchingNextPage: fetchingNextRW
  } = useInfiniteSelectOptions({
    queryResult: rwQuery,
    labelKey: (item: any) => `RW ${item.name}`,
    valueKey: 'id'
  });

  const rtQuery = infiniteRukunTetangga(20, selectedRW);
  const {
    options: rtOptions,
    onPopupScroll: onRTScroll,
    isLoading: loadingRT,
    isFetchingNextPage: fetchingNextRT
  } = useInfiniteSelectOptions({
    queryResult: rtQuery,
    labelKey: (item: any) => `RT ${item.name}`,
    valueKey: 'id'
  });

  const handleRWChange = (val: string) => {
    setSelectedRW(val);
    form.setFieldValue("RukunTetanggaId", undefined);
  };

  const { data: residentDetail, isLoading: isFetchingDetail } = useQuery({
    queryKey: ['resident-detail', residentId],
    queryFn: () => adminDesaService.getResidentDetail(residentId!),
    enabled: !!residentId && open,
  });

  const updateMutation = useMutation({
    mutationFn: (values: any) =>
      adminDesaService.updateResident(residentId!, values),
    onSuccess: () => {
      message.success('Data warga berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      onClose();
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Gagal mengupdate data');
    },
  });

  const revealMutation = useMutation({
    mutationFn: (password: string) => residentService.revealResidentNik(residentId!, password),
    onSuccess: (response) => {
      message.success("Verifikasi berhasil, NIK ditampilkan");

      const realNik = response.data.userDetail.nik;

      form.setFieldValue('nik', realNik);

      setIsNikRevealed(true);

      setIsRevealModalOpen(false);
      revealForm.resetFields();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Password salah atau terjadi kesalahan");
    }
  });

  useEffect(() => {
    if (residentDetail?.data) {
      const data = residentDetail.data;
      const detail = data.userDetail;

      setSelectedRW(detail?.RukunWargaId);

      setIsNikRevealed(false);

      form.setFieldsValue({
        fullname: data.fullname,
        email: data.email,
        phoneNumber: detail?.phoneNumber,
        gender: detail?.gender,
        birthDate: dayjs(data.birthDate),
        nik: detail?.nik,
        isKader: detail?.isKader,
        profession: detail?.profession,
        MarriageStatusId: detail?.MarriageStatusId,
        RukunWargaId: detail?.RukunWargaId,
        RukunTetanggaId: detail?.RukunTetanggaId,
        EducationId: detail?.EducationId,
        SalaryRangeId: detail?.SalaryRangeId,
      });
    }
  }, [residentDetail, form]);

  const handleSubmit = (values: any) => {
    if (values.nik.includes('*')) {
      message.error("Harap buka sensor NIK terlebih dahulu sebelum menyimpan perubahan.");
      return;
    }

    const payload = {
      ...values,
      birthDate: values.birthDate.format('YYYY-MM-DD'),
      password: values.password || undefined,
      confirmPassword: values.confirmPassword || undefined,
    };
    updateMutation.mutate(payload);
  };

  const handleRevealSubmit = (values: { passwordReveal: string }) => {
    revealMutation.mutate(values.passwordReveal);
  };

  return (
    <>
      <Modal
        title="Edit Data Warga"
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
        style={{ top: 20 }}
        centered
      >
        {isFetchingDetail ? (
          <div className="flex justify-center p-8">
            <Spin />
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">
              Informasi Akun
            </h3>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nama Lengkap"
                  name="fullname"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nomor Telepon"
                  name="phoneNumber"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  rules={[
                    { min: 8, message: 'Password minimal berisi 8 karakter' },
                  ]}
                  label="Password Baru (Opsional)"
                  name="password"
                >
                  <Input.Password placeholder="Kosongkan jika tidak diubah" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Konfirmasi Password"
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        if (!getFieldValue('password') && !value)
                          return Promise.resolve();
                        return Promise.reject(new Error('Password tidak cocok!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Ulangi password" />
                </Form.Item>
              </Col>
            </Row>

            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 mt-6">
              Data Kependudukan
            </h3>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="NIK"
                  required
                  help={!isNikRevealed ? "NIK disensor demi keamanan." : null}
                  style={{ marginBottom: 24 }} // Menjaga spacing agar error message tidak dempet
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item
                      name="nik"
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Input
                        style={{ width: 'calc(100% - 90px)' }}
                        disabled={!isNikRevealed}
                        placeholder="NIK Warga"
                      />
                    </Form.Item>

                    <Button
                      style={{ width: '90px' }}
                      icon={isNikRevealed ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      onClick={() => {
                        if (!isNikRevealed) {
                          setIsRevealModalOpen(true);
                        }
                      }}
                      disabled={isNikRevealed}
                    >
                      {isNikRevealed ? "Terbuka" : "Buka"}
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Jenis Kelamin"
                  name="gender"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { label: 'Laki-laki', value: 'm' },
                      { label: 'Perempuan', value: 'f' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Tanggal Lahir"
                  name="birthDate"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    className="w-full"
                    style={{ width: '100%' }}
                    format="DD MMMM YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Status Pernikahan"
                  name="MarriageStatusId"
                  rules={[{ required: true }]}
                >
                  <Select
                    loading={marriageStatuses.isLoading}
                    options={marriageStatuses.data?.map((m: any) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Pekerjaan"
                  name="profession"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Pendidikan"
                  name="EducationId"
                  rules={[{ required: true }]}
                >
                  <Select
                    loading={educations.isLoading}
                    options={educations.data?.map((e: any) => ({
                      label: e.name,
                      value: e.id,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Rentang Gaji"
                  name="SalaryRangeId"
                  rules={[{ required: true }]}
                >
                  <Select
                    loading={salaryRanges.isLoading}
                    options={salaryRanges.data?.map((s: any) => ({
                      label: `Rp ${parseInt(
                        s.minRange
                      ).toLocaleString()} - ${parseInt(
                        s.maxRange
                      ).toLocaleString()}`,
                      value: s.id,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 mt-6">
              Wilayah Domisili
            </h3>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Rukun Warga (RW)"
                  name="RukunWargaId"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Pilih RW"
                    onChange={handleRWChange}
                    options={rwOptions}
                    loading={loadingRW}
                    onPopupScroll={onRWScroll}
                    notFoundContent={fetchingNextRW ? <Spin size="small" /> : null}
                    showSearch={{
                      filterOption: (input, option) =>
                        (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Rukun Tetangga (RT)"
                  name="RukunTetanggaId"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder={!selectedRW ? "Pilih RW Terlebih Dahulu" : "Pilih RT"}
                    disabled={!selectedRW}
                    options={rtOptions}
                    loading={loadingRT}
                    onPopupScroll={onRTScroll}
                    notFoundContent={fetchingNextRT ? <Spin size="small" /> : null}
                    showSearch={{
                      filterOption: (input, option) =>
                        (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                    }}
                  />
                </Form.Item>
              </Col>

              <div className="my-4 border-t border-gray-100" />

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Row align="middle" gutter={[16, 0]}>
                  <Col flex="auto">
                    <Form.Item
                      name="isKader"
                      valuePropName="checked"
                      className="!mb-0"
                    >
                      <Checkbox className="!text-gray-800 font-semibold text-base">
                        Tetapkan Sebagai Petugas Kader?
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Typography.Text className="text-gray-500 text-xs mt-1 block pl-6">
                  Jika dicentang, warga ini akan memiliki akses ganda sebagai <b>Kader Kesehatan</b>.
                  Mereka dapat masuk ke dashboard khusus untuk membantu warga lain mengisi kuisioner.
                </Typography.Text>
              </div>
            </Row>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={onClose}>Batal</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateMutation.isPending}
                className="bg-[#70B748]"
              >
                Simpan Perubahan
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      <Modal
        title="Verifikasi Keamanan"
        open={isRevealModalOpen}
        onCancel={() => {
          setIsRevealModalOpen(false);
          revealForm.resetFields();
        }}
        footer={null}
        width={400}
        centered
        zIndex={1050} // Pastikan di atas modal edit (default antd modal z-index biasanya 1000)
      >
        <Typography.Text className="block mb-4">
          Masukkan password Admin Anda untuk melihat dan mengedit NIK warga ini.
        </Typography.Text>

        <Form form={revealForm} layout="vertical" onFinish={handleRevealSubmit}>
          <Form.Item
            name="passwordReveal"
            label="Password Admin"
            rules={[{ required: true, message: 'Password wajib diisi' }]}
          >
            <Input.Password placeholder="Masukkan password Anda" autoFocus />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsRevealModalOpen(false)}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={revealMutation.isPending}
              className="bg-blue-600"
            >
              Verifikasi
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
