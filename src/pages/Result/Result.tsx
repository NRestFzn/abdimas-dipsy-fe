import {useNavigate, useParams} from 'react-router';
import {useEffect, useState} from 'react';
import {questionnaireService} from '../../service/questionnaireService';
import {ArrowLeft, FileHeart} from 'lucide-react';
import {Button, Card, Empty, Spin, Table} from 'antd';
import {getUserResultColumns} from './columns/ResultColumn';

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
  const {id} = useParams<{id: string}>();

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
              (item: {answerValue: string; questionnaireQuestion: any}) => ({
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
          setLoading(false); // Jika error, matikan loading
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

  const PieChart = ({
    yaCount,
    tidakCount,
  }: {
    yaCount: number;
    tidakCount: number;
  }) => {
    const total = yaCount + tidakCount;
    const yaPercentage = total > 0 ? (yaCount / total) * 100 : 0;
    const tidakPercentage = total > 0 ? (tidakCount / total) * 100 : 0;

    const radius = 140;
    const centerX = 150;
    const centerY = 150;

    const getCoordinatesForPercent = (percent: number) => {
      const x = Math.cos(2 * Math.PI * percent);
      const y = Math.sin(2 * Math.PI * percent);
      return [x, y];
    };

    const [yaStartX, yaStartY] = getCoordinatesForPercent(0);
    const [yaEndX, yaEndY] = getCoordinatesForPercent(yaPercentage / 100);
    const yaLargeArcFlag = yaPercentage > 50 ? 1 : 0;
    const yaPathData = [
      `M ${centerX} ${centerY}`,
      `L ${centerX + yaStartX * radius} ${centerY + yaStartY * radius}`,
      `A ${radius} ${radius} 0 ${yaLargeArcFlag} 1 ${
        centerX + yaEndX * radius
      } ${centerY + yaEndY * radius}`,
      'Z',
    ].join(' ');

    const [tidakStartX, tidakStartY] = getCoordinatesForPercent(
      yaPercentage / 100
    );
    const [tidakEndX, tidakEndY] = getCoordinatesForPercent(1);
    const tidakLargeArcFlag = tidakPercentage > 50 ? 1 : 0;
    const tidakPathData = [
      `M ${centerX} ${centerY}`,
      `L ${centerX + tidakStartX * radius} ${centerY + tidakStartY * radius}`,
      `A ${radius} ${radius} 0 ${tidakLargeArcFlag} 1 ${
        centerX + tidakEndX * radius
      } ${centerY + tidakEndY * radius}`,
      'Z',
    ].join(' ');

    const yaLabelAngle =
      (((yaPercentage / 100) * 360) / 2) * (Math.PI / 180) - Math.PI / 2;
    const tidakLabelAngle =
      ((yaPercentage / 100) * 360 + ((tidakPercentage / 100) * 360) / 2) *
        (Math.PI / 180) -
      Math.PI / 2;

    const labelOffset = radius + 20;

    const yaLabelX = centerX + Math.cos(yaLabelAngle) * labelOffset;
    const yaLabelY = centerY + Math.sin(yaLabelAngle) * labelOffset;
    const tidakLabelX = centerX + Math.cos(tidakLabelAngle) * labelOffset;
    const tidakLabelY = centerY + Math.sin(tidakLabelAngle) * labelOffset;

    const getLabelStyles = (x: number, y: number) => {
      const isVertical = Math.abs(x - centerX) < 20;
      const isTop = y < centerY;
      const isLeft = x < centerX;

      let containerStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 20,
      };

      let arrowStyle: React.CSSProperties = {
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: '#1f2937',
        transform: 'rotate(45deg)',
      };

      if (isVertical) {
        containerStyle.transform = 'translate(-50%, 0)';
        if (isTop) {
          containerStyle.transform = 'translate(-50%, -100%)';
          containerStyle.marginTop = '-10px';
          arrowStyle.bottom = '-4px';
          arrowStyle.left = '50%';
          arrowStyle.marginLeft = '-4px';
        } else {
          containerStyle.marginTop = '10px';
          arrowStyle.top = '-4px';
          arrowStyle.left = '50%';
          arrowStyle.marginLeft = '-4px';
        }
      } else {
        containerStyle.top = `${y - 20}px`;
        if (isLeft) {
          containerStyle.transform = 'translate(-100%, 0)';
          containerStyle.marginLeft = '-10px';
          arrowStyle.right = '-4px';
          arrowStyle.top = '50%';
          arrowStyle.marginTop = '-4px';
        } else {
          containerStyle.marginLeft = '10px';
          arrowStyle.left = '-4px';
          arrowStyle.top = '50%';
          arrowStyle.marginTop = '-4px';
        }
      }

      return {containerStyle, arrowStyle};
    };

    const yaStyles = getLabelStyles(yaLabelX, yaLabelY);
    const tidakStyles = getLabelStyles(tidakLabelX, tidakLabelY);

    return (
      <div className="relative w-[300px] h-[300px] z-10">
        <svg width="300" height="300" className="transform -rotate-90">
          {yaPercentage === 100 ? (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="#70B748"
              stroke="white"
              strokeWidth="2"
            />
          ) : (
            yaCount > 0 && (
              <path
                d={yaPathData}
                fill="#70B748"
                stroke="white"
                strokeWidth="2"
              />
            )
          )}

          {tidakPercentage === 100 ? (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="#439017"
              stroke="white"
              strokeWidth="2"
            />
          ) : (
            tidakCount > 0 && (
              <path
                d={tidakPathData}
                fill="#439017"
                stroke="white"
                strokeWidth="2"
              />
            )
          )}

          <circle cx={centerX} cy={centerY} r="8" fill="white" />
        </svg>

        {yaCount > 0 && (
          <div
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-md"
            style={yaStyles.containerStyle}
          >
            <div className="text-center">
              <div>Ya</div>
              <div className="text-lg">{yaCount}</div>
            </div>
            <div style={yaStyles.arrowStyle} />
          </div>
        )}
        {tidakCount > 0 && (
          <div
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-md"
            style={tidakStyles.containerStyle}
          >
            <div className="text-center">
              <div>Tidak</div>
              <div className="text-lg">{tidakCount}</div>
            </div>
            <div style={tidakStyles.arrowStyle} />
          </div>
        )}
      </div>
    );
  };

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

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20 overflow-hidden px-5">
      <img
        className="absolute z-5 -bottom-10 sm:-bottom-20 -right-20 w-[250px] lg:w-[500px] opacity-40 pointer-events-none"
        src={`${isUnstable ? '/berat.png' : '/ringan.png'}`}
        alt=""
      />
      <img
        className="absolute z-5 -bottom-5 sm:-bottom-10 -left-10 w-[150px] lg:w-[300px] scale-x-[-1] opacity-40 pointer-events-none"
        src={`${isUnstable ? '/berat.png' : '/ringan.png'}`}
        alt=""
      />

      <div className="pt-6 px-6 sm:px-10 lg:px-0 max-w-6xl mx-auto z-50 relative">
        <Button
          onClick={() => navigate('/')}
          icon={<ArrowLeft size={18} />}
          className="bg-white !hover:text-green-500 border border-gray-200 shadow-sm"
          shape="round"
          size="large"
        >
          Kembali ke Beranda
        </Button>
      </div>

      <section className="relative z-10 flex flex-col lg:grid grid-cols-12 items-center px-5 sm:px-10 lg:px-0 py-10 gap-10 lg:gap-0 max-w-6xl mx-auto">
        <div className="w-full flex flex-col items-start col-start-1 col-end-13 lg:col-start-1 lg:col-end-6 space-y-4">
          <div className="flex items-center text-zinc-800 gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileHeart className="w-6 h-6 text-[#70B748]" />
            </div>
            <p className="text-lg sm:text-2xl font-bold">Hasil Tes Kamu</p>
          </div>

          <h1
            className={`text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight ${
              isUnstable ? 'text-red-500' : 'text-[#70B748]'
            }`}
          >
            {isUnstable ? 'BERESIKO' : 'STABIL'}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
            {isUnstable
              ? 'Hasil tes menunjukkan adanya beberapa hal yang perlu kamu perhatikan lebih lanjut. Tidak ada salahnya untuk mencoba lebih peduli pada kondisi diri sendiri dan luangkan waktu untuk beristirahat sejenak.'
              : 'Hasil tes menunjukkan kondisi kamu saat ini cukup baik. Tetap jaga pola hidup yang sehat dan luangkan waktu untuk berkumpul bersama keluarga agar pikiran tetap tenang.'}
          </p>
        </div>

        <div className="w-full col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 flex justify-center items-center pb-10 lg:pb-0">
          <PieChart yaCount={yaCount} tidakCount={tidakCount} />
        </div>
      </section>

      <section className="px-4 sm:px-8 relative z-4">
        <div className="max-w-6xl mx-auto">
          <Card
            className="shadow-lg border-gray-100 rounded-xl overflow-hidden"
            bodyStyle={{padding: 0}}
          >
            <div className="!bg-[#70B748] px-6 py-4 flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold m-0">
                Detail Jawaban Kuisioner
              </h2>
            </div>

            <Table
              columns={columns}
              dataSource={tableDataSource}
              rowKey="no"
              pagination={false}
              scroll={{x: 600}}
              rowClassName={() => 'hover:bg-gray-50'}
            />

            <div className="p-6 bg-white border-t border-gray-100 flex justify-end">
              <Button
                type="primary"
                className="!bg-[#439017] !hover:bg-green-600 h-10 px-6"
                onClick={() => navigate(`/quiz/${questionnaireId}`)}
              >
                Ulangi Kuesioner
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
