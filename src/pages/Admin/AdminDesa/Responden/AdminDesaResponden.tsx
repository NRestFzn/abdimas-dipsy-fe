import { memo, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useDebounce } from "use-debounce"
import { Card, Empty, Input, Pagination, Table } from "antd"
import { Search } from "lucide-react"
import { getAdminDesaColumns } from "../columns/AdminDesaRespondenColumn"
import { usePublicQuestionnaire } from "../../../../hooks/Questionnaire/useQuestionnaire"
import type { SorterResult } from "antd/es/table/interface"
import type { Questionnaire } from "../../../../types/Questionnaire/questionnaireTypes"

interface SearchInputProps {
    onSearch: (value: string) => void;
}

const SearchInput = memo(({ onSearch }: SearchInputProps) => {
    const [localText, setLocalText] = useState("");
    const [debouncedValue] = useDebounce(localText, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <Input
            prefix={<Search className="text-gray-400" size={18} />}
            placeholder="Cari judul kuisioner..."
            className="max-w-md"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            allowClear
            size="large"
        />
    );
});

function AdminDesa() {
    const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    })
    const [finalSearch, setFinalSearch] = useState("");
    const [filters, setFilters] = useState({
        order: '[["createdAt", "desc"]]'
    });

    useEffect(() => {
        setPagination((prev) => ({ ...prev, current: 1 }));
    }, [finalSearch]);

    const {
        data: questionnaireResponse,
        isLoading,
        isFetching
    } = usePublicQuestionnaire({
        page: pagination.current,
        pageSize: pagination.pageSize,
        title: finalSearch,
        order: filters.order,
    });

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
            setPagination((prev) => ({ ...prev, current: 1 }));
        }
    };

    const dataSource = questionnaireResponse?.data || [];
    const totalData = questionnaireResponse?.meta?.pagination?.total || 0;

    const columns = getAdminDesaColumns({
        pagination,
        onSeeDetail(id) {
            navigate(`/admin/responden/questionnaireId=${id}`);
        },
    });

    return (
        <div className="p-6 space-y-6">

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Data Hasil Kuesioner</h1>
                <p className="text-gray-500">Lihat dan pantau hasil pengisian kuesioner warga secara publik</p>
            </div>

            <Card className="shadow-sm border-gray-200" styles={{ body: { padding: 0 } }}>
                <div className="p-4 border-b border-gray-100">
                    <SearchInput onSearch={setFinalSearch} />
                </div>

                <Table<Questionnaire>
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={isLoading || isFetching}
                    pagination={false}
                    onChange={handleTableChange}
                    scroll={{ x: 800 }}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Tidak ada data kuisioner" />
                    }}
                />

                <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={totalData}

                        onChange={(page, size) => {
                            setPagination({ current: page, pageSize: size });
                        }}

                        showSizeChanger
                        pageSizeOptions={['10', '20', '50', '100']}
                        showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} data`}
                    />
                </div>
            </Card>
        </div>
    )
}

export default AdminDesa