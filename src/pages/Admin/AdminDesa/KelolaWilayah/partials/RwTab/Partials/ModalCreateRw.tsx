import { Modal, Form, InputNumber, message } from "antd";
import { useMasterData } from "../../../../../../../hooks/useMasterData";

interface ModalCreateRwProps {
    open: boolean;
    onClose: () => void;
}

export default function ModalCreateRw({ open, onClose }: ModalCreateRwProps) {
    const [form] = Form.useForm();
    const masterData = useMasterData();

    const handleCreate = (values: { count: number }) => {
        message.loading({ content: "Membuat RW...", key: "createRW" });

        masterData.createRWMutation.mutate(values.count, {
            onSuccess: () => {
                message.success({ content: "Berhasil membuat RW", key: "createRW" });
                onClose();
                form.resetFields();
            },
            onError: () => {
                message.error({ content: "Gagal membuat RW", key: "createRW" });
            }
        });
    };

    return (
        <Modal
            title="Tambah RW Baru"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={masterData.createRWMutation.isPending}
            destroyOnHidden 
        >
            <Form form={form} layout="vertical" onFinish={handleCreate}>
                <Form.Item
                    name="count"
                    label="Jumlah RW"
                    rules={[{ required: true, message: 'Mohon isi jumlah RW' }]}
                >
                    <InputNumber
                        min={1}
                        className="!w-full"
                        placeholder="Contoh: 5"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}