export interface QuestionnaireHistoryParams {
    UserId?: string
    QuestionnaireID?: string | undefined
    order?: string
    page?: number
    pageSize?: number
}

export interface QuestionnaireHistoryResponse {
    id: string,
    UserId: string,
    QuestionnaireId: string
    isAssisted: boolean
    submittedBy: {
        id: string,
        createdAt: string
        updatedAt: string
        fullname: string
        email: string
        profilePicture: string
    }
    user?: {
        id: string,
        fullname: string
        email: string
        profilePicture: string
    }
    questionnaire: Partial<Questionnaire>
    createdAt: string,
    updatedAt: string,
}

export interface Submission {
    id: string;
    createdAt: string;
    updatedAt: string;
    UserId: string;
    QuestionnaireId: string;
}

export interface Questionnaire {
    id: string,
    title: string,
    description: string,
    status: string,
    riskThreshold: number,
    cooldownInMinutes: number,
    CategoryId: string;
    scoringType: QuestionnaireScoringType;
    scoringConfig: QuestionnaireScoringConfig | null;
    category?: { id: string; name: string };
    questions?: Question[]

    submissions?: Submission[];
    isAvailable?: boolean;
    availableAt?: string | null;
    latestSubmission?: string | null;
    createdAt?: string,
    updatedAt?: string,
}

export interface QuestionnairePayload {
    title: string;
    description: string;
    status: "draft" | "publish";
    riskThreshold: number;
    cooldownInMinutes: number;
    CategoryId: string;
    scoringType: QuestionnaireScoringType;
    scoringConfig: QuestionnaireScoringConfig | null;
}

export interface GetQuestionnaireParams {
    title?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    order?: string;
}

export interface GetPublicQuestionnaireParams {
    title?: string;
    page?: number;
    pageSize?: number;
    order?: string;
}

export interface QuestionnaireCategory {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryPayload {
    name: string;
}

export interface GetCategoryParams {
    name?: string;
    page?: number;
    pageSize?: number;
    order?: string;
}

export interface Question {
    id: string;
    questionText: string;
    questionType: string;
    options?: string[];
    status: string;
    order: number;
    QuestionnaireId: string;
    scoringCategory?: string | null;
    scoreOverrides?: Record<string, number> | null;
}

export interface QuestionnaireDetail {
    id: string;
    title: string;
    description: string;
    status: string;
    questions: Question[];
    scoringType: QuestionnaireScoringType;
    scoringConfig: QuestionnaireScoringConfig | null;
}

export type QuestionnaireScoringType = "binary_threshold" | "weighted_score";

export interface ScoringAnswerOption {
    value: string;
    label: string;
    score: number;
}

export interface ScoringResultRange {
    key: string;
    label: string;
    minScore: number;
    maxScore: number;
    isRisk: boolean;
    recommendation?: string;
}

export interface ScoringCategory {
    key: string;
    label: string;
    includeInTotal: boolean;
    ranges: ScoringResultRange[];
}

export interface QuestionnaireScoringConfig {
    answerOptions: ScoringAnswerOption[];
    categories: ScoringCategory[];
    total: {
        label: string;
        ranges: ScoringResultRange[];
    };
}

export interface QuestionnaireScoringResult {
    scoringType: QuestionnaireScoringType;
    score: number;
    resultKey: string;
    resultLabel: string;
    isRisk: boolean;
    recommendation?: string;
    categories: Array<{
        key: string;
        label: string;
        includeInTotal: boolean;
        score: number;
        outcome: ScoringResultRange | null;
    }>;
}
