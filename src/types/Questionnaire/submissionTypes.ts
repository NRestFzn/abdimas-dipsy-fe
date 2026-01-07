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