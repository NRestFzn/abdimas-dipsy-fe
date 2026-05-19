import { Modal, Form, Input, Select, DatePicker, Row, Col, Spin, message } from "antd";
import { useState } from "react";
import { useMasterData } from "../../../hooks/useMasterData";
import { useInfiniteSelectOptions } from "../../../hooks/Common/useInfiniteSelectOptions";
import { useRegisterAndAddFamilyMember } from "../../../hooks/Family/useFamily";

interface Props {
    open: boolean;
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function RegisterFamilyMemberModal({ open, onCancel, onSuccess }: Props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [selectedRW, setSelectedRW] = useState<string | null>(null);

    const {
        educations,
        marriageStatuses,
        salaryRanges,
        infiniteRukunWarga,
        infiniteRukunTetangga,
    } = useMasterData();

    const { data: educationList, isLoading: loadingEdu } = educations;
    const { data: marriageList, isLoading: loadingMarriage } = marriageStatuses;
    const { data: salaryList, isLoading: loadingSalary } = salaryRanges;

    const rwQuery = infiniteRukunWarga(20);
    const { options: rwOptions, onPopupScroll: onRWScroll, isLoading: loadingRW, isFetchingNextPage: fetchingNextRW } = useInfiniteSelectOptions({
        queryResult: rwQuery,
        labelKey: (item: any) => `RW ${item.name}`,
        valueKey: "id",
    });

    const rtQuery = infiniteRukunTetangga(20, selectedRW);
    const { options: rtOptions, onPopupScroll: onRTScroll, isLoading: loadingRT, isFetchingNextPage: fetchingNextRT } = useInfiniteSelectOptions({
        queryResult: rtQuery,
        labelKey: (item: any) => `RT ${item.name}`,
        valueKey: "id",
    });

    const registerMutation = useRegisterAndAddFamilyMember();

    const handleRWChange = (val: string) => {
        setSelectedRW(val);
        form.setFieldValue("RukunTetanggaId", undefined);
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedRW(null);
        onCancel();
    };

    const handleSubmit = async (values: any) => {
        try {
            await registerMutation.mutateAsync({
                ...values,
                email: values.email || null,
                phoneNumber: values.phoneNumber || null,
                birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : "",
            });
            messageApi.success(`Anggota keluarga ${values.fullname} berhasil didaftarkan dan ditambahkan`);
            handleCancel();
            onSuccess?.();
        } catch (err: any) {
            const msg = err?.message || err?.response?.data?.message || "Gagal mendaftarkan anggota";
            messageApi.error(msg);
        }
    };

    const isLoading = loadingEdu || loadingMarriage || loadingSalary || loadingRW || loadingRT;

    return (
        <>
            {contextHolder}
            <Modal
                title="Daftarkan Anggota Keluarga Baru"
                open={open}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                width={800}
                style={{ top: 20 }}
                confirmLoading={registerMutation.isPending}
                okText="Daftarkan & Tambahkan"
                cancelText="Batal"
                okButtonProps={{ className: "!bg-amber-500 hover:!bg-amber-600 !border-none" }}
                destroyOnHidden
                centered
            >
                <p className="text-gray-500 text-sm mb-4">
                    Daftarkan akun baru untuk anggota keluarga yang belum memiliki akun, sekaligus langsung menambahkan mereka ke keluarga ini.
                </p>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Nama Lengkap" name="fullname" rules={[{ required: true, message: "Nama wajib diisi" }]}>
                                <Input placeholder="Nama sesuai KTP" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="NIK" name="nik" rules={[{ required: true, len: 16, message: "NIK harus 16 digit" }]}>
                                <Input placeholder="16 digit NIK" maxLength={16} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Email (Opsional)" name="email">
                                <Input placeholder="email@contoh.com" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Nomor Telepon" name="phoneNumber" rules={[{ required: true, message: "Nomor telepon wajib diisi" }]}>
                                <Input placeholder="089147823524" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Kata Sandi"
                                name="password"
                                rules={[
                                    { required: true, message: "Kata sandi wajib diisi" },
                                    { min: 8, message: "Minimal 8 karakter" },
                                ]}
                            >
                                <Input.Password placeholder="Masukkan kata sandi" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Konfirmasi Kata Sandi"
                                name="confirmPassword"
                                dependencies={["password"]}
                                rules={[
                                    { required: true, message: "Konfirmasi kata sandi wajib diisi" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) return Promise.resolve();
                                            return Promise.reject(new Error("Kata sandi tidak cocok"));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Ulangi kata sandi" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Tanggal Lahir" name="birthDate" rules={[{ required: true, message: "Tanggal lahir wajib diisi" }]}>
                                <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="Pilih tanggal" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Jenis Kelamin" name="gender" rules={[{ required: true, message: "Jenis kelamin wajib dipilih" }]}>
                                <Select placeholder="Pilih">
                                    <Select.Option value="m">Laki-laki</Select.Option>
                                    <Select.Option value="f">Perempuan</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Pekerjaan" name="profession" rules={[{ required: true, message: "Pekerjaan wajib diisi" }]}>
                                <Input placeholder="Contoh: Wiraswasta" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item label="RW" name="RukunWargaId" rules={[{ required: true, message: "RW wajib dipilih" }]}>
                                <Select
                                    placeholder="Pilih RW"
                                    onChange={handleRWChange}
                                    options={rwOptions}
                                    loading={loadingRW || isLoading}
                                    onPopupScroll={onRWScroll}
                                    notFoundContent={fetchingNextRW ? <Spin size="small" /> : null}
                                    showSearch
                                    filterOption={(input, option) =>
                                        String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="RT" name="RukunTetanggaId" rules={[{ required: true, message: "RT wajib dipilih" }]}>
                                <Select
                                    placeholder={!selectedRW ? "Pilih RW terlebih dahulu" : "Pilih RT"}
                                    disabled={!selectedRW}
                                    loading={loadingRT || isLoading}
                                    options={rtOptions}
                                    onPopupScroll={onRTScroll}
                                    notFoundContent={fetchingNextRT ? <Spin size="small" /> : null}
                                    showSearch
                                    filterOption={(input, option) =>
                                        String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Pendidikan" name="EducationId" rules={[{ required: true, message: "Pendidikan wajib dipilih" }]}>
                                <Select
                                    placeholder="Pilih"
                                    options={educationList?.map((e: any) => ({ label: e.name.toUpperCase(), value: e.id }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Status Nikah" name="MarriageStatusId" rules={[{ required: true, message: "Status nikah wajib dipilih" }]}>
                                <Select
                                    placeholder="Pilih"
                                    options={marriageList?.map((m: any) => ({ label: m.name.toUpperCase(), value: m.id }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Pendapatan" name="SalaryRangeId" rules={[{ required: true, message: "Pendapatan wajib dipilih" }]}>
                                <Select
                                    placeholder="Pilih"
                                    options={salaryList?.map((s: any) => ({
                                        label: `${parseInt(s.minRange).toLocaleString()} - ${parseInt(s.maxRange).toLocaleString()}`,
                                        value: s.id,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}
