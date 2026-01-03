import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  Empty,
  Select,
  Table,
  Spin,
  Pagination,
  Badge,
  Button,
} from "antd";
import { Filter, HistoryIcon, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { QuestionnaireCard, WelcomeHeader } from "./partials/HomeComponent";
import { getHistoryColumn } from "./columns/HistoryColumn";
import { MobileFilterDrawer } from "./partials/MobileFilterDrawer";
import { useHistory } from "../../hooks/Questionnaire/useHistory";
import type { QuestionnaireHistoryResponse } from "../../types/Questionnaire/questionnaireTypes";
import { useQuestionnaire } from "../../hooks/Questionnaire/useQuestionnaire";

// const { RangePicker } = DatePicker;

export type HistoryTableData = QuestionnaireHistoryResponse;

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedQuizFilter, setSelectedQuizFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })

  const {
    questionnaires,
    loading: quizLoading,
    refetch,
  } = useQuestionnaire();

  const {
    data: historyResponse,
    isLoading: historyLoading,
    isFetching: historyFetching,
  } = useHistory({
    page: pagination.page,
    pageSize: pagination.pageSize,
    QuestionnaireID: selectedQuizFilter !== "all" ? selectedQuizFilter : undefined,
    order: JSON.stringify([["createdAt", "desc"]]),
  });

  const handleResetFilter = () => {
    setSelectedQuizFilter("all");
    setPagination((prev) => ({ ...prev, page: 1 }));
    setDateRange(null);
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleViewResult = (submissionId: string) => {
    navigate(`/result/${submissionId}`);
  };

  const wargaHistoryColumn = getHistoryColumn({
    onSee: handleViewResult,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
  });

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

  const dataSource: HistoryTableData[] = historyResponse?.data || [];
  const publishedQuestionnaires = Array.isArray(questionnaires)
    ? questionnaires.filter((q) => q.status === "publish")
    : [];

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
            styles={{ body: { padding: 0 } }}
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
                    placeholder="Filter Kuesioner"
                    onChange={(val) => {
                      setSelectedQuizFilter(val);
                      setPagination((p) => ({ ...p, page: 1 }));
                    }}
                    options={[
                      { value: "all", label: "Semua Kuesioner" },
                      ...(questionnaires || []).map((q) => ({
                        value: q.id,
                        label: q.title,
                      })),
                    ]}
                  />
                  {/* <RangePicker
                    className="w-64"
                    onChange={(dates, dateStrings) => {
                      if (dates) setDateRange(dateStrings as [string, string]);
                      else setDateRange(null);
                    }}
                  /> */}
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
              <Table<HistoryTableData>
                columns={wargaHistoryColumn}
                dataSource={dataSource}
                rowKey="id"
                loading={historyLoading || historyFetching}
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
                current={pagination.page}
                pageSize={pagination.pageSize}
                total={historyResponse?.meta?.pagination?.total || 0}
                onChange={(page, pageSize) => {
                  setPagination({ page, pageSize });
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
