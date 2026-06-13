import { Tag } from "antd";
import type { QuestionnaireScoringResult } from "../types/Questionnaire/questionnaireTypes";
import { getQuestionnaireResultLabel } from "../utils/questionnaireDisplay";

interface QuestionnaireScoreSummaryProps {
    result: QuestionnaireScoringResult;
}

export default function QuestionnaireScoreSummary({ result }: QuestionnaireScoreSummaryProps) {
    return (
        <div className="w-full space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <p className="text-sm text-gray-500">Skor Akhir</p>
                    <p className="text-4xl font-bold text-gray-800">{result.score}</p>
                </div>
                <Tag color={result.isRisk ? "error" : "success"} className="!m-0">
                    {getQuestionnaireResultLabel(result.resultLabel)}
                </Tag>
            </div>

            {result.categories.length > 0 && (
                <div className="space-y-2">
                    {result.categories.map((category) => (
                        <div
                            key={category.key}
                            className="flex items-center justify-between gap-3 border-b border-gray-100 py-2 last:border-b-0"
                        >
                            <div className="min-w-0">
                                <p className="font-medium text-gray-700 truncate">{category.label}</p>
                                <p className="text-xs text-gray-400">
                                    {category.includeInTotal ? "Dihitung ke Skor Akhir" : "Tidak Dihitung ke Skor Akhir"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="font-semibold text-gray-800">{category.score}</span>
                                {category.outcome && (
                                    <Tag color={category.outcome.isRisk ? "error" : "success"} className="!m-0">
                                        {getQuestionnaireResultLabel(category.outcome.label)}
                                    </Tag>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
