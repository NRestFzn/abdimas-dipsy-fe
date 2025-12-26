import { useState } from "react";
import { Table, Button, Modal, Form, InputNumber, message, Alert } from "antd";
import { AlertTriangle, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDesaService } from "../../../../../service/adminDesaService";
import { getRWColumns } from "../columns/RWColumn";
import type { RukunWarga } from "../../../../../types/adminDesaService";

export default function RWTab() {
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRW, setSelectedRW] = useState<RukunWarga | null>(null);

    const [form] = Form.useForm();

    const { data: rwList, isLoading } = useQuery({
        queryKey: ["list-rw"],
        queryFn: () => adminDesaService.getAllRW()
    });

    const createMutation = useMutation({
        mutationFn: (count: number) => adminDesaService.createRW(count),
        onMutate: () => {
            setLoading(true)
            message.loading({ content: "Membuat RW..." });
        },
        onSuccess: () => {
            setLoading(false)
            message.success("Berhasil membuat RW");
            queryClient.invalidateQueries({ queryKey: ["list-rw"] });
            setIsModalOpen(false);
            form.resetFields();
        },
        onError: () => message.error("Gagal membuat RW")
    });

    const deleteMutation = useMutation({
        mutationFn: adminDesaService.deleteRW,
        onMutate: () => {
            setLoading(true)
            message.loading({ content: "Menghapus RW...", key: "deleteRW" });
        },
        onSuccess: () => {
            setLoading(false)
            message.success({ content: "RW dihapus", key: "deleteRW" });
            queryClient.invalidateQueries({ queryKey: ["list-rw"] });
            setIsDeleteModalOpen(false);
            setSelectedRW(null);
        },
        onError: () => {
            message.error({ content: "Gagal menghapus RW", key: "deleteRW" });
        }
    });

    const handleDeleteClick = (record: RukunWarga) => {
        setSelectedRW(record);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedRW) {
            deleteMutation.mutate(selectedRW.id);
        }
    };

    const handleCreate = (values: { count: number }) => {
        createMutation.mutate(values.count);
    };

    const columns = getRWColumns({
        onDelete: handleDeleteClick
    });

    const dataSource = (rwList?.data || []) as unknown as RukunWarga[];

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button type="primary" icon={<Plus size={16} />} className="!bg-[#70B748]" onClick={() => setIsModalOpen(true)}>
                    Tambah RW
                </Button>
            </div>

            <Table<RukunWarga>
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={isLoading || loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Tambah RW Baru"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={createMutation.isPending}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="count" rules={[{ required: true }]}>
                        <InputNumber min={1} className="!w-full" placeholder="Contoh: 5" />
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
                        Ya, Hapus RW
                    </Button>
                ]}
                centered
            >
                {selectedRW && (
                    <div className="flex flex-col gap-4 py-2">
                        <p className="text-gray-600">
                            Apakah Anda yakin ingin menghapus 
                            <span className="font-bold text-gray-800"> RW {selectedRW.name}</span>?
                        </p>

                        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                            <p className="text-red-800 font-medium mb-2 text-sm">
                                Dampak Penghapusan:
                            </p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>
                                    <span className="font-bold">{selectedRW.rtCount} Rukun Tetangga (RT)</span> akan ikut terhapus.
                                </li>
                                <li>
                                    <span className="font-bold">{selectedRW.userCount} Data Warga</span> di dalam wilayah ini akan hilang.
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