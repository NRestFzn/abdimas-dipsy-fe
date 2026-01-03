import { useMemo, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Modal,
  DatePicker,
  Radio,
  Alert,
  message,
  Spin,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  HomeOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useMasterData } from '../../hooks/useMasterData';
import { useNavigate } from 'react-router';
import type { RegisterPayload } from '../../types/AuthTypes/authTypes';

const { Option } = Select;

export default function Register() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedRW, setSelectedRW] = useState<string | null>(null);

  const [accountForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const { register, isLoading, error } = useAuth();
  const masterData = useMasterData();
  const { data: rukunWarga, isLoading: isLoadRw } = masterData.rukunWarga({
    order: '[["name", "asc"]]',
  });
  const { data: rukunTetangga, isLoading: isLoadRt } = masterData.rukunTetangga({
    order: '[["name", "asc"]]',
  });

  const isMasterDataLoading =
    masterData.educations.isLoading ||
    masterData.marriageStatuses.isLoading ||
    masterData.salaryRanges.isLoading ||
    isLoadRw ||
    isLoadRt;

  const filteredRTList = useMemo(() => {
    if (!selectedRW || !rukunTetangga) return [];

    return rukunTetangga?.filter((rt: any) => rt.RukunWargaId === selectedRW);
  }, [selectedRW, rukunTetangga]);

  const onAccountFinish = () => {
    setShowModal(true);
  };

  const onProfileFinish = async (profileValues: any) => {
    try {
      const accountValues = accountForm.getFieldsValue();

      const birthDateISO = profileValues.tanggalLahir
        ? profileValues.tanggalLahir.format('YYYY-MM-DD')
        : '';

      const payload: RegisterPayload = {
        email: accountValues.email || null,
        password: accountValues.password,
        confirmPassword: accountValues.confirmPassword,
        nik: accountValues.nik,
        fullname: profileValues.namaLengkap,
        gender: profileValues.gender,
        profession: profileValues.pekerjaan,
        birthDate: birthDateISO,
        MarriageStatusId: profileValues.statusPernikahan,
        RukunWargaId: accountValues.rw,
        RukunTetanggaId: accountValues.rt,
        EducationId: profileValues.pendidikan,
        SalaryRangeId: profileValues.gaji,
        phoneNumber: profileValues.noHp || null,
      };

      await register(payload);

      message.success('Registrasi berhasil!');
      accountForm.resetFields();
      profileForm.resetFields();
      setShowModal(false);

      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const renderErrorContent = (err: any) => {
    if (!err) return null;

    if (
      err.errors &&
      typeof err.errors === 'object' &&
      Object.keys(err.errors).length > 0
    ) {
      return (
        <ul className="list-disc pl-4 m-0 text-sm">
          {Object.entries(err.errors).map(([key, msg]) => (
            <li key={key}>
              <span className="font-semibold capitalize">{key}:</span>{' '}
              {String(msg)}
            </li>
          ))}
        </ul>
      );
    }

    if (err.message) return err.message;

    return String(err);
  };

  if (isMasterDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spin size="large" tip="Memuat data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center !text-[#70B748] mb-6">
          Daftarkan Diri Kamu!
        </h1>

        {error && (
          <Alert
            message="Gagal Mendaftar"
            description={renderErrorContent(error)}
            type="error"
            showIcon
            className="!mb-4"
          />
        )}

        <Form
          form={accountForm}
          layout="vertical"
          onFinish={onAccountFinish}
          className="mt-4"
          autoComplete="off"
        >
          <Form.Item
            label="NIK"
            name="nik"
            rules={[
              { required: true, message: 'NIK wajib diisi' },
              { len: 16, message: 'NIK harus 16 digit' },
              { pattern: /^[0-9]+$/, message: 'NIK harus berupa angka' },
            ]}
          >
            <Input
              prefix={<IdcardOutlined className="pr-1" />}
              placeholder="Masukkan 16 digit NIK"
              maxLength={16}
            />
          </Form.Item>

          <Form.Item
            label="Email (Optional)"
            name="email"
            rules={[
              { type: 'email', message: 'Format email tidak valid' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="pr-1" />}
              placeholder="Masukkan email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Password wajib diisi' },
              { min: 8, message: 'Password minimal berisi 8 karakter' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="pr-1" />}
              placeholder="Masukkan password"
            />
          </Form.Item>

          <Form.Item
            label="Konfirmasi Password"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Konfirmasi password wajib diisi' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Password yang Anda masukkan tidak sama!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="pr-1" />}
              placeholder="Ulangi password"
            />
          </Form.Item>

          <Form.Item
            label="Alamat"
            name="alamat"
            rules={[{ required: true, message: 'Alamat wajib diisi' }]}
          >
            <Input
              prefix={<HomeOutlined className="pr-1" />}
              placeholder="Masukkan alamat domisili"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="RW"
              name="rw"
              rules={[{ required: true, message: 'Pilih RW' }]}
            >
              <Select
                placeholder="Pilih RW"
                loading={isLoadRw}
                onChange={(value) => {
                  setSelectedRW(value);
                  accountForm.setFieldValue('rt', null);
                }}
              >
                {rukunWarga?.data?.map((rw: any) => (
                  <Option key={rw.id} value={rw.id}>
                    RW {rw.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="RT"
              name="rt"
              rules={[{ required: true, message: 'Pilih RT' }]}
            >
              <Select
                placeholder={selectedRW ? 'Pilih RT' : 'Pilih RW Dulu'}
                disabled={!selectedRW}
              >
                {filteredRTList?.map((rt: any) => (
                  <Option key={rt.id} value={rt.id}>
                    RT {rt.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="!bg-[#70B748] !hover:bg-green-600 h-10 font-medium"
            >
              Selanjutnya
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <span className="text-gray-600">Sudah punya akun? </span>
          <a
            href="/masuk-warga"
            className="!text-[#70B748] font-medium hover:underline"
          >
            Masuk
          </a>
        </div>
      </Card>

      <Modal
        title={
          <div className="text-center !text-[#70B748] font-bold text-xl">
            Lengkapi Data Diri
          </div>
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        width={600}
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={onProfileFinish}
          initialValues={{ gender: 'm' }}
        >
          {error && (
            <Alert
              message="Gagal Mendaftar"
              description={renderErrorContent(error)}
              type="error"
              className="!mb-4"
            />
          )}

          <Form.Item
            label="Nama Lengkap"
            name="namaLengkap"
            rules={[{ required: true, message: 'Nama lengkap wajib diisi' }]}
          >
            <Input placeholder="Masukkan nama lengkap" />
          </Form.Item>

          <Form.Item
            label="Nomor Handphone"
            name="noHp"
            rules={[
              { pattern: /^[0-9]+$/, message: 'Hanya boleh angka' },
              { min: 10, message: 'Minimal 10 digit' },
              { max: 15, message: 'Maksimal 15 digit' },
            ]}
          >
            <Input placeholder="Contoh: 081234567890" maxLength={15} />
          </Form.Item>

          <Form.Item
            label="Tanggal Lahir"
            name="tanggalLahir"
            rules={[{ required: true, message: 'Tanggal lahir wajib diisi' }]}
          >
            <DatePicker
              className="w-full"
              placeholder="Pilih tanggal lahir"
              format="DD MMMM YYYY"
            />
          </Form.Item>

          <Form.Item
            label="Jenis Kelamin"
            name="gender"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="m">Laki-laki</Radio>
              <Radio value="f">Perempuan</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Status Pernikahan"
            name="statusPernikahan"
            rules={[{ required: true, message: 'Pilih status pernikahan' }]}
          >
            <Radio.Group>
              {masterData.marriageStatuses.data?.map((status) => (
                <Radio key={status.id} value={status.id}>
                  {status.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Jumlah Anak" name="jumlahAnak">
            <Input type="number" min={0} placeholder="0" />
          </Form.Item>

          <Form.Item
            label="Pendidikan Terakhir"
            name="pendidikan"
            rules={[{ required: true, message: 'Pilih pendidikan' }]}
          >
            <Select placeholder="Pilih Pendidikan">
              {masterData.educations.data?.map((edu) => (
                <Option key={edu.id} value={edu.id}>
                  {edu.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Pekerjaan"
            name="pekerjaan"
            rules={[{ required: true, message: 'Pekerjaan wajib diisi' }]}
          >
            <Input placeholder="Masukkan pekerjaan" />
          </Form.Item>

          <Form.Item
            label="Rentang Gaji"
            name="gaji"
            rules={[{ required: true, message: 'Pilih rentang gaji' }]}
          >
            <Select placeholder="Pilih Rentang Gaji">
              {masterData.salaryRanges.data?.map((salary) => (
                <Option key={salary.id} value={salary.id}>
                  Rp {parseInt(salary.minRange).toLocaleString()} - Rp{' '}
                  {parseInt(salary.maxRange).toLocaleString()}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setShowModal(false)}>Kembali</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="!bg-[#70B748] !hover:bg-green-600"
            >
              Simpan & Daftar
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
