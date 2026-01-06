import { Empty, Spin } from "antd";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useQuestionnaire } from "../../hooks/Questionnaire/useQuestionnaire";
import { QuestionnaireCard } from "../Home/partials/HomeComponent";

export default function HomeKader() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        questionnaires,
        loading: quizLoading,
        refetch,
    } = useQuestionnaire();

    const handleStartQuiz = (quizId: string) => {
        navigate(`/quiz/${quizId}`);
    };

    if (quizLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <Spin indicator={<Loader2 className="animate-spin text-blue-500" size={48} />} />
                <p className="text-gray-500 font-medium">Sedang memuat data kuesioner...</p>
            </div>
        );
    }

    const publishedQuestionnaires = Array.isArray(questionnaires)
        ? questionnaires.filter((q) => q.status === "publish")
        : [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Kader</h1>
                    <p className="text-gray-500">Selamat bekerja, {user?.fullname}</p>
                </div>

                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full block"></span>
                            <h2 className="text-xl font-bold text-gray-800">
                                Kuesioner Warga
                            </h2>
                        </div>
                        <span className="text-sm text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                            Mode Petugas
                        </span>
                    </div>

                    {publishedQuestionnaires.length === 0 ? (
                        <Empty
                            description={
                                <span className="text-gray-500">
                                    Belum ada kuesioner yang tersedia untuk disurvei.
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
                                    disabled={false}
                                    availableAt={quiz?.availableAt as string}
                                    onRefresh={refetch}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}