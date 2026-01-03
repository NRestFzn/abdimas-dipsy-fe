import { Modal, Form, InputNumber, message } from "antd";
import { useMasterData } from "../../../../../../../hooks/useMasterData";

interface ModalCreateRtProps {
    open: boolean;
    onClose: () => void;
    selectedRWId: string | null;
    selectedRWLabel?: string;
}

export default function ModalCreateRt({ open, onClose, selectedRWId, selectedRWLabel }: ModalCreateRtProps) {
    const [form] = Form.useForm();
    const masterData = useMasterData();

    const handleCreate = (values: { count: number }) => {
        if (!selectedRWId) return;

        message.loading({ content: "Membuat RT...", key: "createRT" });
        
        masterData.createRTMutation.mutate({ count: values.count, rwId: selectedRWId }, {
            onSuccess: () => {
                message.success({ content: "Berhasil membuat RT", key: "createRT" });
                onClose();
                form.resetFields();
            },
            onError: () => {
                message.error({ content: "Gagal membuat RT", key: "createRT" });
            }
        });
    };

    const displayRW = selectedRWLabel?.replace(/^RW\s+/i, '') || '-';

    return (
        <Modal
            title="Tambah RT Baru"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={masterData.createRTMutation.isPending}
            okText="Simpan"
            cancelText="Batal"
            okButtonProps={{ className: "!bg-[#70B748] !hover:bg-[#5a9639]" }}
            centered
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleCreate}>
                <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
                    <p className="text-gray-500 text-sm">
                        Menambahkan RT ke dalam <br className="md:hidden" />
                        <span className="font-semibold text-gray-700">
                            RW {displayRW}
                        </span>
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
    );
}