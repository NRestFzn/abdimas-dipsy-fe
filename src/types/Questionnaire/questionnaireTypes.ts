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
    category?: { id: string; name: string };

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