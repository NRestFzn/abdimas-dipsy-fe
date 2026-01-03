import { api } from "../api";
import type {
  GetQuestionnaireParams,
  Questionnaire,
  QuestionnaireHistoryParams,
  QuestionnaireHistoryResponse,
  QuestionnairePayload,
} from "../../types/Questionnaire/questionnaireTypes";
import type { ResponseData } from "../../types/commons";

export type HistoryApiResponse = ResponseData<QuestionnaireHistoryResponse[]>;
export type QuestionnaireMeResponse = ResponseData<Questionnaire[]>;
export type SingleQuestionnaireResponse = ResponseData<Questionnaire>;

export const questionnaireService = {
  getHistory: async (params: QuestionnaireHistoryParams) => {
    const response = await api.get<HistoryApiResponse>(
      "/v1/questionnaire-submission/history-me",
      { params }
    );
    return response.data;
  },

  getQuestionnairesMe: async () => {
    const response = await api.get<QuestionnaireMeResponse>(
      "/v1/questionnaire/me"
    );
    return response.data;
  },

  getAllQuestionnaire: async (params: GetQuestionnaireParams) => {
    const response = await api.get<QuestionnaireMeResponse>(
      "/v1/questionnaire",
      { params }
    );
    return response.data;
  },

  createQuestionnaire: async (payload: QuestionnairePayload) => {
    const response = await api.post<SingleQuestionnaireResponse>(
      "/v1/questionnaire",
      payload
    );
    return response.data;
  },

  // --- UPDATE ---
  updateQuestionnaire: async (id: string, payload: QuestionnairePayload) => {
    const response = await api.put<SingleQuestionnaireResponse>(
      `/v1/questionnaire/${id}`,
      payload
    );
    return response.data;
  },

  // --- DELETE ---
  deleteQuestionnaire: async (id: string) => {
    const response = await api.delete(`/v1/questionnaire/${id}`);
    return response.data;
  },
};
