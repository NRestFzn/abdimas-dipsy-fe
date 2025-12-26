import { useState } from "react";
import { Table, Button, Modal, Form, InputNumber, Select, message, Alert } from "antd";
import { AlertTriangle, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDesaService } from "../../../../../service/adminDesaService";
import { getRTColumns } from "../columns/RTColumn";
import type { RukunTetangga } from "../../../../../types/adminDesaService";

export default function RTTab() {
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRT, setSelectedRT] = useState<RukunTetangga | null>(null);
    const [selectedRW, setSelectedRW] = useState<string | null>(null);
    const [form] = Form.useForm();

    const { data: rwList } = useQuery({
        queryKey: ["list-rw"],
        queryFn: () => adminDesaService.getAllRW()
    });

    const { data: rtData, isLoading, isFetching } = useQuery({
        queryKey: ["list-rt", selectedRW],
        queryFn: () => selectedRW ? adminDesaService.getRT({ order: "[['createdAt', 'desc']]" }, selectedRW) : null,
        enabled: !!selectedRW
    });

    const createMutation = useMutation({
        mutationFn: (vals: { count: number, rwId: string }) => adminDesaService.createRT(vals.count, vals.rwId),
        onSuccess: () => {
            message.success("Berhasil membuat RT");
            queryClient.invalidateQueries({ queryKey: ["list-rt", selectedRW] });
            queryClient.invalidateQueries({ queryKey: ["list-rw"] });
            setIsModalOpen(false);
            form.resetFields();
        },
        onError: () => message.error("Gagal membuat RT")
    });

    const deleteMutation = useMutation({
        mutationFn: adminDesaService.deleteRT,
        onMutate: () => {
            message.loading({ content: "Menghapus RT...", key: "deleteRT" });
        },
        onSuccess: () => {
            message.success({ content: "RT dihapus", key: "deleteRT" });
            queryClient.invalidateQueries({ queryKey: ["list-rt", selectedRW] });
            setIsDeleteModalOpen(false);
            setSelectedRT(null);
        },
        onError: () => {
            message.error({ content: "Gagal menghapus RT", key: "deleteRT" });
        }
    });

    const handleDeleteClick = (record: RukunTetangga) => {
        setSelectedRT(record);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedRT) {
            deleteMutation.mutate(selectedRT.id);
        }
    };

    const columns = getRTColumns({
        onDelete: handleDeleteClick
    });

    const dataSource = (rtData?.data?.rukunTetangga || []) as unknown as RukunTetangga[];
    const tableLoading = isLoading || isFetching || deleteMutation.isPending;

    return (
        <div className="space-y-4 md:space-y-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
                <div className="w-full md:max-w-md">
                    <Select
                        className="w-full"
                        placeholder="Pilih RW untuk melihat RT"
                        onChange={setSelectedRW}
                        value={selectedRW}
                        options={rwList?.data?.map((rw: any) => ({ label: `RW ${rw.name}`, value: rw.id }))}
                        loading={!rwList}
                        size="large"
                    />
                </div>

                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    className="!bg-[#70B748] !hover:bg-[#5a9639] w-full md:w-auto flex justify-center items-center h-10" // Full width btn on mobile
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedRW}
                >
                    Tambah RT
                </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <Table<RukunTetangga>
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={tableLoading}
                    pagination={{
                        pageSize: 10,
                        responsive: true,
                        showSizeChanger: false
                    }}
                    scroll={{ x: 600 }}
                    locale={{
                        emptyText: selectedRW ? "Belum ada data RT di RW ini" : "Silakan pilih RW terlebih dahulu di atas"
                    }}
                />
            </div>

            <Modal
                title="Tambah RT Baru"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={createMutation.isPending}
                okText="Simpan"
                cancelText="Batal"
                okButtonProps={{ className: "!bg-[#70B748] !hover:bg-[#5a9639]" }}
                centered
            >
                <Form form={form} layout="vertical" onFinish={(vals) => createMutation.mutate({ ...vals, rwId: selectedRW! })}>
                    <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
                        <p className="text-gray-500 text-sm">
                            Menambahkan RT ke dalam <br className="md:hidden" />
                            <span className="font-semibold text-gray-700">RW {rwList?.data?.find((r: any) => r.id === selectedRW)?.name}</span>
                        </p>
                    </div>
                    <Form.Item
                        label="Nomor RT (Angka)"
                        name="count"
                        rules={[{ required: true, message: "Wajib diisi" }]}
                    >
                        <InputNumber min={1} className="!w-full" placeholder="Contoh: 3" size="large" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={20} />
                        <span>Konfirmasi Hapus Wilayah</span>
                    </div>
                }
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
                        Batal
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        loading={deleteMutation.isPending}
                        onClick={confirmDelete}
                    >
                        Ya, Hapus RT
                    </Button>
                ]}
                centered
            >
                {selectedRT && (
                    <div className="flex flex-col gap-4 py-2">
                        <p className="text-gray-600 leading-relaxed">
                            Apakah Anda yakin ingin menghapus
                            <span className="font-bold text-gray-800"> RT {selectedRT.name}</span>?
                        </p>

                        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                            <p className="text-red-800 font-medium mb-2 text-sm">
                                Dampak Penghapusan:
                            </p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>
                                    <span className="font-bold">{selectedRT.userCount} Data Warga</span> di dalam RT ini akan hilang permanen.
                                </li>
                            </ul>
                        </div>

                        <Alert
                            message="Tindakan ini tidak dapat dibatalkan!"
                            type="warning"
                            showIcon
                            className="text-xs"
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}