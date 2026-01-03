import { api } from "../api";
import type { Questionnaire, QuestionnaireHistoryParams, QuestionnaireHistoryResponse } from "../../types/Questionnaire/questionnaireTypes";
import type { ResponseData } from "../../types/commons";

export type HistoryApiResponse = ResponseData<QuestionnaireHistoryResponse[]>;
export type QuestionnaireMeResponse = ResponseData<Questionnaire[]>;

export const questionnaireService = {
    getHistory: async (params: QuestionnaireHistoryParams) => {
        const response = await api.get<HistoryApiResponse>("/v1/questionnaire-submission/history-me", { params });
        return response.data;
    },

    getQuestionnairesMe: async () => {
        const response = await api.get<QuestionnaireMeResponse>("/v1/questionnaire/me");
        return response.data;
    }
}