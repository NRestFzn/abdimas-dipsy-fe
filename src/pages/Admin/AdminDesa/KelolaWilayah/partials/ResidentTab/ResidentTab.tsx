import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    Button,
    Select,
    Card,
    message,
    Pagination,
    Spin,
} from "antd";
import { Plus } from "lucide-react";

import { getResidentColumns } from "../../columns/ResidentColumn";
import CreateResidentModal from "../CreateResidentModal";
import EditResidentModal from "../UpdateResidentModal";
import { useMasterData } from "../../../../../../hooks/useMasterData";
import { SearchFilter } from "./partials/SearchFilter";
import type { SorterResult } from "antd/es/table/interface";
import { useResident } from "../../../../../../hooks/Admin/AdminDesa/useResident";
import type { ResidentData } from "../../../../../../types/Resident/residentType";
import { useInfiniteSelectOptions } from "../../../../../../hooks/Common/useInfiniteSelectOptions";

export default function ResidentTab() {
    const navigate = useNavigate();

    const { infiniteRukunWarga, infiniteRukunTetangga } = useMasterData();
    const {
        getResidents,
        deleteResidentMutation
    } = useResident();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);

    const [activeSearch, setActiveSearch] = useState({ term: "", type: "fullname" });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [filters, setFilters] = useState({
        order: '[["fullname", "asc"]]'
    })
    const [filterRW, setFilterRW] = useState<string | null>(null);
    const [filterRT, setFilterRT] = useState<string | null>(null);

    const rwQuery = infiniteRukunWarga(20);
    const {
        options: rwOptions,
        onPopupScroll: onRWScroll,
        isLoading: loadingRW,
        isFetchingNextPage: fetchingNextRW
    } = useInfiniteSelectOptions({
        queryResult: rwQuery,
        labelKey: (item: any) => `RW ${item.name}`,
        valueKey: 'id'
    });

    const rtQuery = infiniteRukunTetangga(20, filterRW);
    const {
        options: rtOptions,
        onPopupScroll: onRTScroll,
        isLoading: loadingRT,
        isFetchingNextPage: fetchingNextRT
    } = useInfiniteSelectOptions({
        queryResult: rtQuery,
        labelKey: (item: any) => `RT ${item.name}`,
        valueKey: 'id'
    });

    const {
        data: residentsResponse,
        isLoading: isLoadingResidents,
        isFetching: isFetchingResidents
    } = getResidents({
        page: pagination.current,
        pageSize: pagination.pageSize,
        RukunWargaId: filterRW || undefined,
        RukunTetanggaId: filterRT || undefined,
        order: filters.order,
        fullname: activeSearch.type === "fullname" ? activeSearch.term : undefined,
        nik: activeSearch.type === "nik" ? activeSearch.term : undefined,
    });

    const handleRWChange = (val: string | null) => {
        setFilterRW(val);
        setFilterRT(null);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleRTChange = (val: string | null) => {
        setFilterRT(val);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleEdit = (id: string) => {
        setSelectedResidentId(id);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        message.loading({ content: "Menghapus warga...", key: "deleteResident" });
        deleteResidentMutation.mutate(id, {
            onSuccess: () => {
                message.success({ content: "Warga berhasil dihapus", key: "deleteResident" });
            },
            onError: () => {
                message.error({ content: "Gagal menghapus warga", key: "deleteResident" });
            }
        });
    };

    const handleTableChange = (
        _: any,
        __: any,
        sorter: SorterResult<ResidentData> | SorterResult<ResidentData>[]
    ) => {
        if (!Array.isArray(sorter)) {
            const { field, order } = sorter;

            if (order) {
                const apiOrder = order === 'ascend' ? 'asc' : 'desc';
                setFilters((prev) => ({ ...prev, order: `[["${field}", "${apiOrder}"]]` }));
            } else {
                setFilters((prev) => ({ ...prev, order: '[["fullname", "desc"]]' }));
            }

            setPagination(prev => ({ ...prev, current: 1 }));
        }
    };

    const onSearch = (term: string, type: any) => {
        setActiveSearch({ term, type });
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const dataSource = residentsResponse?.data || [];
    const totalData = residentsResponse?.meta?.pagination?.total || 0;
    const isTableLoading = isLoadingResidents || isFetchingResidents || deleteResidentMutation.isPending;

    const columns = getResidentColumns({
        pagination,
        onViewDetail: (id) => {
            navigate(`/admin/kelola-wilayah/preview-warga/residentId=${id}`);
        },
        onEdit: handleEdit,
        onDelete: handleDelete
    });

    return (
        <div className="space-y-4">
            <Card size="small" className="bg-gray-50 border-gray-200 !mb-2">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
                    <div className="flex flex-col md:flex-row gap-3 w-full">
                        <SearchFilter onSearch={onSearch} />

                        <Select
                            placeholder="Filter RW"
                            className="w-full md:w-40"
                            allowClear
                            value={filterRW}
                            onChange={handleRWChange}
                            options={rwOptions}
                            loading={loadingRW}
                            onPopupScroll={onRWScroll}
                            notFoundContent={fetchingNextRW ? <Spin size="small" /> : null}
                        />

                        <Select
                            placeholder={filterRW ? "Filter RT" : "Pilih RW Dulu"}
                            className="w-full md:w-40"
                            allowClear
                            value={filterRT}
                            onChange={handleRTChange}
                            options={rtOptions}
                            disabled={!filterRW}
                            loading={loadingRT}
                            onPopupScroll={onRTScroll}
                            notFoundContent={fetchingNextRT ? <Spin size="small" /> : null}
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        className="!bg-[#70B748] !hover:bg-[#5a9639]"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Tambah Warga
                    </Button>
                </div>
            </Card>

            <Table<ResidentData>
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={isTableLoading}
                pagination={false}
                onChange={handleTableChange}
                scroll={{ x: 1000 }}
            />

            <div className="flex justify-end py-4">
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={totalData}
                    showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} Warga`}
                    onChange={(page, size) => setPagination({ current: page, pageSize: size })}
                    showSizeChanger
                />
            </div>

            <CreateResidentModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
            />

            <EditResidentModal
                open={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedResidentId(null);
                }}
                residentId={selectedResidentId}
            />
        </div>
    );
}