import { Modal, Form, Input, Button } from "antd";
import { useEffect } from "react";
import type { QuestionnaireCategory } from "../../../../../../types/Questionnaire/questionnaireTypes";
import { useCategory } from "../../../../../../hooks/MasterData/useCategory";

interface CreateCategoryModalProps {
    open: boolean;
    onCancel: () => void;
    editingData: QuestionnaireCategory | null;
}

export default function CreateCategoryModal({ open, onCancel, editingData }: CreateCategoryModalProps) {
    const [form] = Form.useForm();
    const { createCategoryMutation, updateCategoryMutation } = useCategory();

    const isEditMode = !!editingData;
    const isPending = createCategoryMutation.isPending || updateCategoryMutation.isPending;

    useEffect(() => {
        if (open && editingData) {
            form.setFieldsValue({
                name: editingData.name,
            });
        } else {
            form.resetFields();
        }
    }, [open, editingData, form]);

    const handleSave = (values: any) => {
        const payload = {
            name: values.name,
        };

        if (isEditMode && editingData) {
            updateCategoryMutation.mutate({ id: editingData.id, payload }, {
                onSuccess: () => onCancel(),
            });
        } else {
            createCategoryMutation.mutate(payload, {
                onSuccess: () => onCancel(),
            });
        }
    };

    return (
        <Modal
            title={isEditMode ? "Edit Kategori" : "Tambah Kategori Baru"}
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                    label="Nama Kategori"
                    name="name"
                    rules={[{ required: true, message: "Nama kategori wajib diisi" }]}
                >
                    <Input placeholder="Contoh: Dewasa" />
                </Form.Item>

                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onCancel} disabled={isPending}>
                        Batal
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="!bg-[#70B748] hover:bg-[#5a9639]"
                    >
                        {isEditMode ? "Simpan Perubahan" : "Simpan"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}