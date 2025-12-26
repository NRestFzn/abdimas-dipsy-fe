import { Modal, Form, Input, Select, DatePicker, message, Row, Col } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { masterDataService } from "../../../../../service/masterDataService";
import { adminDesaService } from "../../../../../service/adminDesaService";
import type { CreateResidentPayload } from "../../../../../types/adminDesaService";

interface CreateResidentModalProps {
    open: boolean;
    onCancel: () => void;
}

export default function CreateResidentModal({ open, onCancel }: CreateResidentModalProps) {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [selectedRW, setSelectedRW] = useState<string | null>(null);

    const { data: educationList } = useQuery({
        queryKey: ["edu"],
        queryFn: masterDataService.getEducationList,
        staleTime: Infinity
    });
    const { data: marriageList } = useQuery({
        queryKey: ["marriage"],
        queryFn: masterDataService.getMarriageStatusList,
        staleTime: Infinity
    });
    const { data: salaryList } = useQuery({
        queryKey: ["salary"],
        queryFn: masterDataService.getSalaryRangeList,
        staleTime: Infinity
    });
    const { data: rwList } = useQuery({
        queryKey: ["rw-list"],
        queryFn: () => adminDesaService.getAllRW(),
        staleTime: 1000 * 60 * 5
    });

    const { data: rtList, isLoading: loadingRT } = useQuery({
        queryKey: ["rt-list-form", selectedRW],
        queryFn: () => selectedRW ? adminDesaService.getRT({ order: "[['createdAt', 'desc']]" }, selectedRW) : null,
        enabled: !!selectedRW,
    });

    const createMutation = useMutation({
        mutationFn: (payload: CreateResidentPayload) => adminDesaService.createResident(payload),
        onSuccess: () => {
            message.success("Warga berhasil ditambahkan");
            queryClient.invalidateQueries({ queryKey: ["residents"] });
            form.resetFields();
            setSelectedRW(null);
            onCancel();
        },
        onError: (err: any) => {
            message.error(err.response?.data?.message || "Gagal menambah warga");
        }
    });

    const handleCreate = (values: any) => {
        const payload: CreateResidentPayload = {
            ...values,
            birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : "",
            password: "password123",
            confirmPassword: "password123"
        };
        createMutation.mutate(payload);
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedRW(null);
        onCancel();
    };

    return (
        <Modal
            title="Tambah Data Warga"
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            width={800}
            style={{ top: 20 }}
            confirmLoading={createMutation.isPending}
            okText="Simpan"
            cancelText="Batal"
            okButtonProps={{ className: "!bg-[#70B748] !hover:bg-[#5a9639]" }}
            destroyOnClose
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
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
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
                                onChange={(val) => {
                                    setSelectedRW(val);
                                    form.setFieldValue("RukunTetanggaId", undefined);
                                }}
                                options={rwList?.data?.map((rw: any) => ({ label: `RW ${rw.name}`, value: rw.id }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="RT" name="RukunTetanggaId" rules={[{ required: true }]}>
                            <Select
                                placeholder={loadingRT ? "Memuat RT..." : "Pilih RT"}
                                disabled={!selectedRW}
                                loading={loadingRT}
                                options={rtList?.data?.rukunTetangga?.map((rt: any) => ({ label: `RT ${rt.name}`, value: rt.id }))}
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
            </Form>
        </Modal>
    );
}