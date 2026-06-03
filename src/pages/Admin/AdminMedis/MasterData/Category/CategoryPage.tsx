import { useState } from "react";
import { App, Button, Card, Input, Table, Pagination } from "antd";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { useDebounce } from "use-debounce";
import type { SorterResult } from "antd/es/table/interface";
import type { QuestionnaireCategory } from "../../../../../types/Questionnaire/questionnaireTypes";
import CreateCategoryModal from "./Partials/CreateModalCategory";
import { useCategory } from "../../../../../hooks/MasterData/useCategory";
import { getCategoryColumns } from "./Column/CategoryColumn";

export default function CategoryPage() {
    const { message, modal } = App.useApp();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch] = useDebounce(searchText, 500);
    const [filters, setFilters] = useState({ order: '[["createdAt", "desc"]]' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState<QuestionnaireCategory | null>(null);

    const { getCategories, deleteCategoryMutation } = useCategory();

    const {
        data: categoryResponse,
        isLoading,
        isFetching
    } = getCategories({
        page: pagination.current,
        pageSize: pagination.pageSize,
        name: debouncedSearch,
        order: filters.order,
    });

    const handleOpenCreate = () => {
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (record: QuestionnaireCategory) => {
        setEditingData(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, name: string) => {
        modal.confirm({
            title: "Hapus Kategori?",
            icon: <AlertTriangle className="text-red-500" />,
            content: `Apakah Anda yakin ingin menghapus kategori "${name}"?`,
            okText: "Ya, Hapus",
            okType: "danger",
            cancelText: "Batal",
            onOk: () => {
                message.loading({ content: "Menghapus kategori...", key: "deleteCat" });
                deleteCategoryMutation.mutate(id, {
                    onSuccess: () => message.success({ content: "Kategori dihapus", key: "deleteCat" }),
                    onError: () => message.error({ content: "Gagal menghapus", key: "deleteCat" }),
                });
            },
        });
    };

    const handleTableChange = (
        _: any,
        __: any,
        sorter: SorterResult<QuestionnaireCategory> | SorterResult<QuestionnaireCategory>[]
    ) => {
        if (!Array.isArray(sorter)) {
            const { field, order } = sorter;
            if (order) {
                const apiOrder = order === "ascend" ? "asc" : "desc";
                setFilters((prev) => ({ ...prev, order: `[["${field}", "${apiOrder}"]]` }));
            } else {
                setFilters((prev) => ({ ...prev, order: '[["createdAt", "desc"]]' }));
            }
            setPagination((prev) => ({ ...prev, current: 1 }));
        }
    };

    const columns = getCategoryColumns({
        pagination: { current: pagination.current, pageSize: pagination.pageSize },
        onEdit: handleOpenEdit,
        onDelete: handleDelete
    });

    const dataSource = categoryResponse?.data || [];
    const totalData = categoryResponse?.meta?.pagination?.total || 0;

    return (
        <div className="flex flex-col gap-6 p-6 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 m-0">Master Data Kategori</h1>
                    <p className="text-gray-500 m-0">Kelola kategori untuk kuisioner kesehatan mental</p>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    className="!bg-[#70B748] !hover:bg-[#5a9639]"
                    onClick={handleOpenCreate}
                >
                    Tambah Kategori
                </Button>
            </div>

            <Card className="shadow-sm border-gray-200">
                <div className="mb-4">
                    <Input
                        prefix={<Search className="text-gray-400" size={18} />}
                        placeholder="Cari nama kategori..."
                        className="max-w-md"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setPagination((prev) => ({ ...prev, current: 1 }));
                        }}
                        allowClear
                    />
                </div>

                <Table<QuestionnaireCategory>
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={isLoading || isFetching}
                    onChange={handleTableChange}
                    pagination={false}
                    scroll={{ x: 600 }}
                />

                <div className="flex justify-end py-4">
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={totalData}
                        showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} Data`}
                        onChange={(page, size) => setPagination({ current: page, pageSize: size })}
                        showSizeChanger
                    />
                </div>
            </Card>

            <CreateCategoryModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                editingData={editingData}
            />
        </div>
    );
}
