import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
    Breadcrumb,
    Button,
    DatePicker,
    Empty,
    Popover,
    Spin,
    Table,
    Tag,
    message
} from "antd";
import { Home, Filter, ArrowLeft } from "lucide-react";
import dayjs from "dayjs";
import type { RWSummary } from "../../../../../types/adminDesaService";
import { adminDesaService } from "../../../../../service/adminDesaService";
import { getDesaRtDashboardColumn, type DesaRTDataRow } from "../../columns/DesaRtDashboardColumn";
import MentalHealthChart from "../../../../../components/MentalHealthChart";

const { RangePicker } = DatePicker;

export default function DesaRtDashboard() {
    const navigate = useNavigate();
    const params = useParams<{ questionnaireId: string; rwId: string }>();
    const questionnaireId = params?.questionnaireId?.split("=")?.[1] as string
    const rwId = params?.rwId?.split("=")?.[1] as string


    const [loading, setLoading] = useState({
        init: true,
        table: false
    });

    const [summaryData, setSummaryData] = useState<RWSummary | null>(null);

    const [questionnaireName, setQuestionnaireName] = useState<string>("-");
    const [rwName, setRwName] = useState<string>(`RW ${rwId}`); // Default

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        if (questionnaireId && rwId) {
            fetchInitialData();
        }
    }, [questionnaireId, rwId]);

    const fetchInitialData = async () => {
        setLoading(prev => ({ ...prev, init: true }));
        try {
            await Promise.allSettled([
                fetchContextInfo(),
                fetchData()
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(prev => ({ ...prev, init: false }));
        }
    };

    const fetchContextInfo = async () => {
        if (!questionnaireId) return;
        try {
            const qRes = await adminDesaService.getQuestionnaireById(questionnaireId);
            setQuestionnaireName(qRes.data.title);

            const rwListRes = await adminDesaService.summarizeAll(questionnaireId);
            const foundRw = rwListRes.data.perRw.find(r => r.rwId === rwId);
            if (foundRw) {
                setRwName(`RW ${foundRw.rwName}`);
            }
        } catch (error) {
            console.warn("Gagal mengambil info konteks");
        }
    };

    const fetchData = async () => {
        if (!questionnaireId || !rwId) return;
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;

            const res = await adminDesaService.summaryRw(
                questionnaireId,
                rwId,
                startDate,
                endDate
            );

            if (res) {
                setSummaryData(res);
            }
        } catch (error) {
            message.error("Gagal memuat data RT");
        }
    };

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        if (dates) setDateRange(dateStrings);
        else setDateRange(null);
    };

    const applyFilter = async () => {
        setOpenFilter(false);
        setLoading(prev => ({ ...prev, table: true }));
        await fetchData();
        setLoading(prev => ({ ...prev, table: false }));
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);
        setLoading(prev => ({ ...prev, table: true }));

        if (questionnaireId && rwId) {
            try {
                const res = await adminDesaService.summaryRw(questionnaireId, rwId);
                if (res) setSummaryData(res);
            } catch (error) {
                console.error(error);
            }
        }
        setLoading(prev => ({ ...prev, table: false }));
    };

    const filterContent = (
        <div className="w-80 p-1">
            <p className="mb-2 font-semibold text-gray-700">Filter Tanggal Submit</p>
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

    const columns = getDesaRtDashboardColumn({
        onSeeDetail: (rtId) => {
            navigate(`/admin/responden/questionnaireId=${questionnaireId}/rwId=${rwId}/rtId=${rtId}`);
        },
    });

    if (loading.init) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B748]"></div>
            </div>
        );
    }

    if (!summaryData) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Empty description="Data tidak ditemukan">
                    <Button onClick={() => navigate(`/admin/responden/${questionnaireId}`)}>Kembali</Button>
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
                <Spin spinning={loading.init}>
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
                                title: <Link to="/admin/responden"> <Home size={14} className="inline mr-1" /> Daftar Kuisioner</Link>,
                            },
                            {
                                title: <Link to={`/admin/responden/${questionnaireId}`}>{questionnaireName}</Link>,
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
                    dataSource={summaryData.perRt as unknown as DesaRTDataRow[]}
                    rowKey="rtId"
                    loading={loading.table}
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