import { Input, Pagination, Table } from "antd";
import { memo, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { getQuestionnaireColumns } from "./columns/AdminMedisColumn";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useAdminQuestionnaire } from "../../../../hooks/Questionnaire/useQuestionnaire";
import type { SorterResult } from "antd/es/table/interface";
import type { Questionnaire } from "../../../../types/Questionnaire/questionnaireTypes";

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
            size="middle"
        />
    );
});

function AdminMedis() {
    const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    })
    const [finalSearch, setFinalSearch] = useState("");
    const [filters, setFilters] = useState({
        order: '[["createdAt", "desc"]]'
    });

    const {
        data: questionnaireResponse,
        isLoading,
        isFetching
    } = useAdminQuestionnaire({
        page: pagination.current,
        pageSize: pagination.pageSize,
        title: finalSearch,
        order: filters.order,
    });

    useEffect(() => {
        setPagination((prev) => ({ ...prev, current: 1 }));
    }, [finalSearch]);

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

    const adminDesaMedisColumn = getQuestionnaireColumns({
        pagination,
        onSee: (id) => {
            navigate(`/admin-medis/responden/questionnaireId=${id}`);
        }
    })

    const dataSource = questionnaireResponse?.data || [];
    const totalData = questionnaireResponse?.meta?.pagination?.total || 0;

    return (
        <div className="p-6 space-y-6">

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col gap-y-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Data Hasil Kuesioner</h1>
                    <p className="text-gray-500">Lihat dan pantau hasil pengisian kuesioner warga secara publik</p>
                </div>
                <div>
                    <SearchInput onSearch={setFinalSearch} />
                </div>

                <Table<Questionnaire>
                    columns={adminDesaMedisColumn}
                    dataSource={dataSource}
                    loading={isLoading || isFetching}
                    rowKey="id"
                    pagination={false}
                    onChange={handleTableChange}
                    scroll={{ x: 800 }}
                />

                <div className="w-full flex justify-end py-5">
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={totalData}

                        showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} Data`}

                        onChange={(page, pageSize) => {
                            setPagination({
                                current: page,
                                pageSize: pageSize,
                            });
                        }}

                        showSizeChanger={true}
                        showLessItems={true}
                        size="default"
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminMedis