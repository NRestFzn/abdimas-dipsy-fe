import { useState } from "react";
import { useNavigate } from "react-router";
import { Empty, Spin, Card, Table, Button, Pagination, Select, message } from "antd";
import { Loader2, UsersRound, UserPlus, HistoryIcon } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useQuestionnaire } from "../../../hooks/Questionnaire/useQuestionnaire";
import { QuestionnaireCard } from "../Home/partials/HomeComponent";
import { useMyFamily, useRemoveFamilyMember } from "../../../hooks/Family/useFamily";
import { useFamilyHistory } from "../../../hooks/Questionnaire/useHistory";
import { getFamilyMemberColumns } from "./columns/FamilyMemberColumn";
import { getFamilyHistoryColumns } from "./columns/FamilyHistoryColumn";
import MemberSelectionModal from "./partials/MemberSelectionModal";
import AddMemberModal from "./partials/AddMemberModal";
import RegisterFamilyMemberModal from "./RegisterFamilyMemberModal";

export default function HomeKepalaKeluarga() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    const [isMemberSelectionModalOpen, setIsMemberSelectionModalOpen] = useState(false);
    const [historyFilter, setHistoryFilter] = useState<string>("all");
    const [historyPagination, setHistoryPagination] = useState({ page: 1, pageSize: 10 });

    const { data: familyData, isLoading: isFamilyLoading } = useMyFamily();
    const removeMember = useRemoveFamilyMember();

    const { questionnaires, loading: quizLoading, refetch } = useQuestionnaire();

    const { data: historyResponse, isLoading: historyLoading, isFetching: historyFetching } = useFamilyHistory({
        page: historyPagination.page,
        pageSize: historyPagination.pageSize,
        QuestionnaireID: historyFilter !== "all" ? historyFilter : undefined,
        order: JSON.stringify([["createdAt", "desc"]]),
    });

    const handleStartQuiz = (quizId: string) => {
        setSelectedQuizId(quizId);
        setIsMemberSelectionModalOpen(true);
    };

    const handleSelectMemberForQuiz = (member: any) => {
        setIsMemberSelectionModalOpen(false);
        if (selectedQuizId) {
            navigate(`/quiz/${selectedQuizId}`, {
                state: { targetResident: { id: member.id, fullname: member.fullname } },
            });
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await removeMember.mutateAsync(userId);
            messageApi.success("Berhasil menghapus anggota keluarga");
        } catch (error: any) {
            messageApi.error(error?.response?.data?.message || "Gagal menghapus anggota keluarga");
        }
    };

    if (quizLoading || isFamilyLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <Spin indicator={<Loader2 className="animate-spin text-amber-500" size={48} />} />
                <p className="text-gray-500 font-medium">Memuat dashboard keluarga...</p>
            </div>
        );
    }

    const members = familyData?.members || [];
    const publishedQuestionnaires = Array.isArray(questionnaires)
        ? questionnaires.filter((q) => q.status === "publish")
        : [];

    const memberColumns = getFamilyMemberColumns({
        headOfFamilyId: familyData?.headOfFamilyId,
        onRemove: handleRemoveMember,
    });

    const historyColumns = getFamilyHistoryColumns({
        pagination: historyPagination,
        currentUserId: user?.id,
        onViewResult: (id) => navigate(`/result/${id}`),
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {contextHolder}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8 bg-gradient-to-r from-amber-600 to-amber-400 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-lg shadow-amber-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm border border-white/20">
                                    Panel Kepala Keluarga
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
                                Keluarga {familyData?.headOfFamily?.fullname}
                            </h1>
                            <p className="text-amber-50 text-base sm:text-lg max-w-xl leading-relaxed opacity-90">
                                No. KK: {familyData?.familyCardNumber || "-"}
                            </p>
                        </div>
                        <div className="hidden md:block bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                            <UsersRound size={48} className="text-white" />
                        </div>
                    </div>
                </div>

                <section className="mb-12">
                    <Card
                        className="shadow-sm border-gray-200 rounded-2xl overflow-hidden"
                        title={
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-1">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-50 p-2 rounded-lg text-amber-500">
                                        <UsersRound size={20} />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">
                                        Anggota Keluarga
                                    </h3>
                                </div>
                                <Button
                                    type="primary"
                                    icon={<UserPlus size={16} />}
                                    className="bg-amber-500 hover:bg-amber-600 border-none self-start sm:self-auto"
                                    onClick={() => setIsAddMemberModalOpen(true)}
                                >
                                    Tambah Anggota
                                </Button>
                            </div>
                        }
                    >
                        <Table
                            columns={memberColumns}
                            dataSource={members}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 600 }}
                        />
                    </Card>
                </section>

                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-amber-500 rounded-full block shadow-sm shadow-amber-200" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 leading-none mb-1">
                                    Mulai Survei Anggota
                                </h2>
                                <p className="text-sm text-gray-400 font-medium">
                                    Pilih topik kuesioner untuk diisi
                                </p>
                            </div>
                        </div>
                    </div>

                    {publishedQuestionnaires.length === 0 ? (
                        <Empty
                            description={
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-gray-500 font-medium">Tidak ada tugas survei saat ini.</span>
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

                <section className="mb-12">
                    <Card
                        className="shadow-sm border-gray-200 rounded-2xl overflow-hidden !p-0"
                        styles={{ body: { padding: 0 } }}
                        title={
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
                                        <HistoryIcon size={20} />
                                    </div>
                                    <span className="text-base sm:text-lg font-bold text-gray-800">
                                        Riwayat Pengerjaan Keluarga
                                    </span>
                                </div>
                                <Select
                                    value={historyFilter}
                                    className="w-full sm:w-48"
                                    onChange={(val) => {
                                        setHistoryFilter(val);
                                        setHistoryPagination((p) => ({ ...p, page: 1 }));
                                    }}
                                    options={[
                                        { value: "all", label: "Semua Kuesioner" },
                                        ...(questionnaires || []).map((q) => ({
                                            value: q.id,
                                            label: q.title,
                                        })),
                                    ]}
                                />
                            </div>
                        }
                    >
                        <div className="overflow-x-auto">
                            <Table
                                columns={historyColumns}
                                dataSource={historyResponse?.data || []}
                                rowKey="id"
                                loading={historyLoading || historyFetching}
                                pagination={false}
                                scroll={{ x: 700 }}
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
                                current={historyPagination.page}
                                pageSize={historyPagination.pageSize}
                                total={historyResponse?.meta?.pagination?.total || 0}
                                onChange={(page, pageSize) => setHistoryPagination({ page, pageSize })}
                                showSizeChanger
                                size="small"
                            />
                        </div>
                    </Card>
                </section>

            </main>

            <MemberSelectionModal
                open={isMemberSelectionModalOpen}
                members={members}
                onSelect={handleSelectMemberForQuiz}
                onCancel={() => setIsMemberSelectionModalOpen(false)}
            />

            <AddMemberModal
                open={isAddMemberModalOpen}
                onCancel={() => setIsAddMemberModalOpen(false)}
                onOpenRegister={() => setIsRegisterModalOpen(true)}
            />

            <RegisterFamilyMemberModal
                open={isRegisterModalOpen}
                onCancel={() => setIsRegisterModalOpen(false)}
            />
        </div>
    );
}
