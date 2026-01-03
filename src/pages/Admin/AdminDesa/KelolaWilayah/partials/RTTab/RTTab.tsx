import { useState } from "react";
import { Table, Button, Select, Spin, Pagination, Empty } from "antd";
import { Plus } from "lucide-react";
import { getRTColumns } from "../../columns/RTColumn";
import { useMasterData } from "../../../../../../hooks/useMasterData";
import type { SorterResult } from "antd/es/table/interface";
import type { RukunTetanggaWithCount } from "../../../../../../types/masterDataTypes";
import ModalCreateRt from "./Partials/ModalCreateRT";
import ModalDeleteRt from "./Partials/ModalDeleteRT";
import { useInfiniteSelectOptions } from "../../../../../../hooks/Common/useInfiniteSelectOptions";

export default function RTTab() {
    const masterData = useMasterData()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRT, setSelectedRT] = useState<RukunTetanggaWithCount | null>(null);
    const [selectedRW, setSelectedRW] = useState<string | null>(null);
    const [filters, setFilters] = useState({ order: JSON.stringify([["name", "asc"]]) })
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    })

    const rwQuery = masterData.infiniteRukunWarga(20);
    const { options: rwOptions, onPopupScroll: onRWScroll, isLoading: loadingRW, isFetchingNextPage: fetchingNextRW } = useInfiniteSelectOptions({
        queryResult: rwQuery,
        labelKey: (item: any) => `RW ${item.name}`,
        valueKey: 'id'
    });

    const {
        data: rtResponse,
        isLoading: isLoadRt,
        isFetching: isFetchingRt
    } = masterData.rukunTetangga({
        page: pagination.page,
        pageSize: pagination.pageSize,
        order: filters.order,
        RukunWargaId: selectedRW || undefined
    });

    const handleRWSelect = (val: string) => {
        setSelectedRW(val);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleDeleteClick = (record: RukunTetanggaWithCount) => {
        setSelectedRT(record);
        setIsDeleteModalOpen(true);
    };

    const handleTableChange = (
        _: any,
        __: any,
        sorter: SorterResult<RukunTetanggaWithCount> | SorterResult<RukunTetanggaWithCount>[]
    ) => {
        if (!Array.isArray(sorter)) {
            const { field, order } = sorter;

            if (order) {
                const apiOrder = order === 'ascend' ? 'asc' : 'desc';
                setFilters((prev) => ({ ...prev, order: `[["${field}", "${apiOrder}"]]` }));
            } else {
                setFilters((prev) => ({ ...prev, order: '[["name", "asc"]]' }));
            }
        }
    };

    const columns = getRTColumns({
        pagination,
        onDelete: handleDeleteClick
    });

    const dataSource = rtResponse?.data || [];
    const totalData = rtResponse?.meta?.pagination?.total || 0;

    const isPending = masterData.createRTMutation.isPending || masterData.deleteRTMutation.isPending;

    const selectedRWLabel = rwOptions.find((opt: any) => opt.value === selectedRW)?.label;

    return (
        <div className="space-y-4 md:space-y-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
                <div className="w-full md:max-w-md">
                    <Select
                        className="w-full"
                        placeholder="Cari atau pilih nomor RW..."
                        onChange={handleRWSelect}
                        value={selectedRW}
                        options={rwOptions}
                        loading={loadingRW || isPending}
                        size="large"
                        showSearch={{
                            filterOption: (input, option) => {
                                const labelStr = String(option?.label ?? '');
                                return labelStr.toLowerCase().includes(input.toLowerCase());
                            }
                        }}
                        onPopupScroll={onRWScroll}
                        notFoundContent={fetchingNextRW ? <Spin size="small" /> : null}
                        allowClear
                    />
                </div>

                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    className="bg-[#70B748] w-full md:w-auto h-10"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedRW || isPending}
                    title={!selectedRW ? "Pilih RW terlebih dahulu" : "Tambah RT"}
                >
                    Tambah RT
                </Button>
            </div>

            {!selectedRW ? (
                <div className="py-12 flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-lg">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span className="text-gray-500">
                                Silakan pilih <strong>Rukun Warga (RW)</strong> terlebih dahulu <br />
                                untuk menampilkan daftar RT.
                            </span>
                        }
                    />
                </div>
            ) : (
                <>
                    <Table<RukunTetanggaWithCount>
                        columns={columns}
                        dataSource={dataSource}
                        rowKey="id"
                        loading={isLoadRt || isFetchingRt || isPending}
                        pagination={false}
                        onChange={handleTableChange}
                        scroll={{ x: 600 }}
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
                </>
            )}

            <ModalCreateRt
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedRWId={selectedRW}
                selectedRWLabel={selectedRWLabel}
            />

            <ModalDeleteRt
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                selectedRT={selectedRT}
                onSuccess={() => setSelectedRT(null)}
            />
        </div>
    );
}