import { Modal, Form, Input, InputNumber, Select, Space, Button, Spin, message } from "antd";
import { useEffect } from "react";
import { useQuestionnaireMutation } from "../../../../../hooks/Questionnaire/useQuestionnaire";
import type { Questionnaire } from "../../../../../types/Questionnaire/questionnaireTypes";
import { useInfiniteSelectOptions } from "../../../../../hooks/Common/useInfiniteSelectOptions";
import { useCategory } from "../../../../../hooks/MasterData/useCategory";

const ONE_HOUR = 60;
const ONE_DAY = 1440; // 24 * 60
const ONE_WEEK = 10080; // 7 * 1440
const ONE_MONTH = 43200; // 30 * 1440  Notes: 30 days
const ONE_YEAR = 525600; // 365 * 1440

interface CreateQuestionnaireModalProps {
    open: boolean;
    onCancel: () => void;
    editingData: Questionnaire | null;
}

export default function CreateQuestionnaireModal({ open, onCancel, editingData }: CreateQuestionnaireModalProps) {
    const [form] = Form.useForm();

    const { createMutation, updateMutation } = useQuestionnaireMutation();
    const { infiniteCategories } = useCategory();

    const categoryQuery = infiniteCategories(20);

    const {
        options: categoryOptions,
        onPopupScroll: onCategoryScroll,
        isLoading: loadingCategory,
        isFetchingNextPage: fetchingNextCategory
    } = useInfiniteSelectOptions({
        queryResult: categoryQuery,
        labelKey: 'name',
        valueKey: 'id'
    });

    const isEditMode = !!editingData;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (open) {
            if (editingData) {
                let unitValue = 1;
                let displayValue = editingData.cooldownInMinutes || 0;

                if (displayValue > 0) {
                    if (displayValue % ONE_YEAR === 0) {
                        unitValue = ONE_YEAR;
                        displayValue = displayValue / ONE_YEAR;
                    } else if (displayValue % ONE_MONTH === 0) {
                        unitValue = ONE_MONTH;
                        displayValue = displayValue / ONE_MONTH;
                    } else if (displayValue % ONE_WEEK === 0) {
                        unitValue = ONE_WEEK;
                        displayValue = displayValue / ONE_WEEK;
                    } else if (displayValue % ONE_DAY === 0) {
                        unitValue = ONE_DAY;
                        displayValue = displayValue / ONE_DAY;
                    } else if (displayValue % ONE_HOUR === 0) {
                        unitValue = ONE_HOUR;
                        displayValue = displayValue / ONE_HOUR;
                    }
                }

                form.setFieldsValue({
                    title: editingData.title,
                    description: editingData.description,
                    riskThreshold: editingData.riskThreshold,
                    status: editingData.status,
                    CategoryId: editingData.CategoryId,
                    tempDuration: displayValue,
                    tempUnit: unitValue,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    status: "draft",
                    riskThreshold: 0,
                    tempUnit: 1,
                    tempDuration: 0,
                });
            }
        } else {
            form.resetFields();
        }
    }, [open, editingData, form]);

    const handleSave = (values: any) => {
        const calculatedMinutes = (values.tempDuration || 0) * (values.tempUnit || 1);

        const payload = {
            title: values.title,
            description: values.description,
            status: "draft" as "draft" | "publish",
            riskThreshold: Number(values.riskThreshold),
            cooldownInMinutes: calculatedMinutes,
            CategoryId: values.CategoryId,
        };

        if (isEditMode && editingData) {
            updateMutation.mutate({ id: editingData.id, payload: { ...payload, status: values.status } }, {
                onSuccess: () => {
                    message.success("Kuisioner berhasil diperbarui")
                    onCancel()
                },
                onError: (error: any) => {
                    message.error(error.message)
                }
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    message.success("Kuisioner berhasil dibuat")
                    onCancel()
                },
                onError: (error: any) => {
                    message.error(error.message)
                }
            });
        }
    };

    const filterOption = (input: string, option: any) => {
        const labelStr = String(option?.label ?? '');
        return labelStr.toLowerCase().includes(input.toLowerCase());
    };

    return (
        <Modal
            title={isEditMode ? "Edit Kuisioner" : "Buat Kuisioner Baru"}
            open={open}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                    label="Judul Kuisioner"
                    name="title"
                    rules={[{ required: true, message: "Judul wajib diisi" }]}
                >
                    <Input placeholder="Masukkan judul..." />
                </Form.Item>

                <Form.Item
                    label="Kategori"
                    name="CategoryId"
                    rules={[{ required: true, message: "Kategori wajib dipilih" }]}
                >
                    <Select
                        placeholder="Pilih Kategori"
                        options={categoryOptions}
                        loading={loadingCategory}
                        onPopupScroll={onCategoryScroll}
                        notFoundContent={fetchingNextCategory ? <Spin size="small" /> : null}
                        showSearch={{ filterOption }}
                    />
                </Form.Item>

                <Form.Item label="Deskripsi" name="description">
                    <Input.TextArea rows={3} placeholder="Deskripsi singkat..." />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Risk Threshold" name="riskThreshold">
                        <InputNumber min={0} className="!w-full" placeholder="0" />
                    </Form.Item>

                    <Form.Item label="Masa Tenggang" required className="flex-1">
                        <Space.Compact style={{ width: "100%" }}>
                            <Form.Item
                                name="tempDuration"
                                noStyle
                                rules={[{ required: true, message: "Wajib diisi" }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "calc(100% - 90px)" }}
                                    placeholder="0"
                                />
                            </Form.Item>

                            <Form.Item name="tempUnit" noStyle initialValue={1}>
                                <Select style={{ width: 100 }}>
                                    <Select.Option value={1}>Menit</Select.Option>
                                    <Select.Option value={ONE_HOUR}>Jam</Select.Option>
                                    <Select.Option value={ONE_DAY}>Hari</Select.Option>
                                    <Select.Option value={ONE_WEEK}>Minggu</Select.Option>
                                    <Select.Option value={ONE_MONTH}>Bulan</Select.Option>
                                    <Select.Option value={ONE_YEAR}>Tahun</Select.Option>
                                </Select>
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                </div>

                {/* <Form.Item label="Status" name="status">
                    <Select>
                        <Select.Option value="draft">Draft</Select.Option>
                        <Select.Option value="publish">Publish</Select.Option>
                    </Select>
                </Form.Item> */}

                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onCancel}>Batal</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="!bg-[#70B748] hover:bg-[#5a9639]"
                    >
                        {isEditMode ? "Simpan Perubahan" : "Buat"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}