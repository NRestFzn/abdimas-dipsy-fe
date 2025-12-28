import {useNavigate, useParams} from 'react-router';
import {useEffect, useState} from 'react';
import {AlertCircle, ArrowLeft, CheckCircle2, FileText} from 'lucide-react';
import {Button, Card, Empty, Spin, Table, Tag, Typography, message} from 'antd';
import {
  getMedisResultColumns,
  type QuestionResult,
} from '../columns/MedisResultColumn';
import {adminMedisService} from '../../../../../service/adminMedisService';
import type {SubmissionDetailResponse} from '../../../../../types/adminMedisService';
import ResultPieChart from '../../../../../components/Charts/ResultPieChart';

const {Title, Text, Paragraph} = Typography;

export default function MedisResult() {
  const navigate = useNavigate();

  const params = useParams<{submissionId: string}>();
  const submissionId = params?.submissionId?.split('=')?.[1] as string;

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<SubmissionDetailResponse | null>(
    null
  );
  const [mappedQuestions, setMappedQuestions] = useState<QuestionResult[]>([]);
  const [userName, setUserName] = useState<string>('-');

  useEffect(() => {
    if (submissionId) {
      fetchData(submissionId);
    }
  }, [submissionId]);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const detailRes = await adminMedisService.getSubmissionDetail(id);
      setDetailData(detailRes);
      setUserName((detailRes?.user?.fullname as string) || '-');

      if (
        detailRes.questionnaireAnswer &&
        detailRes.questionnaireAnswer.length > 0
      ) {
        const sortedAnswers = detailRes.questionnaireAnswer.sort(
          (a, b) =>
            a.questionnaireQuestion.order - b.questionnaireQuestion.order
        );

        const questions: QuestionResult[] = sortedAnswers.map((item) => ({
          no: item.questionnaireQuestion.order,
          question: item.questionnaireQuestion.questionText,
          answer: item.answerValue === 'true' ? 'Ya' : 'Tidak',
        }));

        setMappedQuestions(questions);
      }
    } catch (error) {
      console.error(error);
      message.error('Gagal memuat hasil tes');
    } finally {
      setLoading(false);
    }
  };

  const yaCount = detailData?.trueCount || 0;
  const tidakCount = detailData?.falseCount || 0;
  const isUnstable = detailData?.isMentalUnstable === true;

  const columns = getMedisResultColumns();

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col justify-center items-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-500">Memuat hasil tes warga...</p>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="h-[80vh] flex flex-col justify-center items-center">
        <Empty description="Data hasil tes tidak ditemukan" />
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Kembali
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
            onClick={() => navigate(-1)}
            className="hover:bg-gray-200 font-medium text-gray-600 pl-0 flex items-center"
          >
            <ArrowLeft size={18} />
            Kembali ke Daftar Warga
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 space-y-8">
        <Card
          className="shadow-sm border-gray-200 rounded-2xl overflow-hidden !p-0"
          bodyStyle={{padding: 0}}
        >
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center max-lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag
                  color={isUnstable ? 'error' : 'success'}
                  className="px-3 py-1 text-sm rounded-full"
                >
                  Hasil Analisa Kesehatan Mental
                </Tag>
              </div>

              <div className="mb-2">
                <Text className="text-gray-500 text-lg">
                  Kondisi Warga:{' '}
                  <span className="font-semibold text-gray-800">
                    {userName}
                  </span>
                </Text>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <StatusIcon
                  className={`w-10 h-10 max-lg:hidden ${statusColor}`}
                />
                <Title
                  level={1}
                  className={`!m-0 !font-extrabold tracking-tight ${statusColor}`}
                >
                  {isUnstable ? 'BERISIKO' : 'STABIL'}
                </Title>
              </div>

              <div className={`p-6 rounded-xl border ${statusBg} mb-6`}>
                <h4
                  className={`font-semibold text-lg mb-2 ${
                    isUnstable ? 'text-red-700' : 'text-green-700'
                  }`}
                >
                  {isUnstable ? 'Perlu Perhatian Khusus' : 'Kondisi Stabil'}
                </h4>
                <Paragraph className="!mb-0 text-gray-700 leading-relaxed">
                  {isUnstable
                    ? `Hasil tes ini menunjukkan adanya indikasi gangguan kesehatan mental. Disarankan untuk melakukan tindak lanjut atau konsultasi dengan tenaga profesional.`
                    : `Hasil tes ini menunjukkan kondisi kesehatan mental yang cukup baik dan stabil. Tidak ditemukan indikasi gangguan yang signifikan.`}
                </Paragraph>
              </div>
            </div>

            <div className="lg:w-[450px] bg-gray-50 border-l border-gray-100 p-8 flex flex-col items-center justify-center relative max-lg:p-6 max-lg:border-t">
              <div className="w-full flex gap-x-2 items-center">
                <FileText size={16} />
                <Text strong className="text-gray-500 flex items-center gap-2">
                  Statistik Jawaban
                </Text>
              </div>
              <div className="w-full mt-4 flex justify-center">
                <ResultPieChart yaCount={yaCount} tidakCount={tidakCount} />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3 mt-10 mb-4">
          <div className="h-8 w-1 bg-gray-800 rounded-full"></div>
          <Title level={3} className="!m-0 text-gray-800">
            Rincian Jawaban
          </Title>
        </div>

        <Card
          className="shadow-sm border-gray-200 rounded-xl overflow-hidden mb-10 !p-0"
          styles={{body: {padding: 0}}}
        >
          <div className="bg-white">
            <Table
              columns={columns}
              dataSource={mappedQuestions}
              rowKey="no"
              pagination={false}
              scroll={{x: 600}}
              rowClassName="hover:bg-gray-50 transition-colors"
              size="middle"
            />
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center max-lg:flex-col max-lg:gap-y-4">
            <Text type="secondary" className="text-sm">
              Total {mappedQuestions.length} pertanyaan terjawab
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
