import { Modal, Form, Input, Select, DatePicker, Row, Col, Spin, Checkbox, Typography, message } from "antd";
import { useState } from "react";
import { useMasterData } from "../../../../../hooks/useMasterData";
import { useResident } from "../../../../../hooks/Admin/AdminDesa/useResident";
import type { CreateResidentPayload } from "../../../../../types/Resident/residentType";
import { useInfiniteSelectOptions } from "../../../../../hooks/Common/useInfiniteSelectOptions";

interface CreateResidentModalProps {
    open: boolean;
    onCancel: () => void;
}

export default function CreateResidentModal({ open, onCancel }: CreateResidentModalProps) {
    const {
        educations,
        marriageStatuses,
        salaryRanges,
        infiniteRukunWarga,
        infiniteRukunTetangga
    } = useMasterData();

    const { createResidentMutation } = useResident();

    const { data: educationList, isLoading: loadingEdu } = educations;
    const { data: marriageList, isLoading: loadingMarriage } = marriageStatuses;
    const { data: salaryList, isLoading: loadingSalary } = salaryRanges;

    const [form] = Form.useForm();
    const [selectedRW, setSelectedRW] = useState<string | null>(null);

    const rwQuery = infiniteRukunWarga(20);
    const { options: rwOptions, onPopupScroll: onRWScroll, isLoading: loadingRW, isFetchingNextPage: fetchingNextRW } = useInfiniteSelectOptions({
        queryResult: rwQuery,
        labelKey: (item: any) => `RW ${item.name}`,
        valueKey: 'id'
    });

    const rtQuery = infiniteRukunTetangga(20, selectedRW);
    const { options: rtOptions, onPopupScroll: onRTScroll, isLoading: loadingRT, isFetchingNextPage: fetchingNextRT } = useInfiniteSelectOptions({
        queryResult: rtQuery,
        labelKey: (item: any) => `RT ${item.name}`,
        valueKey: 'id'
    });

    const handleRWChange = (val: string) => {
        setSelectedRW(val);
        form.setFieldValue("RukunTetanggaId", undefined);
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedRW(null);
        onCancel();
    };

    const handleCreate = (values: any) => {
        const payload: CreateResidentPayload = {
            ...values,
            email: values.email || null,
            isKader: !!values.isKader || false,
            birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : "",
            password: values.password,
            confirmPassword: values.confirmPassword
        };

        createResidentMutation.mutate(payload, {
            onSuccess: () => {
                handleCancel();
                message.success(`Warga atas nama ${payload.fullname} Berhasil`)
            },
        });
    };

    const isLoading = loadingEdu || loadingMarriage || loadingSalary || loadingRW || loadingRT
    const isPending = createResidentMutation.isPending

    return (
        <Modal
            title="Tambah Data Warga"
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            width={800}
            style={{ top: 20 }}
            confirmLoading={isLoading || isPending}
            okText="Simpan"
            cancelText="Batal"
            okButtonProps={{ className: "!bg-[#70B748] !hover:bg-[#5a9639]" }}
            destroyOnHidden
            centered
        >
            <Form form={form} layout="vertical" onFinish={handleCreate}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Nama Lengkap" name="fullname" rules={[{ required: true }]}>
                            <Input placeholder="Nama sesuai KTP" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="NIK" name="nik" rules={[{ required: true, len: 16, message: "NIK harus 16 digit" }]}>
                            <Input placeholder="16 digit NIK" maxLength={16} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Email (Opsional)" name="email">
                            <Input placeholder="email@contoh.com" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Nomor Telepon" name="phoneNumber" rules={[{ required: true }]}>
                            <Input placeholder="089147823524" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Kata Sandi"
                            name="password"
                            rules={[
                                { required: true, message: "Mohon masukkan kata sandi" },
                                { min: 6, message: "Kata sandi minimal 6 karakter" }
                            ]}
                        >
                            <Input.Password placeholder="Masukkan kata sandi" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Konfirmasi Kata Sandi"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: "Mohon konfirmasi kata sandi" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Kata sandi tidak cocok!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Ulangi kata sandi" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Tanggal Lahir" name="birthDate" rules={[{ required: true }]}>
                            <DatePicker className="w-full" style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Pilih tanggal" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Jenis Kelamin" name="gender" rules={[{ required: true }]}>
                            <Select placeholder="Pilih Gender">
                                <Select.Option value="m">Laki-laki</Select.Option>
                                <Select.Option value="f">Perempuan</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Pekerjaan" name="profession" rules={[{ required: true }]}>
                            <Input placeholder="Contoh: Wiraswasta" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item label="RW" name="RukunWargaId" rules={[{ required: true }]}>
                            <Select
                                placeholder="Pilih RW"
                                onChange={handleRWChange}
                                options={rwOptions}
                                loading={loadingRW || isLoading}
                                onPopupScroll={onRWScroll}
                                notFoundContent={fetchingNextRW ? <Spin size="small" /> : null}
                                showSearch={{
                                    filterOption: (input, option) => {
                                        const labelStr = String(option?.label ?? '');
                                        return labelStr.toLowerCase().includes(input.toLowerCase());
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="RT" name="RukunTetanggaId" rules={[{ required: true }]}>
                            <Select
                                placeholder={!selectedRW ? "Pilih RW Terlebih Dahulu" : "Pilih RT"}
                                disabled={!selectedRW}
                                loading={loadingRT || isLoading}
                                options={rtOptions}
                                onPopupScroll={onRTScroll}
                                notFoundContent={fetchingNextRT ? <Spin size="small" /> : null}
                                showSearch={{
                                    filterOption: (input, option) => {
                                        const labelStr = String(option?.label ?? '');
                                        return labelStr.toLowerCase().includes(input.toLowerCase());
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Pendidikan" name="EducationId" rules={[{ required: true }]}>
                            <Select
                                placeholder="Pilih"
                                options={educationList?.map((e: any) => ({ label: e.name.toUpperCase(), value: e.id }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Status Nikah" name="MarriageStatusId" rules={[{ required: true }]}>
                            <Select
                                placeholder="Pilih"
                                options={marriageList?.map((m: any) => ({ label: m.name.toUpperCase(), value: m.id }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Pendapatan" name="SalaryRangeId" rules={[{ required: true }]}>
                            <Select
                                placeholder="Pilih"
                                options={salaryList?.map((s: any) => ({
                                    label: `${parseInt(s.minRange).toLocaleString()} - ${parseInt(s.maxRange).toLocaleString()}`,
                                    value: s.id
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="my-4 border-t border-gray-100" />

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <Row align="middle" gutter={[16, 0]}>
                        <Col flex="auto">
                            <Form.Item
                                name="isKader"
                                valuePropName="checked"
                                className="!mb-0"
                            >
                                <Checkbox className="!text-gray-800 font-bold text-base flex items-center gap-2">
                                    <span className="flex items-center gap-2">
                                        Tetapkan Sebagai Petugas Kader?
                                    </span>
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Typography.Text className="text-gray-600 text-xs mt-2 block pl-6 leading-relaxed">
                        Jika dicentang, warga ini akan memiliki akses ganda sebagai <b>Kader Kesehatan</b>.
                        Mereka dapat masuk ke dashboard khusus untuk membantu warga lain mengisi kuisioner.
                    </Typography.Text>
                </div>
            </Form>
        </Modal>
    );
}