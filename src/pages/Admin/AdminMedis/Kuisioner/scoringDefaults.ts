import type { QuestionnaireScoringConfig, ScoringResultRange } from "../../../../types/Questionnaire/questionnaireTypes";

export const createScoringKey = (prefix: string) =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const createDefaultResultRange = (): ScoringResultRange => ({
    key: createScoringKey("result"),
    label: "",
    minScore: 0,
    maxScore: 0,
    isRisk: false,
    recommendation: "",
});

export const createDefaultWeightedScoringConfig = (): QuestionnaireScoringConfig => ({
    answerOptions: [
        { value: createScoringKey("option"), label: "Tidak Benar", score: 0 },
        { value: createScoringKey("option"), label: "Agak Benar", score: 1 },
        { value: createScoringKey("option"), label: "Benar", score: 2 },
    ],
    categories: [],
    total: {
        label: "Total Skor",
        ranges: [
            {
                key: createScoringKey("result"),
                label: "Dalam Batas Wajar",
                minScore: 0,
                maxScore: 0,
                isRisk: false,
                recommendation: "",
            },
        ],
    },
});
