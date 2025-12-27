import { useState } from "react"
import { useNavigate } from "react-router"
import { useDebounce } from "use-debounce"
import { Card, Empty, Input, Pagination, Table } from "antd"
import { Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { GetPublicQuestionnaireParams, Questionnaire } from "../../../../types/adminDesaService"
import { adminDesaService } from "../../../../service/adminDesaService"
import { getAdminDesaColumns } from "../columns/AdminDesaRespondenColumn"

function AdminDesa() {
    const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    })
    const [searchText, setSearchText] = useState("")
    const [debouncedSearch] = useDebounce(searchText, 500)

    const useQuestionnairePublic = () => {
        const params: GetPublicQuestionnaireParams = {
            page: 1,
            pageSize: 1000,
            title: debouncedSearch,
            order: "[['createdAt', 'desc']]"
        }

        return adminDesaService.getAllQuestionnaires(params)
    }
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["public-questionnaire", pagination.current, pagination.pageSize, debouncedSearch],
        queryFn: useQuestionnairePublic,
        // placeholderData: (prevData) => prevData
    })

    const allData = data || []
    const startIndex = (pagination.current - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    const currentData = allData.slice(startIndex, endIndex)

    const columns = getAdminDesaColumns({
        pagination,
        onSeeDetail(id) {
            navigate(`/admin/responden/questionnaireId=${id}`)
        },
    })

    return (
        <div className="p-6 space-y-6">

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Data Hasil Kuesioner</h1>
                <p className="text-gray-500">Lihat dan pantau hasil pengisian kuesioner warga secara publik</p>
            </div>

            <Card className="shadow-sm border-gray-200" bodyStyle={{ padding: 0 }}>
                <div className="p-4 border-b border-gray-100">
                    <Input
                        prefix={<Search className="text-gray-400" size={18} />}
                        placeholder="Cari judul kuisioner..."
                        className="max-w-md"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setPagination(prev => ({ ...prev, current: 1 }));
                        }}
                        allowClear
                        size="large"
                    />
                </div>

                <Table<Questionnaire>
                    columns={columns}
                    dataSource={currentData}
                    rowKey="id"
                    loading={isLoading || isFetching}
                    pagination={false}
                    scroll={{ x: 800 }}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Tidak ada data kuisioner" />
                    }}
                />

                <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={allData.length}
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