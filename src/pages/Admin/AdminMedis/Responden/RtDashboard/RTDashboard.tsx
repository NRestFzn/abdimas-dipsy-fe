import { ArrowLeft, Filter, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { RWSummary } from "../../../../../types/adminMedisService";
import { adminDesaService } from "../../../../../service/adminDesaService";
import { adminMedisService } from "../../../../../service/adminMedisService";
import MentalHealthChart from "../../../../../components/MentalHealthChart";
import { Breadcrumb, Button, DatePicker, Empty, message, Popover, Spin, Table, Tag } from "antd";
import dayjs from "dayjs";
import { getRTDashboardColumns } from "../columns/RTDashboardColumn";

const { RangePicker } = DatePicker;

export default function RTDashboard() {
    const navigate = useNavigate();

    const params = useParams<{ questionnaireId: string; rwId: string }>();
    const questionnaireId = params?.questionnaireId?.split("=")?.[1] as string
    const rwId = params?.rwId?.split("=")?.[1] as string


    const [loading, setLoading] = useState({
        loading: true,
        loadingTable: false
    });
    const [summaryData, setSummaryData] = useState<RWSummary | null>(null);
    const [questionnaireName, setQuestionnaireName] = useState<string>("-");
    const [rwName, setRwName] = useState<string>(`RW -`);

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        if (questionnaireId && rwId) {
            fetchInitialData();
        } else {
            setLoading((prev) => ({ ...prev, loading: false }));
        }
    }, [questionnaireId, rwId]);

    const fetchInitialData = async () => {
        setLoading((prev) => ({ ...prev, loading: true }));
        try {
            await Promise.allSettled([
                fetchQuestionnaireName(),
                fetchRWContext(),
                fetchRWSummary()
            ]);
        } catch (error) {
            console.error("Error fetching initial data:", error);
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
            console.error("Gagal ambil nama kuisioner");
        }
    };

    const fetchRWContext = async () => {
        if (!questionnaireId || !rwId) return;
        try {
            const parentSummary = await adminMedisService.getQuestionnaireSummary(questionnaireId);

            const foundRW = parentSummary.perRw.find(r => r.rwId === rwId);

            if (foundRW) {
                setRwName(`RW ${foundRW.rwName}`);
            } else {
                setRwName(`RW -`);
            }
        } catch (err) {
            console.warn("Gagal mengambil nama RW detail, menggunakan ID.");
            setRwName(`RW -`);
        }
    };

    const fetchRWSummary = async () => {
        if (!questionnaireId || !rwId) return;
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;

            const data = await adminMedisService.summaryRw(
                questionnaireId,
                rwId,
                startDate,
                endDate
            );
            setSummaryData(data);
        } catch (err) {
            message.error("Gagal memuat data RT");
        }
    };

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        if (dates) setDateRange(dateStrings);
        else setDateRange(null);
    };

    const applyFilter = async () => {
        setOpenFilter(false);
        setLoading((prev) => ({ ...prev, loadingTable: true }))
        await fetchRWSummary();
        setLoading((prev) => ({ ...prev, loadingTable: false }))
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);

        setLoading((prev) => ({ ...prev, loadingTable: true }));

        if (questionnaireId && rwId) {
            try {
                const res = await adminMedisService.summaryRw(questionnaireId, rwId)
                setSummaryData(res)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading((prev) => ({ ...prev, loadingTable: false }))
            }
        } else {
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

    const columns = getRTDashboardColumns({
        onSeeDetail: (rtId) => {
            navigate(`/admin-medis/responden/questionnaireId=${questionnaireId}/rwId=${rwId}/rtId=${rtId}`);
        }
    });

    if (!loading && !summaryData) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Empty description="Data RW tidak ditemukan">
                    <Button onClick={() => navigate(`/admin-medis/responden/${questionnaireId}`)}>
                        Kembali ke Daftar RW
                    </Button>
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
                            overallDepressionRate={summaryData?.summarize?.unStableMentalPercentage || 0}
                            totalSubmit={summaryData?.summarize?.submitCount || 0}
                            totalUser={summaryData?.summarize?.userCount || 0}

                            perRtData={summaryData?.perRt as any[]}

                            title={`Statistik Kesehatan Mental RT - ${rwName}`}
                            subtitle={`Persentase Kondisi Mental Warga di Semua RT - ${rwName}`}
                        />
                    </div>
                </Spin>)
            }

            <div className="bg-gray-100 p-6 flex flex-col gap-y-5 h-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link to={`/admin-medis/responden`}> <Home size={14} className="inline mr-1" /> Daftar Kuisioner</Link>,
                            },
                            {
                                title: <Link to={`/admin-medis/responden/questionnaireId=${questionnaireId}`}>{questionnaireName}</Link>,
                            },
                            {
                                title: rwName,
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
                    dataSource={summaryData?.perRt || []}
                    rowKey="rtId"
                    loading={loading.loading || loading.loadingTable}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} RT`,
                    }}
                    scroll={{ x: 800 }}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada data RT" />
                    }}
                />
            </div>
        </div>
    );
}
