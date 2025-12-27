import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
    questionnaireService,
    type QuestionnaireDetail,
    validateQuestionnaireData,
} from "../../service/questionnaireService";
import { AlertTriangle, ArrowLeft, Loader2, Send } from "lucide-react";
import { Button, message, Modal, Spin } from "antd";
import { QuizProgressBar } from "./Partials/ProgressBar";
import { QuizHeader } from "./Partials/QuizHeader";
import { QuizInstruction } from "./Partials/QuizInstruction";
import { QuestionCard } from "./Partials/QuestionCard";

export default function Quiz() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [quiz, setQuiz] = useState<QuestionnaireDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                let quizData;

                try {
                    quizData = await questionnaireService.getPublicQuestionnaireById(id);
                } catch (publicErr) {
                    console.log("Public API failed, trying regular endpoint...");
                    quizData = await questionnaireService.getQuestionnaireById(id);
                }

                const validatedData = validateQuestionnaireData(quizData);

                if (!validatedData.questions || validatedData.questions.length === 0) {
                    console.warn("No questions found in questionnaire");
                    throw new Error("Kuisioner tidak memiliki pertanyaan");
                }

                setQuiz(validatedData);

                const initialAnswers: Record<string, string> = {};
                validatedData.questions.forEach((question) => {
                    if (question.id && question.questionText) {
                        initialAnswers[question.id] = "";
                    } else {
                        console.warn("Invalid question skipped:", question);
                    }
                });

                setAnswers(initialAnswers);
            } catch (err: any) {
                console.error(err);
                message.error(err.message || "Gagal memuat kuisioner");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleExit = () => {
        Modal.confirm({
            title: null,
            icon: null,
            content: (
                <div className="flex flex-col items-center text-center p-2">
                    <div className="bg-red-50 p-4 rounded-full mb-4 text-red-500 animate-in zoom-in duration-300">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Batalkan Pengisian?
                    </h3>
                    <p className="text-gray-500 text-base leading-relaxed">
                        Progres jawabanmu saat ini <b>tidak akan tersimpan</b> jika kamu keluar sekarang. Yakin ingin berhenti?
                    </p>
                </div>
            ),
            okText: "Ya, Keluar",
            cancelText: "Lanjut Mengerjakan",
            okButtonProps: {
                danger: true,
                size: 'large',
                className: 'w-full sm:w-auto'
            },
            cancelButtonProps: {
                size: 'large',
                type: 'primary',
                className: '!bg-[#70B748] !hover:bg-[#5a9639] w-full sm:w-auto mt-2 sm:mt-0' // Primary color untuk action "Stay"
            },
            width: 420,
            centered: true,
            className: "modern-modal",
            onOk: () => navigate('/'),
        });
    };

    const handleSubmit = async () => {
        if (!id || !quiz) return;

        const unansweredCount = Object.values(answers).filter(val => val === "").length;
        if (unansweredCount > 0) {
            Modal.warning({
                title: "Belum Selesai",
                content: `Masih ada ${unansweredCount} pertanyaan yang belum dijawab. Mohon lengkapi semua jawaban.`,
                okText: "Saya Mengerti",
                okButtonProps: { className: "!bg-[#70B748]" }
            });
            return;
        }

        try {
            setSubmitting(true);
            const response = await questionnaireService.submitAnswers(id, answers);

            navigate(`/result/${response.data?.id}`, {
                state: {
                    submissionData: response.data,
                    questionnaireTitle: quiz.title,
                },
            });
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || "Gagal mengirim jawaban");
        } finally {
            setSubmitting(false);
        }
    };

    const totalQuestions = quiz?.questions?.length || 0;
    const answeredCount = Object.values(answers).filter(a => a !== "").length;
    const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
                <Spin indicator={<Loader2 className="animate-spin text-[#70B748]" size={48} />} />
                <p className="text-gray-500 font-medium">Menyiapkan soal...</p>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 mb-4">Kuisioner tidak ditemukan</p>
                <Button onClick={() => navigate("/")}>Kembali ke Beranda</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <QuizProgressBar
                current={answeredCount}
                total={totalQuestions}
                percent={progressPercentage}
            />

            <main className="max-w-2xl mx-auto pb-32 relative">
                <div className="absolute top-4 left-4 md:-left-16">
                    <Button
                        type="text"
                        icon={<ArrowLeft className="text-gray-400 hover:text-gray-600" />}
                        onClick={handleExit}
                        title="Batal & Kembali"
                    />
                </div>

                <QuizHeader
                    title={quiz.title || "Kuisioner"}
                    description={quiz.description}
                />

                <QuizInstruction />

                <div className="space-y-4 px-4">
                    {quiz.questions.map((question, index) => (
                        <QuestionCard
                            key={question.id}
                            id={question.id}
                            index={index}
                            text={question.questionText}
                            type={question.questionType}
                            options={question.options || []}
                            selectedAnswer={answers[question.id]}
                            onAnswer={handleAnswerChange}
                        />
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg md:static md:bg-transparent md:border-none md:shadow-none md:mt-10 md:p-4 z-40">
                    <div className="max-w-2xl mx-auto">
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleSubmit}
                            loading={submitting}
                            disabled={answeredCount < totalQuestions}
                            className="h-12 text-lg font-semibold !hover:bg-[#5a9639] border-none shadow-md hover:shadow-lg transition-all"
                            icon={!submitting && <Send size={18} />}
                        >
                            {submitting ? "Mengirim Jawaban..." : "Kirim Jawaban"}
                        </Button>
                        <p className="text-xs text-center text-gray-400 mt-2 md:hidden">
                            Pastikan semua pertanyaan terjawab
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
