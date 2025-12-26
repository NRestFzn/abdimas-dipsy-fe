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
    Tag
} from "antd";
import { ArrowLeft, Filter, Home } from "lucide-react";
import dayjs from "dayjs";

import { adminMedisService } from "../../../../../service/adminMedisService";
import { adminDesaService } from "../../../../../service/adminDesaService";

import type { RTSummary } from "../../../../../types/adminMedisService";

import MentalHealthChart from "../../../../../components/MentalHealthChart";
import { getWargaMedisColumns } from "../columns/WargaDashboardColumn";

const { RangePicker } = DatePicker;

export default function WargaDashboard() {
    const navigate = useNavigate();

    const params = useParams<{ questionnaireId: string; rwId: string; rtId: string }>();
    const questionnaireId = params?.questionnaireId?.split("=")?.[1] as string
    const rwId = params?.rwId?.split("=")?.[1] as string
    const rtId = params?.rtId?.split("=")?.[1] as string

    const [loading, setLoading] = useState({
        loading: true,
        loadingTable: false
    });

    const [summaryData, setSummaryData] = useState<RTSummary | null>(null);

    const [names, setNames] = useState({
        questionnaire: "-",
        rw: `RW -`,
        rt: `RT -`
    });

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        if (questionnaireId && rwId && rtId) {
            fetchInitialData();
        } else {
            setLoading(prev => ({ ...prev, loading: false }));
        }
    }, [questionnaireId, rwId, rtId]);

    const fetchInitialData = async () => {
        setLoading(prev => ({ ...prev, loading: true }));
        try {
            await Promise.allSettled([
                fetchContextNames(),
                fetchMedisData()
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(prev => ({ ...prev, loading: false }));
        }
    };

    const fetchContextNames = async () => {
        if (!questionnaireId || !rwId || !rtId) return;
        try {
            const qRes = await adminDesaService.getMedisQuestionnaireById(questionnaireId);
            const qTitle = qRes.data.title;

            const [qSummary, rwSummary] = await Promise.all([
                adminMedisService.getQuestionnaireSummary(questionnaireId),
                adminMedisService.summaryRw(questionnaireId, rwId)
            ]);

            const foundRW = qSummary.perRw.find(r => r.rwId === rwId);
            const rwName = foundRW ? `RW ${foundRW.rwName}` : `RW ${rwId}`;

            const foundRT = rwSummary.perRt?.find(rt => rt.rtId === rtId);
            const rtName = foundRT ? `RT ${foundRT.rtName}` : `RT ${rtId}`;

            setNames({ questionnaire: qTitle, rw: rwName, rt: rtName });

        } catch (err) {
            console.warn("Gagal mengambil nama konteks", err);
        }
    };

    const fetchMedisData = async () => {
        if (!questionnaireId || !rwId || !rtId) return;
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;

            const data = await adminMedisService.summaryRt(
                questionnaireId,
                rwId,
                rtId,
                startDate,
                endDate
            );
            setSummaryData(data);
        } catch (err) {
            console.error("Gagal load data medis");
        }
    };

    const handleFilterChange = (dates: any, dateStrings: [string, string]) => {
        setDateRange(dates ? dateStrings : null);
    };

    const applyFilter = async () => {
        setOpenFilter(false);
        setLoading(prev => ({ ...prev, loadingTable: true }));
        await fetchMedisData();
        setLoading(prev => ({ ...prev, loadingTable: false }));
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);
        setLoading(prev => ({ ...prev, loadingTable: true }));

        if (questionnaireId && rwId && rtId) {
            try {
                const res = await adminMedisService.summaryRt(questionnaireId, rwId, rtId);
                setSummaryData(res);
            } catch (error) {
                console.error(error);
            }
        }
        setLoading(prev => ({ ...prev, loadingTable: false }));
    };

    const filterContent = (
        <div className="w-80 p-1">
            <p className="mb-2 font-semibold text-gray-700">Filter Tanggal Submit</p>
            <RangePicker
                className="w-full mb-4"
                onChange={handleFilterChange}
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

    const columns = getWargaMedisColumns({
        onSeeDetail: (UserId) => {
            navigate(`/admin-medis/responden/submissions/questionnaireId=${questionnaireId}/rwId=${rwId}/rtId=${rtId}/userId=${UserId}`)
        }
    });

    const dataSource = summaryData?.users || [];

    if (loading.loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B748]"></div>
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

                            usersData={summaryData?.users as any[]}

                            title={`Statistik Kesehatan Mental Warga - ${names.rt}`}
                            subtitle={`Persentase Kondisi Mental Warga di ${names.rw} ${names.rt}`}
                        />
                    </div>
                </Spin>
            )}

            <div className="bg-gray-100 p-6 flex flex-col gap-y-5 h-full">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link to={`/admin-medis/responden`}> <Home size={14} className="inline mr-1" /> Daftar Kuisioner</Link>
                            },
                            {
                                title: <Link to={`/admin-medis/responden/questionnaireId=${questionnaireId}`}>{names.questionnaire}</Link>
                            },
                            {
                                title: <Link to={`/admin-medis/responden/questionnaireId=${questionnaireId}/rwId=${rwId}`}>{names.rw}</Link>
                            },
                            {
                                title: names.rt,
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
                            <Button icon={<Filter size={16} />}>Filter</Button>
                        </Popover>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="userId"
                    loading={loading.loadingTable}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Warga`,
                    }}
                    scroll={{ x: 800 }}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada data warga" />
                    }}
                />
            </div>
        </div>
    );
}