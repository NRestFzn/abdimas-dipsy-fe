import { ArrowLeft, Filter, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { QuestionnaireSummary, SummarizeAllResponse } from "../../../../../types/adminMedisService";
import { adminDesaService } from "../../../../../service/adminDesaService";
import MentalHealthChart from "../../../../../components/MentalHealthChart";
import { adminMedisService } from "../../../../../service/adminMedisService";
import { Breadcrumb, Button, DatePicker, Empty, message, Popover, Spin, Table, Tag } from "antd";
import dayjs from "dayjs";
import { getRwDashboardColumn } from "../columns/RwDashboardColumn";

const { RangePicker } = DatePicker;

export default function RwDashboard() {
    const paramsId = useParams<{ questionnaireId: string }>()
    const questionnaireId = paramsId?.questionnaireId?.split("=")?.[1] as string

    const navigate = useNavigate()

    const [loading, setLoading] = useState({
        loading: true,
        loadingTable: false
    });
    const [summaryData, setSummaryData] = useState<QuestionnaireSummary | null>(
        null
    );
    const [questionnaireName, setQuestionnaireName] = useState<string | undefined>("");
    const [summarizeData, setSummarizeData] = useState<
        SummarizeAllResponse["data"]
    >({
        summarize: {
            userCount: 0,
            submitCount: 0,
            stableMentalCount: 0,
            unStableMentalCount: 0,
            unStableMentalPercentage: 0,
        },
        perRw: [],
    });
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        if (questionnaireId) {
            fetchInitialData();
        }
    }, [questionnaireId]);

    const fetchInitialData = async () => {
        setLoading((prev) => ({ ...prev, loading: true }));
        try {
            await Promise.all([
                fetchQuestionnaireName(),
                fetchQuestionnaireSummary(),
                fetchSummarizeAll()
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading((prev) => ({ ...prev, loading: false }));
        }
    };

    const fetchQuestionnaireName = async () => {
        if (!questionnaireId) return;
        try {
            const result = await adminDesaService.getMedisQuestionnaireById(questionnaireId);
            setQuestionnaireName(result.data.title);
        } catch (error) {
            console.error("Gagal ambil nama");
        }
    };

    const fetchQuestionnaireSummary = async () => {
        if (!questionnaireId) return;
        try {
            const data = await adminMedisService.getQuestionnaireSummary(questionnaireId);
            setSummaryData(data);
        } catch (err) {
            message.error("Gagal memuat ringkasan");
        }
    };

    const fetchSummarizeAll = async () => {
        if (!questionnaireId) return;
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;

            const data = await adminMedisService.summarizeAll(questionnaireId, startDate, endDate);
            setSummarizeData(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        if (dates) {
            setDateRange(dateStrings);
        } else {
            setDateRange(null);
        }
    };

    const applyFilter = async () => {
        setOpenFilter(false);
        setLoading((prev) => ({ ...prev, loadingTable: true }))
        await fetchSummarizeAll();
        setLoading((prev) => ({ ...prev, loadingTable: false }))
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);
        setLoading((prev) => ({ ...prev, loadingTable: true }))
        try {
            const res = await adminMedisService.summarizeAll(questionnaireId!)
            setSummarizeData(res.data)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading((prev) => ({ ...prev, loadingTable: false }))
        }

    };

    const filterContent = (
        <div className="w-80 p-1">
            <p className="mb-2 font-semibold text-gray-700">Filter Tanggal Submit</p>
            <RangePicker
                className="w-full mb-4"
                onChange={handleDateChange}
                value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
            />
            <div className="flex justify-end gap-2 pt-5">
                <Button onClick={clearFilter} size="small">Reset</Button>
                <Button type="primary" className="!bg-[#70B748]" onClick={applyFilter} size="small">
                    Terapkan
                </Button>
            </div>
        </div>
    );

    const columns = getRwDashboardColumn({
        onSeeDetail: (rwId) => {
            navigate(`/admin-medis/responden/questionnaireId=${questionnaireId}/rwId=${rwId}`);
        }
    });

    if (loading.loading) {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <div className="flex gap-x-4 items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B748]"></div>
                    <p>Memuat Data...</p>
                </div>
            </div>
        );
    }

    if (!loading.loading && !summaryData) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Empty description="Data tidak ditemukan">
                    <Button onClick={() => navigate("/admin-medis" + "/responden")}>Kembali</Button>
                </Empty>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full">

            <div className="p-5">
                <Button
                    type="default"
                    onClick={() => navigate(-1)}
                    className="flex items-center"
                >
                    <ArrowLeft size={18} />
                    Kembali
                </Button>
            </div>

            {summaryData && (
                <Spin spinning={loading.loading}>
                    <div className="p-5">
                        <MentalHealthChart
                            overallDepressionRate={summaryData.summarize.unStableMentalPercentage || 0}
                            totalSubmit={summaryData.summarize.submitCount || 0}
                            totalUser={summaryData.summarize.userCount || 0}

                            perRwData={summaryData.perRw as any[]}

                            title="Dashboard Kesehatan Mental RW"
                            subtitle={`Laporan Wilayah ${questionnaireName}`}
                        />
                    </div>
                </Spin>
            )}

            <div className="bg-gray-100 p-6 flex flex-col gap-y-5 h-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link to={`/admin-medis/responden`}> <Home size={14} className="inline mr-1" /> Daftar Kuisioner</Link>,
                            },
                            {
                                title: questionnaireName,
                            },
                            {
                                title: 'Data RW',
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
                    dataSource={summarizeData.perRw}
                    rowKey="rwId"
                    loading={loading.loadingTable || loading.loading}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} RW`,
                    }}
                    scroll={{ x: 800 }}
                />
            </div>
        </div>
    );
}
