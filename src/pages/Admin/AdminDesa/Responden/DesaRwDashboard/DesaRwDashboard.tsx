import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Breadcrumb,
  Button,
  DatePicker,
  Empty,
  Popover,
  Table,
  Tag,
  message
} from "antd";
import { Home, Filter, ArrowLeft } from "lucide-react";
import type { SummarizeAllResponse } from "../../../../../types/adminDesaService";
import { adminDesaService } from "../../../../../service/adminDesaService";
import { getDesaRwDashboardColumn, type DesaRWDataRow } from "../../columns/DesaRwDashboardColumn";
import MentalHealthChart from "../../../../../components/MentalHealthChart";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function DesaRwDashboard() {
  const navigate = useNavigate();
  const params = useParams<{ questionnaireId: string }>();
  const questionnaireId = params?.questionnaireId?.split("=")?.[1] as string

  const [loading, setLoading] = useState({
    init: true,
    table: false
  });
  const [summaryData, setSummaryData] = useState<SummarizeAllResponse["data"] | null>(null);
  const [questionnaireName, setQuestionnaireName] = useState<string>("-");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [openFilter, setOpenFilter] = useState(false);



  useEffect(() => {
    if (questionnaireId) {
      fetchInitialData();
    }
  }, [questionnaireId]);

  const fetchInitialData = async () => {
    setLoading(prev => ({ ...prev, init: true }));
    try {
      await Promise.allSettled([
        fetchQuestionnaireInfo(),
        fetchSummary()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(prev => ({ ...prev, init: false }));
    }
  };

  const fetchQuestionnaireInfo = async () => {
    if (!questionnaireId) return;
    try {
      const res = await adminDesaService.getQuestionnaireById(questionnaireId);
      setQuestionnaireName(res.data.title);
    } catch (error) {
      console.error("Gagal ambil nama kuisioner");
    }
  };

  const fetchSummary = async () => {
    if (!questionnaireId) return;
    try {
      const startDate = dateRange ? dateRange[0] : undefined;
      const endDate = dateRange ? dateRange[1] : undefined;

      const res = await adminDesaService.summarizeAll(questionnaireId, startDate, endDate);
      if (res.data) {
        setSummaryData(res.data);
      }
    } catch (error) {
      message.error("Gagal memuat data RW");
    }
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) setDateRange(dateStrings);
    else setDateRange(null);
  };

  const applyFilter = async () => {
    setOpenFilter(false);
    setLoading(prev => ({ ...prev, table: true }));
    try {
      await fetchSummary();
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const clearFilter = async () => {
    setDateRange(null);
    setOpenFilter(false);
    setLoading(prev => ({ ...prev, table: true }));

    try {
      if (questionnaireId) {
        const res = await adminDesaService.summarizeAll(questionnaireId);
        if (res.data) setSummaryData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
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
      <div className="flex justify-end gap-2 pt-2">
        <Button onClick={clearFilter} size="small">Reset</Button>
        <Button type="primary" className="!bg-[#70B748]" onClick={applyFilter} size="small">
          Terapkan
        </Button>
      </div>
    </div>
  );

  const columns = getDesaRwDashboardColumn({
    onSeeDetail: (rwId) => {
      navigate(`/admin/responden/questionnaireId=${questionnaireId}/rwId=${rwId}`);
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
          <Button onClick={() => navigate("/admin/responden")}>Kembali ke Daftar</Button>
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
      )}

      <div className="bg-gray-100 p-6 flex flex-col gap-y-5 h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Breadcrumb
            items={[
              {
                title: <Link to="/admin/responden"> <Home size={14} className="inline mr-1" /> Daftar Kuisioner</Link>,
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
          dataSource={summaryData.perRw as unknown as DesaRWDataRow[]}
          rowKey="rwId"
          loading={loading.table}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} RW`,
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada data RW" />
          }}
        />
      </div>
    </div>
  );
}