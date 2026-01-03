import { useState } from "react";
import { Table, Button, Pagination, Input } from "antd";
import { Plus, Search } from "lucide-react";
import { getRWColumns } from "../../columns/RWColumn";
import { useMasterData } from "../../../../../../hooks/useMasterData";
import type { SorterResult } from "antd/es/table/interface";
import type { RukunWargaWithCount } from "../../../../../../types/masterDataTypes";
import { useDebounce } from "use-debounce";
import ModalCreateRw from "./Partials/ModalCreateRw";
import ModalDeleteRw from "./Partials/ModalDeleteRw";

export default function RWTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRW, setSelectedRW] = useState<RukunWargaWithCount | null>(null);

    const [filters, setFilters] = useState({ order: '[["name", "asc"]]' })
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    })

    const masterData = useMasterData()
    const {
        data: rwResponse,
        isLoading: isLoadRw,
        isFetching: isFetchingRw
    } = masterData.rukunWarga({
        page: pagination.page,
        pageSize: pagination.pageSize,
        order: filters.order,
        name: debouncedSearchTerm || undefined
    });

    const handleDeleteClick = (record: RukunWargaWithCount) => {
        setSelectedRW(record);
        setIsDeleteModalOpen(true);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleTableChange = (
        _: any,
        __: any,
        sorter: SorterResult<RukunWargaWithCount> | SorterResult<RukunWargaWithCount>[]
    ) => {
        if (!Array.isArray(sorter)) {
            const { field, order } = sorter;
            if (order) {
                const apiOrder = order === 'ascend' ? 'asc' : 'desc';
                setFilters((prev) => ({ ...prev, order: `[["${field}", "${apiOrder}"]]` }));
            } else {
                setFilters((prev) => ({ ...prev, order: '[["name", "asc"]]' }));
            }
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    };

    const dataSource = rwResponse?.data || [];
    const totalData = rwResponse?.meta?.pagination?.total || 0;

    const columns = getRWColumns({
        pagination,
        onDelete: (record) => handleDeleteClick(record)
    });

    const isPendingCreateRw = masterData.createRWMutation.isPending
    const isPendingDeleteRw = masterData.deleteRWMutation.isPending
    const isPending = isPendingCreateRw || isPendingDeleteRw

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Input
                    placeholder="Cari RW (contoh: 01)..."
                    prefix={<Search className="text-gray-400" size={16} />}
                    value={searchTerm}
                    onChange={handleSearch}
                    allowClear
                    className="w-full sm:w-64"
                />
                <Button type="primary" icon={<Plus size={16} />} className="!bg-[#70B748]" onClick={() => setIsModalOpen(true)}>
                    Tambah RW
                </Button>
            </div>

            <Table<RukunWargaWithCount>
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={isLoadRw || isFetchingRw || isPending}
                onChange={handleTableChange}
                pagination={false}
            />

            <div className="flex justify-end py-4">
                <Pagination
                    current={pagination.page}
                    pageSize={pagination.pageSize}
                    total={totalData}
                    onChange={(newPage, newPageSize) => {
                        setPagination((prev) => ({
                            ...prev,
                            page: newPage,
                            pageSize: newPageSize
                        }))
                    }}
                    showSizeChanger={true}
                    showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} Data`}
                />
            </div>

            <ModalCreateRw
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <ModalDeleteRw
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                selectedRW={selectedRW}
                onSuccess={() => setSelectedRW(null)}
            />
        </div>
    );
}