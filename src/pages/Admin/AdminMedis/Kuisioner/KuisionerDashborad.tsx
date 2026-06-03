import { useState } from "react";
import {
  App,
  Button,
  Card,
  Input,
  Table,
  Pagination,
} from "antd";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { useDebounce } from "use-debounce";

import { getKuisionerColumns } from "./columns/KuisionerColumn";
import QuestionManager from "./Partials/QuestionManager";
import { useNavigate } from "react-router";
import { useAdminQuestionnaire, useQuestionnaireMutation } from "../../../../hooks/Questionnaire/useQuestionnaire";
import type { Questionnaire } from "../../../../types/Questionnaire/questionnaireTypes";
import type { SorterResult } from "antd/es/table/interface";
import CreateQuestionnaireModal from "./Partials/CreateQuestionnaireModal";

export default function Kuisioner() {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [filters, setFilters] = useState({
    order: JSON.stringify([["createdAt", "desc"]]),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Questionnaire | null>(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);

  const {
    data: questionnaires,
    isLoading: loadQuestionnaires,
  } = useAdminQuestionnaire({
    title: debouncedSearch,
    page: pagination.current,
    pageSize: pagination.pageSize,
    order: filters.order,
  });

  const { updateMutation, deleteMutation } = useQuestionnaireMutation();

  const openCreateModal = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: Questionnaire) => {
    setEditingData(record);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "publish" ? "draft" : "publish";

    const currentData = (questionnaires?.data || []).find((q) => q.id === id);
    if (!currentData) return;

    const payload = {
      title: currentData.title,
      description: currentData.description,
      status: newStatus as "draft" | "publish",
      riskThreshold: currentData.riskThreshold,
      cooldownInMinutes: currentData.cooldownInMinutes,
      CategoryId: currentData.CategoryId,
    };

    message.loading({ content: "Memperbarui status...", key: "statusUpdate" });

    updateMutation.mutate({ id, payload }, {
      onSuccess: () => {
        message.success({ content: `Status berhasil diubah ke ${newStatus}`, key: "statusUpdate" });
      },
      onError: () => {
        message.error({ content: "Gagal mengubah status", key: "statusUpdate" });
      }
    });
  };

  const handleDeleteQuestionnaire = (id: string) => {
    message.loading({ content: "Menghapus kuisioner...", key: "deleteQ" });

    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success({ content: "Kuisioner berhasil dihapus", key: "deleteQ" });
      },
      onError: () => {
        message.error({ content: "Gagal menghapus kuisioner", key: "deleteQ" });
      }
    });
  };

  const handleManage = (record: Questionnaire) => {
    setSelectedQuestionnaire(record);
  };

  const handleTableChange = (
    _: any,
    __: any,
    sorter: SorterResult<Questionnaire> | SorterResult<Questionnaire>[]
  ) => {
    if (!Array.isArray(sorter)) {
      const { field, order } = sorter;
      if (order) {
        const apiOrder = order === "ascend" ? "asc" : "desc";
        setFilters((prev) => ({
          ...prev,
          order: `[["${field}", "${apiOrder}"]]`,
        }));
      } else {
        setFilters((prev) => ({ ...prev, order: '[["createdAt", "desc"]]' }));
      }
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const columns = getKuisionerColumns({
    pagination,
    modal,
    onManageQuestions: handleManage,
    onEditStatus: handleToggleStatus,
    onEditData: handleOpenEdit,
    onDelete: handleDeleteQuestionnaire,
    onPreview: (id) =>
      navigate(`/admin-medis/kuisioner/questionnaireId=${id}/preview`),
  });

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


  const dataSource = questionnaires?.data;
  const totalData = questionnaires?.meta?.pagination?.total;

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
          dataSource={dataSource}
          rowKey="id"
          loading={loadQuestionnaires}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          pagination={false}
        />

        <div className="flex justify-end py-4">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={totalData}
            onChange={(newPage, newPageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: newPage,
                pageSize: newPageSize,
              }));
            }}
            showSizeChanger={true}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} dari ${total} Data`
            }
          />
        </div>
      </Card>

      <CreateQuestionnaireModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        editingData={editingData}
      />

    </div>
  );
}
