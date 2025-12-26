import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
    Breadcrumb,
    Button,
    Card,
    DatePicker,
    Empty,
    Popover,
    Spin,
    Table,
    Tag,
    message
} from "antd";
import { ArrowLeft, Filter, Home } from "lucide-react";
import dayjs from "dayjs";

import { adminMedisService } from "../../../../../service/adminMedisService";
import { adminDesaService } from "../../../../../service/adminDesaService";
import type { UserSummaryResponse } from "../../../../../types/adminMedisService";

import MentalHealthChart from "../../../../../components/MentalHealthChart";
import { getSubmissionsColumns, type SubmissionRow } from "../columns/SubmissionsColumn";

const { RangePicker } = DatePicker;

export default function Submissions() {
    const navigate = useNavigate();

    const params = useParams<{
        questionnaireId: string;
        userId: string;
        rwId?: string;
        rtId?: string;
    }>();
    const questionnaireId = params?.questionnaireId?.split("=")?.[1] as string
    const rwId = params?.rwId?.split("=")?.[1] as string
    const rtId = params?.rtId?.split("=")?.[1] as string
    const userId = params?.userId?.split("=")?.[1] as string

    const [loading, setLoading] = useState({
        init: true,
        table: false
    });

    const [userData, setUserData] = useState<UserSummaryResponse | null>(null);
    const [questionnaireName, setQuestionnaireName] = useState<string>("-");

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        if (questionnaireId && userId) {
            fetchInitialData();
        }
    }, [questionnaireId, userId]);

    const fetchInitialData = async () => {
        setLoading(prev => ({ ...prev, init: true }));
        try {
            await Promise.allSettled([
                fetchContextName(),
                fetchUserSummary()
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, init: false }));
        }
    };

    const fetchContextName = async () => {
        if (!questionnaireId) return;
        try {
            const res = await adminDesaService.getMedisQuestionnaireById(questionnaireId);
            setQuestionnaireName(res.data.title);
        } catch {
            // Silent fail
        }
    };

    const fetchUserSummary = async () => {
        if (!questionnaireId || !userId) return;
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;

            const res = await adminMedisService.getSummaryUser(
                questionnaireId,
                rwId,
                rtId,
                userId,
                startDate,
                endDate
            );
            setUserData(res);
        } catch (error) {
            message.error("Gagal memuat data submission user");
        }
    };

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        if (dates) setDateRange(dateStrings);
        else setDateRange(null);
    };

    const applyFilter = async () => {
        setOpenFilter(false);
        setLoading(prev => ({ ...prev, table: true }));
        await fetchUserSummary();
        setLoading(prev => ({ ...prev, table: false }));
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);
        setLoading(prev => ({ ...prev, table: true }));

        try {
            const res = await adminMedisService.getSummaryUser(questionnaireId!, userId!, rwId, rtId);
            setUserData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, table: false }));
        }
    };

    const filterContent = (
        <div className="w-80 p-1">
            <p className="mb-2 font-semibold text-gray-700">Filter Tanggal Tes</p>
            <RangePicker
                className="w-full mb-4"
                onChange={handleDateChange}
                value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
            />
            <div className="flex justify-end gap-2 pt-2">
                <Button onClick={clearFilter} size="small">Reset</Button>
                <Button type="primary" className="!bg-[#70B748]" onClick={applyFilter} size="small">
                    Terapkan
                </Button>
            </div>
        </div>
    );

    const columns = getSubmissionsColumns({
        onViewDetail: () => {
            navigate(`/admin-medis/responden/result/questionnaireId=${questionnaireId}/rwId=${rwId}/rtId=${rtId}/userId=${userId}`)
        }
    });

    if (loading.init) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 !border-[#70B748]"></div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Empty description="Data user tidak ditemukan">
                    <Button onClick={() => navigate(-1)}>Kembali</Button>
                </Empty>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full gap-6 p-5">
            <div>
                <Button
                    type="default"
                    onClick={() => navigate(-1)}
                    className="flex items-center"
                >
                    <ArrowLeft size={18} />
                    Kembali
                </Button>
            </div>

            {userData && (
                <Spin spinning={loading.init}>
                    <MentalHealthChart
                        overallDepressionRate={userData.summarize.unStableMentalPercentage}
                        totalSubmit={userData.summarize.submitCount}

                        submissionsData={userData.submissions as any[]}

                        title={`Riwayat Kesehatan - ${userData.fullname}`}
                        subtitle={`Total ${userData.summarize.submitCount} kali tes.`}
                    />
                </Spin>
            )}


            <Card className="shadow-sm border-gray-200" bodyStyle={{ padding: '24px' }}>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link to="/admin-medis/responden"> <Home size={14} className="inline mr-1" /> Daftar Kuisioner</Link>,
                            },
                            {
                                title: <Link to={`/admin-medis/responden/questionnaireId=${questionnaireId}`}>{questionnaireName}</Link>,
                            },
                            {
                                title: "Riwayat Tes",
                            },
                            {
                                title: userData.fullname,
                            },
                        ]}
                    />

                    <div className="flex items-center gap-2">
                        {dateRange && (
                            <Tag closable onClose={clearFilter} color="blue">
                                {dateRange[0]} - {dateRange[1]}
                            </Tag>
                        )}

                        <Popover
                            content={filterContent}
                            trigger="click"
                            open={openFilter}
                            onOpenChange={setOpenFilter}
                            placement="bottomRight"
                        >
                            <Button icon={<Filter size={16} />}>
                                Filter
                            </Button>
                        </Popover>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={userData.submissions as unknown as SubmissionRow[]}
                    rowKey="submissionId"
                    loading={loading.table}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Riwayat`,
                    }}
                    scroll={{ x: 800 }}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada riwayat tes" />
                    }}
                />
            </Card>
        </div>
    );
}