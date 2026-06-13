import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Spin, Empty, Tag } from "antd";
import { ArrowLeft, FileText } from "lucide-react";
import { adminMedisService } from "../../../../service/adminMedisService";
import type { Questionnaire, QuestionnaireQuestion } from "../../../../types/adminMedisService";

export default function KuisionerPreview() {
    const navigate = useNavigate();
    const params = useParams<{ questionnaireId: string }>();
    const questionnaireId = params?.questionnaireId?.split("=")?.[1] as string

    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState<Questionnaire | null>(null);
    const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);

    useEffect(() => {
        if (questionnaireId) {
            fetchData();
        }
    }, [questionnaireId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await adminMedisService.getQuestionnaireById(questionnaireId!);
            
            setDetail(data);

            if (data.questions && Array.isArray(data.questions)) {
                const sortedQuestions = data.questions.sort((a, b) => (a.order || 0) - (b.order || 0));
                setQuestions(sortedQuestions);
            } else {
                setQuestions([]);
            }

        } catch (error) {
            console.error("Gagal memuat pratinjau", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
                <Spin size="large" />
                <p className="mt-4 text-gray-500">Memuat pratinjau...</p>
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
                <Empty description="Kuisioner tidak ditemukan" />
                <Button className="mt-4" onClick={() => navigate(-1)}>Kembali</Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20 relative overflow-hidden">
            
            <img className="absolute z-0 -bottom-10 -right-20 w-[250px] lg:w-[500px] opacity-80 pointer-events-none" src="/berat.png" alt="" />
            <img className="absolute z-0 -bottom-5 -left-10 w-[150px] lg:w-[300px] scale-x-[-1] opacity-80 pointer-events-none" src="/berat.png" alt="" />

            <div className="pt-6 px-6 sm:px-10 lg:px-0 max-w-3xl mx-auto z-50 relative">
                <Button 
                    onClick={() => navigate(-1)} 
                    icon={<ArrowLeft size={18} />}
                    className="bg-white hover:bg-gray-100 border border-gray-200 shadow-sm"
                    shape="round"
                    size="large"
                >
                    Kembali ke Admin
                </Button>
            </div>

            <div className="max-w-3xl mx-auto pt-8 relative z-10">
                <div className="bg-[#70B748] rounded-t-2xl p-8 text-white shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2 opacity-90">
                                <FileText size={20} />
                                <span className="font-medium tracking-wide text-sm uppercase">Mode Pratinjau</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{detail.title}</h1>
                            <p className="text-green-50 text-lg leading-relaxed opacity-90">
                                {detail.description || "Tidak ada deskripsi."}
                            </p>
                        </div>
                        <Tag color={detail.status === 'publish' ? 'success' : 'warning'} className="border-none px-3 py-1">
                            {detail.status === 'publish' ? 'Terbit' : 'Konsep'}
                        </Tag>
                    </div>
                </div>

                <div className="bg-white rounded-b-2xl shadow-lg border-x border-b border-gray-200 p-8 min-h-[400px]">
                    {questions.length === 0 ? (
                        <Empty description="Belum ada pertanyaan di kuisioner ini" />
                    ) : (
                        <div className="space-y-8">
                            {questions.map((q, index) => (
                                <div key={q.id} className="p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-colors">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-[#70B748] rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <span className="pt-1">{q.questionText}</span>
                                    </h3>

                                    <div className="ml-11 space-y-3">
                                        {q.questionType === 'radio' && (
                                            <div className="flex flex-wrap gap-4">
                                                {(detail.scoringType === 'weighted_score'
                                                    ? detail.scoringConfig?.answerOptions || []
                                                    : [
                                                        { value: 'true', label: 'Ya' },
                                                        { value: 'false', label: 'Tidak' },
                                                    ]
                                                ).map((option) => (
                                                    <button
                                                        key={option.value}
                                                        disabled
                                                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed min-w-32"
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {q.questionType === 'text' && (
                                            <input 
                                                disabled 
                                                placeholder="Jawaban teks..." 
                                                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                                            />
                                        )}
                                        
                                        {q.questionType === 'checkbox' && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded bg-gray-50"></div>
                                                <span className="text-gray-400">Pilihan Jawaban</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
