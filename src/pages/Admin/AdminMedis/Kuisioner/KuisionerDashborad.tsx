import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Table,
  Modal,
  Form,
  Select,
  message,
  InputNumber,
  Space,
} from "antd";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { getKuisionerColumns } from "./columns/KuisionerColumn";
import type {
  CreateQuestionnairePayload,
  Questionnaire,
} from "../../../../types/adminMedisService";
import { adminMedisService } from "../../../../service/adminMedisService";
import QuestionManager from "./Partials/QuestionManager";
import { useNavigate } from "react-router";

const ONE_HOUR = 60;
const ONE_DAY = 1440;       // 24 * 60
const ONE_WEEK = 10080;     // 7 * 1440
const ONE_MONTH = 43200;    // 30 * 1440  Notes: 30 days
const ONE_YEAR = 525600;    // 365 * 1440

export default function Kuisioner() {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<Questionnaire | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["questionnaires", pagination.current, debouncedSearch],
    queryFn: () =>
      adminMedisService.getAllQuestionnaires({
        page: pagination.current,
        pageSize: pagination.pageSize,
        title: debouncedSearch,
      }),
  });

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      status: "draft",
      riskThreshold: 0,
      tempUnit: 1,
      tempDuration: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: Questionnaire) => {
    setIsEditMode(true);
    setEditingId(record.id);

    let unitValue = 1;
    let displayValue = record.cooldownInMinutes || 0;

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
      title: record.title,
      description: record.description,
      riskThreshold: record.riskThreshold,
      status: record.status,
      tempDuration: displayValue,
      tempUnit: unitValue,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (values: any) => {
    setModalLoading(true);
    const calculatedMinutes = (values.tempDuration || 0) * (values.tempUnit || 1);

    try {
      if (isEditMode && editingId) {
        await adminMedisService.updateQuestionnaire(editingId, {
          title: values.title,
          description: values.description,
          status: values.status,
          riskThreshold: Number(values.riskThreshold),
          cooldownInMinutes: calculatedMinutes,
        });
        message.success("Kuisioner berhasil diperbarui!");
      } else {
        const payload: CreateQuestionnairePayload = {
          title: values.title,
          description: values.description,
          riskThreshold: Number(values.riskThreshold),
          cooldownInMinutes: calculatedMinutes,
          status: values.status as "draft" | "publish",
        };
        await adminMedisService.createQuestionnaire(payload);
        message.success("Kuisioner berhasil dibuat!");
      }

      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error: any) {
      const action = isEditMode ? "memperbarui" : "membuat";
      message.error(
        error.response?.data?.message || `Gagal ${action} kuisioner`
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "publish" ? "draft" : "publish";
    try {
      const currentData = (data?.data || []).find((q) => q.id === id);
      if (!currentData) return;

      await adminMedisService.updateQuestionnaire(id, {
        title: currentData.title,
        description: currentData.description,
        status: newStatus as "draft" | "publish",
        riskThreshold: currentData.riskThreshold as number,
        cooldownInMinutes: currentData.cooldownInMinutes as number
      });

      message.success(`Status berhasil diubah ke ${newStatus}`);
      refetch();
    } catch (error) {
      message.error("Gagal mengubah status");
    }
  };

  const handleDeleteQuestionnaire = async (id: string) => {
    try {
      await adminMedisService.deleteQuestionnaire(id);

      message.success(`Kuisioner berhasil dihapus`);
      refetch();
    } catch (error) {
      message.error("Kuisioner gagal dihapus");
    }
  };

  const handleManage = (record: Questionnaire) => {
    setSelectedQuestionnaire(record);
  };

  if (selectedQuestionnaire) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <Button
              onClick={() => setSelectedQuestionnaire(null)}
              className="flex items-center"
            >
              <ArrowLeft size={18} />
              Kembali
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 m-0">
                {selectedQuestionnaire.title}
              </h1>
              <p className="text-gray-500 text-sm m-0">Kelola Pertanyaan</p>
            </div>
          </div>

          <QuestionManager questionnaireId={selectedQuestionnaire.id} />
        </div>
      </div>
    );
  }

  const columns = getKuisionerColumns({
    pagination,
    onManageQuestions: handleManage,
    onEditStatus: handleToggleStatus,
    onEditData: handleOpenEdit,
    onDelete: handleDeleteQuestionnaire,
    onPreview: (id) => navigate(`/admin-medis/kuisioner/questionnaireId=${id}/preview`),
  });

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">
            Daftar Kuisioner
          </h1>
          <p className="text-gray-500 m-0">
            Kelola data kuisioner kesehatan mental
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          className="!bg-[#70B748] !hover:bg-[#5a9639]"
          onClick={openCreateModal}
        >
          Buat Kuisioner
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200">
        <div className="mb-4">
          <Input
            prefix={<Search className="text-gray-400" size={18} />}
            placeholder="Cari judul kuisioner..."
            className="max-w-md"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <Table<Questionnaire>
          columns={columns}
          dataSource={(data?.data || []) as Questionnaire[]}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.data?.length || 0,
            onChange: (page, pageSize) =>
              setPagination({ current: page, pageSize }),
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} Kuisioner`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={isEditMode ? "Edit Kuisioner" : "Buat Kuisioner Baru"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Judul Kuisioner"
            name="title"
            rules={[{ required: true, message: "Judul wajib diisi" }]}
          >
            <Input placeholder="Masukkan judul..." />
          </Form.Item>

          <Form.Item label="Deskripsi" name="description">
            <Input.TextArea rows={3} placeholder="Deskripsi singkat..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Risk Threshold" name="riskThreshold">
              <InputNumber min={0} className="!w-full" placeholder="0" />
            </Form.Item>

            <Form.Item label="Masa Tenggang" required className="flex-1">
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  name="tempDuration"
                  noStyle
                  rules={[{ required: true, message: "Wajib diisi" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: 'calc(100% - 90px)' }}
                    placeholder="0"
                  />
                </Form.Item>

                <Form.Item
                  name="tempUnit"
                  noStyle
                  initialValue={1}
                >
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

          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="publish">Publish</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={modalLoading}
              className="!bg-[#70B748] hover:bg-[#5a9639]"
            >
              {isEditMode ? "Simpan Perubahan" : "Buat"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
