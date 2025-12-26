import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  Empty,
  Select,
  Table,
  Spin,
  DatePicker,
  Pagination,
  Badge,
  Button,
} from "antd";
import { Filter, HistoryIcon, Loader2 } from "lucide-react";
import dayjs from "dayjs";

import { useQuestionnaire } from "../../hooks/useQuestionnaire";
import { useAuth } from "../../context/AuthContext";

import { questionnaireService } from "../../service/questionnaireService";

import { QuestionnaireCard, WelcomeHeader } from "./partials/HomeComponent";
import type { HistoryData } from "../../types/wargaType";
import { getHistoryColumn } from "./columns/HistoryColumn";
import { MobileFilterDrawer } from "./partials/MobileFilterDrawer";

const { RangePicker } = DatePicker;

export default function Home() {
  const navigate = useNavigate();
  const {
    questionnaires,
    loading: quizLoading,
    error: quizError,
    refetch,
  } = useQuestionnaire();
  const { user, logout } = useAuth();

  const [history, setHistory] = useState<HistoryData[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const [selectedQuizFilter, setSelectedQuizFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleResetFilter = () => {
    setSelectedQuizFilter("all");
    setDateRange(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token && user) {
      logout();
      return;
    }

    fetchHistory();
  }, [questionnaires]);

  useEffect(() => {
    if (quizError && quizError.includes("Gagal memuat kuisioner")) {
      const timer = setTimeout(() => refetch(), 2000);
      return () => clearTimeout(timer);
    }
  }, [quizError]);

  const fetchHistory = async () => {
    if (history.length === 0) setHistoryLoading(true);

    try {
      const result = await questionnaireService.getHistory();

      const responseData: any = result.data;
      const rawList = Array.isArray(responseData)
        ? responseData
        : responseData.data || responseData.submissions || [];

      const mappedData: HistoryData[] = rawList.map((item: any) => {
        const qId = item.QuestionnaireId || item.questionnaireId;
        const relatedQuiz = questionnaires.find((q) => q.id === qId);

        return {
          id: item.id || item.submissionId,
          createdAt: item.createdAt || item.submissionDate,
          score: item.score,
          questionnaire: {
            id: qId,
            title: relatedQuiz ? relatedQuiz.title : "Memuat Judul...",
          },
        };
      });

      setHistory(mappedData);
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleViewResult = (submissionId: string) => {
    navigate(`/result/${submissionId}`);
  };

  const getFilteredHistory = () => {
    let filtered = [...history];

    if (selectedQuizFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.questionnaire.id === selectedQuizFilter
      );
    }

    if (dateRange) {
      const start = dayjs(dateRange[0]).startOf("day");
      const end = dayjs(dateRange[1]).endOf("day");
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.createdAt);
        return itemDate.isAfter(start) && itemDate.isBefore(end);
      });
    }

    return filtered;
  };

  const filteredHistoryData = getFilteredHistory();

  const publishedQuestionnaires = Array.isArray(questionnaires)
    ? questionnaires.filter((q) => q.status === "publish")
    : [];

  const wargaHistoryColumn = getHistoryColumn({
    onSee: (id: string) => handleViewResult(id),
    pagination
  })

  const activeFilterCount = (selectedQuizFilter !== "all" ? 1 : 0) + (dateRange ? 1 : 0);

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Spin
          indicator={
            <Loader2 className="animate-spin text-[#70B748]" size={48} />
          }
        />
        <p className="text-gray-500 font-medium">Sedang memuat data...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeHeader fullname={user?.fullname || "User"} />

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#70B748] rounded-full block"></span>
              <h2 className="text-xl font-bold text-gray-800">
                Daftar Kuesioner
              </h2>
            </div>
          </div>

          {publishedQuestionnaires.length === 0 ? (
            <Empty
              description={
                <span className="text-gray-500">
                  Belum ada kuesioner yang tersedia saat ini.
                </span>
              }
              className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedQuestionnaires.map((quiz) => (
                <QuestionnaireCard
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  onStart={handleStartQuiz}
                  disabled={quiz.isAvailable}
                  availableAt={quiz.availableAt}
                  onRefresh={refetch}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <Card
            className="shadow-sm border-gray-200 rounded-2xl overflow-hidden !p-0"
            bodyStyle={{ padding: 0 }}
            title={
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
                    <HistoryIcon size={20} />
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    Riwayat Pengerjaan
                  </span>
                </div>

                <div className="hidden md:flex gap-3">
                  <Select
                    value={selectedQuizFilter}
                    className="w-48"
                    onChange={setSelectedQuizFilter}
                    options={[
                      { value: "all", label: "Semua Kuesioner" },
                      ...(questionnaires || []).map((q) => ({
                        value: q.id,
                        label: q.title,
                      })),
                    ]}
                  />
                  <RangePicker
                    className="w-64"
                    onChange={(dates, dateStrings) => {
                      if (dates) setDateRange(dateStrings as [string, string]);
                      else setDateRange(null);
                    }}
                  />
                </div>

                <div className="md:hidden w-full">
                  <Badge count={activeFilterCount} offset={[-5, 5]}>
                    <Button
                      block
                      icon={<Filter size={16} />}
                      onClick={() => setIsFilterDrawerOpen(true)}
                    >
                      Filter Data
                    </Button>
                  </Badge>
                </div>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <Table<HistoryData>
                columns={wargaHistoryColumn}
                dataSource={filteredHistoryData}
                rowKey="id"
                loading={historyLoading}
                pagination={false}
                scroll={{ x: 800 }}
                rowClassName="hover:bg-gray-50"
                locale={{
                  emptyText: (
                    <div className="py-10">
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Belum ada riwayat pengerjaan"
                      />
                    </div>
                  ),
                }}
              />
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={filteredHistoryData?.length || 0}
                onChange={(page, pageSize) => {
                  setPagination({ current: page, pageSize: pageSize });
                }}
                showSizeChanger
                size="small"
              />
            </div>
          </Card>
        </section>

        <MobileFilterDrawer
          open={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          questionnaires={questionnaires}
          selectedQuizFilter={selectedQuizFilter}
          setSelectedQuizFilter={setSelectedQuizFilter}
          setDateRange={setDateRange}
          onReset={handleResetFilter}
        />

      </main>
    </div>
  );
}
