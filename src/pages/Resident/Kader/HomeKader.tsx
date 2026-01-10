import { useNavigate } from "react-router";
import {
    Empty,
    Spin,
    Card,
    Statistic,
    Table,
    Pagination,
} from "antd";
import {
    Loader2,
    ClipboardCheck,
    Users,
    Activity,
    Info,
    History
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { usePublicQuestionnaire, useQuestionnaire } from "../../../hooks/Questionnaire/useQuestionnaire";
import { QuestionnaireCard } from "../Home/partials/HomeComponent";
import { useState } from "react";
import { ResidentSelectionModal } from "./Partials/ResidentSelectionModal";
import { getKaderHistoryColumn } from "./Columns/publicQuestionnaireColumn";

export default function HomeKader() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });

    const {
        questionnaires,
        loading: quizLoading,
        refetch,
    } = useQuestionnaire();

    const {
        data: publicQuizData,
        isLoading: isTableLoading
    } = usePublicQuestionnaire({
        page: pagination.page,
        pageSize: pagination.pageSize,
    });

    const handleStartQuiz = (quizId: string) => {
        setSelectedQuizId(quizId);
        setIsResidentModalOpen(true);
    };

    const handleResidentSelect = (resident: any) => {
        setIsResidentModalOpen(false);

        if (selectedQuizId) {
            navigate(`/quiz/${selectedQuizId}`, {
                state: {
                    targetResident: resident
                }
            });
        }
    };

    const rwId = user?.userDetail?.RukunWargaId
    const handleDetailClick = (id: string) => {
        navigate(`/summary-rw/${id}/${rwId}`);
    };

    const tableColumns = getKaderHistoryColumn({
        onDetail: handleDetailClick,
        pagination: pagination,
    });

    if (quizLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <Spin indicator={<Loader2 className="animate-spin text-blue-500" size={48} />} />
                <p className="text-gray-500 font-medium">Memuat dashboard kader...</p>
            </div>
        );
    }

    const publishedQuestionnaires = Array.isArray(questionnaires)
        ? questionnaires.filter((q) => q.status === "publish")
        : [];

    const dataSource = publicQuizData?.data || [];
    const totalData = publicQuizData?.meta?.pagination?.total || 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl p-8 text-white shadow-lg shadow-blue-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm border border-white/20">
                                    Panel Petugas
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">
                                Halo, {user?.fullname} 👋
                            </h1>
                            <p className="text-blue-50 text-lg max-w-xl leading-relaxed opacity-90">
                                Selamat bertugas. Mari bantu data kesehatan warga desa agar lebih akurat dan terpercaya.
                            </p>
                        </div>
                        <div className="hidden md:block bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                            <ClipboardCheck size={48} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card variant="borderless" className="shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-500 font-medium flex items-center gap-2"><Activity size={16} /> Kuesioner Aktif</span>}
                            value={publishedQuestionnaires.length}
                            suffix="Topik"
                            styles={{ content: { fontWeight: 'bold', color: '#2563EB' } }}
                        />
                    </Card>
                    <Card variant="borderless" className="shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-500 font-medium flex items-center gap-2"><Users size={16} /> Target Survei</span>}
                            value="Warga Desa"
                            styles={{ content: { fontWeight: 'bold', color: '#4B5563', fontSize: '20px' } }}
                        />
                    </Card>
                    <Card variant="borderless" className="bg-blue-50 border border-blue-100 shadow-sm rounded-2xl flex items-center">
                        <div className="flex gap-4 items-start">
                            <Info className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Tips Kader</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">Pastikan data NIK responden sesuai KTP sebelum memulai pengisian.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-500 rounded-full block shadow-sm shadow-blue-200"></span>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 leading-none mb-1">
                                    Mulai Survei
                                </h2>
                                <p className="text-sm text-gray-400 font-medium">
                                    Pilih topik kuesioner di bawah ini
                                </p>
                            </div>
                        </div>
                    </div>

                    {publishedQuestionnaires.length === 0 ? (
                        <Empty
                            description={
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-gray-500 font-medium">Tidak ada tugas survei saat ini.</span>
                                    <span className="text-gray-400 text-xs">Silakan hubungi admin desa jika ini kesalahan.</span>
                                </div>
                            }
                            className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm"
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
                                    disabled={quiz?.isAvailable as boolean}
                                    availableAt={quiz?.availableAt as string}
                                    onRefresh={refetch}
                                    category={quiz.category?.name}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <div className="flex justify-center mt-12">
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistem Siap • Mode Petugas Lapangan
                    </p>
                </div>

                <section className="my-12">
                    <Card
                        className="shadow-sm border-gray-200 rounded-2xl overflow-hidden !p-0"
                        styles={{ body: { padding: 0 } }}
                        title={
                            <div className="flex items-center gap-3 py-4">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                                    <History size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 leading-tight">Data Hasil Kuesioner</h3>
                                    <p className="text-xs text-gray-400 font-normal">Daftar semua kuesioner yang tersedia untuk publik</p>
                                </div>
                            </div>
                        }
                    >
                        <Table
                            columns={tableColumns}
                            dataSource={dataSource}
                            rowKey="id"
                            loading={isTableLoading}
                            pagination={false}
                            scroll={{ x: 800 }}
                            rowClassName="hover:bg-gray-50 transition-colors"
                        />

                        <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
                            <Pagination
                                current={pagination.page}
                                pageSize={pagination.pageSize}
                                total={totalData}
                                showSizeChanger
                                onChange={(page, pageSize) => setPagination({ page, pageSize })}
                                size="small"
                            />
                        </div>
                    </Card>
                </section>

                <ResidentSelectionModal
                    open={isResidentModalOpen}
                    onClose={() => setIsResidentModalOpen(false)}
                    onSelect={handleResidentSelect}
                />

            </main>
        </div>
    );
}