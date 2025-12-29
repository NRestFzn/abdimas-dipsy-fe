import {useEffect, useState} from 'react';
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
} from 'antd';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {adminDesaService} from '../../../../../service/adminDesaService';
import {useMasterData} from '../../../../../hooks/useMasterData';

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
  const queryClient = useQueryClient();

  const {educations, salaryRanges, marriageStatuses} = useMasterData();

  const [selectedRW, setSelectedRW] = useState<string | null>(null);

  const {data: rwList} = useQuery({
    queryKey: ['rw-list'],
    queryFn: () => adminDesaService.getAllRW(),
    enabled: open,
  });

  const {data: rtList} = useQuery({
    queryKey: ['rt-list', selectedRW],
    queryFn: () =>
      selectedRW
        ? adminDesaService.getRT({order: "[['createdAt', 'desc']]"}, selectedRW)
        : null,
    enabled: !!selectedRW,
  });

  const {data: residentDetail, isLoading: isFetchingDetail} = useQuery({
    queryKey: ['resident-detail', residentId],
    queryFn: () => adminDesaService.getResidentDetail(residentId!),
    enabled: !!residentId && open,
  });

  const updateMutation = useMutation({
    mutationFn: (values: any) =>
      adminDesaService.updateResident(residentId!, values),
    onSuccess: () => {
      message.success('Data warga berhasil diperbarui');
      queryClient.invalidateQueries({queryKey: ['residents']});
      onClose();
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Gagal mengupdate data');
    },
  });

  useEffect(() => {
    if (residentDetail?.data) {
      const data = residentDetail.data;
      const detail = data.userDetail;

      setSelectedRW(detail.RukunWargaId);

      form.setFieldsValue({
        fullname: data.fullname,
        email: data.email,
        phoneNumber: detail.phoneNumber,
        gender: data.gender,
        birthDate: dayjs(data.birthDate),
        nik: detail.nik,
        profession: detail.profession,
        MarriageStatusId: detail.MarriageStatusId,
        RukunWargaId: detail.RukunWargaId,
        RukunTetanggaId: detail.RukunTetanggaId,
        EducationId: detail.EducationId,
        SalaryRangeId: detail.SalaryRangeId,
      });
    }
  }, [residentDetail, form]);

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      birthDate: values.birthDate.format('YYYY-MM-DD'),
      password: values.password || undefined,
      confirmPassword: values.confirmPassword || undefined,
    };
    updateMutation.mutate(payload);
  };

  return (
    <Modal
      title="Edit Data Warga"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{top: 20}}
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
                rules={[{required: true}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{required: true, type: 'email'}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nomor Telepon"
                name="phoneNumber"
                rules={[{required: true}]}
              >
                <Input style={{width: '100%'}} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[
                  {min: 8, message: 'Password minimal berisi 8 karakter'},
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
                  ({getFieldValue}) => ({
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
              <Form.Item label="NIK" name="nik" rules={[{required: true}]}>
                <Input style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Jenis Kelamin"
                name="gender"
                rules={[{required: true}]}
              >
                <Select
                  options={[
                    {label: 'Laki-laki', value: 'm'},
                    {label: 'Perempuan', value: 'f'},
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tanggal Lahir"
                name="birthDate"
                rules={[{required: true}]}
              >
                <DatePicker
                  className="w-full"
                  style={{width: '100%'}}
                  format="DD MMMM YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Status Pernikahan"
                name="MarriageStatusId"
                rules={[{required: true}]}
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
                rules={[{required: true}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Pendidikan"
                name="EducationId"
                rules={[{required: true}]}
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
                rules={[{required: true}]}
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
                rules={[{required: true}]}
              >
                <Select
                  onChange={(val) => {
                    setSelectedRW(val);
                    form.setFieldValue('RukunTetanggaId', null);
                  }}
                  options={rwList?.data?.map((rw: any) => ({
                    label: `RW ${rw.name}`,
                    value: rw.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Rukun Tetangga (RT)"
                name="RukunTetanggaId"
                rules={[{required: true}]}
              >
                <Select
                  disabled={!selectedRW}
                  loading={!rtList && !!selectedRW}
                  options={rtList?.data?.rukunTetangga?.map((rt: any) => ({
                    label: `RT ${rt.name}`,
                    value: rt.id,
                  }))}
                />
              </Form.Item>
            </Col>
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
  );
}
