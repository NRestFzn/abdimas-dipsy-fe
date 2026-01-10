export interface SubmitParams {
    id: string;
    answers: Record<string, string>;
    residentId?: string;
    activeRoleId?: string;
};

export interface AnswerSubmission {
    QuestionId: string;
    answerValue: string;
}

export interface SubmitAnswersRequest {
    UserId?: string;
    answers: AnswerSubmission[];
}

export interface SummaryRwParams {
    questionnaireId: string;
    RukunWargaId: string;
    startDate?: string;
    endDate?: string;
}

export interface SummaryStats {
    userCount: number;
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
}

export interface PerRtData {
    rtId: string;
    rtName: number | string;
    userCount: number;
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
}

export interface RWSummaryData {
    summarize: SummaryStats;
    perRt: PerRtData[];
}

export interface SummaryRtParams {
    questionnaireId: string;
    rwId: string;
    rtId: string;
    startDate?: string;
    endDate?: string;
}

export interface RtUserItem {
    UserId: string;
    fullname: string;
    lastSubmissionDate: string;
    isMentalUnStable: boolean;
}

export interface RtSummaryData {
    summarize: SummaryStats;
    users: RtUserItem[];
}