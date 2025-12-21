import { Input, Pagination, Table } from "antd";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { adminMedisService } from "../../../../service/adminMedisService";
import type { GetQuestionnaireParams, Questionnaire } from "../../../../types/adminMedisService";
import { getQuestionnaireColumns } from "./columns/AdminMedisColumn";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";

function AdminMedis() {
    const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    })
    const [searchText, setSearchText] = useState("")
    const [debouncedSearch] = useDebounce(searchText, 500)

    const useGetAllQuestionnaire = () => {
        const params: GetQuestionnaireParams = {
            page: pagination.current,
            pageSize: pagination.pageSize,
            title: debouncedSearch
        }
        return adminMedisService.getAllQuestionnaires(params)
    }

    const { data, isLoading } = useQuery({
        queryKey: ["questionnaires", pagination.current, pagination.pageSize, debouncedSearch],
        queryFn: useGetAllQuestionnaire,
    });

    const adminDesaMedisColumn = getQuestionnaireColumns({
        pagination,
        onSee: (id) => {
            navigate(`/admin-medis/responden/questionnaireId=${id}`);
        }
    })

    return (
        <div className="p-6 space-y-6">

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col gap-y-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Daftar Kuisioner</h1>
                    <p className="text-gray-500">Kelola data kuisioner kesehatan mental</p>
                </div>
                <div>
                    <Input
                        prefix={<Search className="text-gray-400" size={18} />}
                        placeholder="Cari judul kuisioner..."
                        className="max-w-md"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        size="middle"
                    />
                </div>

                <Table<Questionnaire>
                    columns={adminDesaMedisColumn}
                    dataSource={data?.data as Questionnaire[] || []}
                    loading={isLoading}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 800 }}
                />

                <div className="w-full flex justify-end py-5">
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={data?.data?.length || 0}

                        onChange={(page, pageSize) => {
                            setPagination({
                                current: page,
                                pageSize: pageSize,
                            });
                        }}

                        showSizeChanger={true}
                        // pageSizeOptions={['10', '20', '50', '100']}
                        showLessItems={true}
                        size="default"
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminMedis