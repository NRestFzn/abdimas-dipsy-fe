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
}

export interface GetQuestionnaireParams {
    title?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    order?: string;   
}