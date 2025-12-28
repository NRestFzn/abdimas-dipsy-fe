import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { questionnaireService } from "../../service/questionnaireService";
import { AlertCircle, ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import { Button, Card, Empty, Spin, Table, Tag, Typography } from "antd";
import { getUserResultColumns } from "./columns/ResultColumn";
import ResultPieChart from "../../components/Charts/ResultPieChart";

const { Title, Text, Paragraph } = Typography;

interface QuestionnaireQuestion {
  questionText: string;
  questionType: string;
  order?: number;
}

interface QuestionnaireAnswerItem {
  answerValue: string;
  questionnaireQuestion: QuestionnaireQuestion;
}

interface MappedQuestionData {
  no: number;
  question: string;
  answer: string;
}

export default function Result() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [questionnaireAnswer, setQuestionnaireAnswer] = useState<
    QuestionnaireAnswerItem[]
  >([]);
  const [questionnaireId, setQuestionnaireId] = useState<string>();
  const [questionnaireResult, setQuestionnaireResult] = useState<any>();

  useEffect(() => {
    if (id) {
      const fetchResult = async () => {
        setLoading(true);
        try {
          const response = await questionnaireService.getDetailAnswer(id);

          if (response?.data?.questionnaireAnswer) {
            const transformed = response.data.questionnaireAnswer.map(
              (item: { answerValue: string; questionnaireQuestion: any }) => ({
                ...item,
                answerValue: item.answerValue === 'true' ? 'Ya' : 'Tidak',
              })
            );

            setQuestionnaireAnswer(transformed);

            if (response.data.QuestionnaireId) {
              setQuestionnaireId(response.data.QuestionnaireId);
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching questionnaire:', error);
          setLoading(false);
        }
      };

      fetchResult();
    }
  }, [id]);

  useEffect(() => {
    if (questionnaireId) {
      const summarizeMe = async () => {
        try {
          const data = await questionnaireService.summarizeMe(questionnaireId);
          setQuestionnaireResult(
            data.data.submissions.find((item: any) => item.submissionId == id)
          );
        } catch (error) {
          console.error('Error summarize:', error);
        } finally {
          setLoading(false);
        }
      };

      summarizeMe();
    }
  }, [questionnaireId, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const yaCount = questionnaireAnswer.filter(
    (q) => q.answerValue === 'Ya'
  ).length;
  const tidakCount = questionnaireAnswer.filter(
    (q) => q.answerValue === 'Tidak'
  ).length;
  const isUnstable = questionnaireResult?.isMentalUnStable == 1;

  const tableDataSource: MappedQuestionData[] = questionnaireAnswer.map(
    (item, index) => ({
      no: index + 1,
      question: item.questionnaireQuestion.questionText,
      answer: item.answerValue,
    })
  );

  const columns = getUserResultColumns();

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <Spin size="large" />
        <p className="mt-4 text-gray-500">Memuat hasil tes...</p>
      </div>
    );
  }

  if (!questionnaireAnswer || questionnaireAnswer.length === 0) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <Empty description="Data hasil tes tidak ditemukan" />
        <Button className="mt-4" onClick={() => navigate('/')}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const statusColor = isUnstable ? 'text-red-500' : 'text-[#70B748]';
  const statusBg = isUnstable
    ? 'bg-red-50 border-red-100'
    : 'bg-green-50 border-green-100';
  const StatusIcon = isUnstable ? AlertCircle : CheckCircle2;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
      <div className="bg-transparent pt-6 pb-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Button
            type="text"
            onClick={() => navigate("/")}
            className="hover:bg-gray-200 font-medium text-gray-600 pl-0 flex items-center"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">

        <Card
          className="shadow-sm border-gray-200 rounded-2xl overflow-hidden !p-0"
        >
          <div className="flex flex-col lg:flex-row">

            <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center max-lg:p-3">
              <div className="flex items-center gap-2 mb-4">
                <Tag color={isUnstable ? "error" : "success"} className="px-3 py-1 text-sm rounded-full">
                  hasil analisa kesehatan mental
                </Tag>
              </div>

              <div className="mb-2">
                <Text className="text-gray-500 text-lg">Kondisi kamu saat ini:</Text>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <StatusIcon className={`w-10 h-10 max-lg:hidden ${statusColor}`} />
                <Title level={1} className={`!m-0 !font-extrabold tracking-tight ${statusColor}`}>
                  {isUnstable ? "BERISIKO" : "STABIL"}
                </Title>
              </div>

              <div className={`p-6 rounded-xl border ${statusBg} mb-6`}>
                <h4 className={`font-semibold text-lg mb-2 ${isUnstable ? 'text-red-700' : 'text-green-700'}`}>
                  {isUnstable ? "Berisiko" : "Stabil"}
                </h4>
                <Paragraph className="!mb-0 text-gray-700 leading-relaxed">
                  {isUnstable
                    ? "Hasil tes menunjukkan adanya beberapa hal yang perlu kamu perhatikan lebih lanjut. Tidak ada salahnya untuk mencoba lebih peduli pada kondisi diri sendiri dan luangkan waktu untuk beristirahat sejenak."
                    : "Hasil tes menunjukkan kondisi kamu saat ini cukup baik. Tetap jaga pola hidup yang sehat dan luangkan waktu untuk berkumpul bersama keluarga agar pikiran tetap tenang."}
                </Paragraph>
              </div>
            </div>

            <div className="lg:w-[450px] bg-gray-50 border-l border-gray-100 p-8 flex flex-col items-center justify-center relative max-lg:p-4">
              <div className="w-full flex gap-x-2 items-center">
                <FileText size={16} />
                <Text strong className="text-gray-500 flex items-center gap-2">
                  Statistik Jawaban
                </Text>
              </div>
              <div className="w-full mt-4">
                <ResultPieChart yaCount={yaCount} tidakCount={tidakCount} />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3 mt-10 mb-4">
          <div className="h-8 w-1 bg-gray-800 rounded-full"></div>
          <Title level={3} className="!m-0 text-gray-800">Rincian Jawaban</Title>
        </div>

        <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden mb-10 !p-0" styles={{ body: { padding: 0 } }}>
          <div className="bg-white">
            <Table
              columns={columns}
              dataSource={tableDataSource}
              rowKey="no"
              pagination={false}
              scroll={{ x: 600 }}
              rowClassName="hover:bg-gray-50 transition-colors"
              size="middle"
            />
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center max-lg:flex-col max-lg:gap-y-4">
            <Text type="secondary" className="text-sm">
              Total {questionnaireAnswer.length} pertanyaan terjawab
            </Text>
            <Button
              type="text"
              onClick={() => navigate("/")}
              className="hover:bg-gray-200 font-medium text-gray-600 pl-0 flex items-center"
            >
              <ArrowLeft size={18} />
              Kembali ke Beranda
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
