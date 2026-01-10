import { useState, useEffect } from "react";
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
} from "antd";
import { ArrowLeft, Filter, Home } from "lucide-react";
import dayjs from "dayjs";

import { useSummaryRt } from "../../../../hooks/Questionnaire/useSubmission"; // Pastikan path import benar
import { questionnaireService } from "../../../../service/Questionnaire/questionnaireService";

import MentalHealthChart from "../../../../components/MentalHealthChart";
import { getKaderRtDashboardColumn, type KaderWargaDataRow } from "../Columns/kaderRtDashboardColumn";

const { RangePicker } = DatePicker;

export default function KaderRtDetail() {
    const navigate = useNavigate();
    const { questionnaireId, rwId, rtId } = useParams<{ questionnaireId: string; rwId: string; rtId: string }>();

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);
    const [metaInfo, setMetaInfo] = useState({
        questionnaireTitle: "-",
        rtName: `RT ${rtId || '-'}`,
    });

    const {
        data: response,
        isLoading,
        isFetching,
        refetch
    } = useSummaryRt({
        questionnaireId: questionnaireId || "",
        rwId: rwId || "",
        rtId: rtId || "",
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
    });

    useEffect(() => {
        if (questionnaireId) {
            questionnaireService.getPublicQuestionnaireById(questionnaireId)
                .then(res => {
                    setMetaInfo(prev => ({ ...prev, questionnaireTitle: res?.title || "-" }));
                })
                .catch(() => {
                    setMetaInfo(prev => ({ ...prev, questionnaireTitle: "Detail Kuesioner" }));
                });
        }
    }, [questionnaireId]);

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        if (dates) setDateRange(dateStrings);
        else setDateRange(null);
    };

    const applyFilter = () => {
        setOpenFilter(false);
        refetch();
    };

    const clearFilter = () => {
        setDateRange(null);
        setOpenFilter(false);
        setTimeout(() => refetch(), 0);
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

    const columns = getKaderRtDashboardColumn();
    const summaryData = response?.data;
    const usersList = summaryData?.users || [];

    if (isLoading && !summaryData) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B748]"></div>
            </div>
        );
    }

    if (!rtId || !questionnaireId) {
        return (
            <div className="h-[70vh] flex items-center justify-center flex-col gap-4">
                <Empty description="Data Tidak Ditemukan" />
                <Button onClick={() => navigate(-1)}>Kembali</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full min-h-screen bg-gray-50 pb-20">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <Button
                    type="default"
                    onClick={() => navigate(-1)}
                    className="flex items-center mb-4 border-none shadow-sm hover:bg-gray-100"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Kembali
                </Button>

                {summaryData && (
                    <div className="mb-6">
                        <Spin spinning={isFetching}>
                            <MentalHealthChart
                                overallDepressionRate={summaryData?.summarize?.unStableMentalPercentage || 0}
                                totalSubmit={summaryData?.summarize?.submitCount || 0}
                                totalUser={summaryData?.summarize?.userCount || 0}
                                usersData={usersList as any[]}
                                title={`Statistik Kesehatan Mental`}
                                subtitle={`Persentase Kondisi Mental Warga`}
                            />
                        </Spin>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-y-5">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                        <Breadcrumb
                            items={[
                                {
                                    title: <Link to="/kader"> <Home size={14} className="inline mr-1" /> Dashboard</Link>,
                                },
                                {
                                    title: <span className="text-gray-500">{metaInfo.questionnaireTitle}</span>,
                                },
                                // {
                                //     title: <span className="font-semibold text-gray-800">RT {rtName}</span>,
                                // },
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
                        dataSource={usersList as KaderWargaDataRow[]}
                        rowKey="UserId"
                        loading={isFetching}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Warga`,
                        }}
                        scroll={{ x: 800 }}
                        locale={{
                            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada data warga yang mengisi di RT ini" />
                        }}
                        rowClassName="hover:bg-gray-50"
                    />
                </div>
            </div>
        </div>
    );
}