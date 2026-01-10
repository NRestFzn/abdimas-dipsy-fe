import { api } from "../api";
import type {
  GetPublicQuestionnaireParams,
  GetQuestionnaireParams,
  Questionnaire,
  QuestionnaireDetail,
  QuestionnaireHistoryParams,
  QuestionnaireHistoryResponse,
  QuestionnairePayload,
} from "../../types/Questionnaire/questionnaireTypes";
import type { ResponseData } from "../../types/commons";
import type { AnswerSubmission, SubmitAnswersRequest } from "../../types/Questionnaire/submissionTypes";

export type HistoryApiResponse = ResponseData<QuestionnaireHistoryResponse[]>;
export type QuestionnaireMeResponse = ResponseData<Questionnaire[]>;
export type SingleQuestionnaireResponse = ResponseData<Questionnaire>;

export type SubmissionResponse = ResponseData<any>;
export type SingleQuestionnaireDetailResponse = ResponseData<QuestionnaireDetail>;

const sortQuestions = (data: QuestionnaireDetail) => {
  if (data.questions && Array.isArray(data.questions)) {
    data.questions = [...data.questions].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
  }
  return data;
};

export const questionnaireService = {
  getHistory: async (params: QuestionnaireHistoryParams) => {
    const response = await api.get<HistoryApiResponse>(
      "/v1/questionnaire-submission/history-me",
      { params }
    );
    return response.data;
  },

  getPublicQuestionnaireById: async (id: string) => {
    const response = await api.get<SingleQuestionnaireDetailResponse>(
      `/v1/questionnaire/${id}/public`
    );
    return sortQuestions(response.data.data!);
  },

  getQuestionnaireById: async (id: string) => {
    const response = await api.get<SingleQuestionnaireDetailResponse>(
      `/v1/questionnaire/${id}`
    );
    return sortQuestions(response.data.data!);
  },

  getDetailWithFallback: async (id: string) => {
    try {
      return await questionnaireService.getPublicQuestionnaireById(id);
    } catch (error) {
      console.log("Public API failed, retrying with protected endpoint...");
      return await questionnaireService.getQuestionnaireById(id);
    }
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

  getPublicQuestionnaires: async (params: GetPublicQuestionnaireParams) => {
    const response = await api.get<QuestionnaireMeResponse>(
      "/v1/questionnaire/public",
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

  updateQuestionnaire: async (id: string, payload: QuestionnairePayload) => {
    const response = await api.put<SingleQuestionnaireResponse>(
      `/v1/questionnaire/${id}`,
      payload
    );
    return response.data;
  },

  deleteQuestionnaire: async (id: string) => {
    const response = await api.delete(`/v1/questionnaire/${id}`);
    return response.data;
  },

  submitAnswers: async (
    questionnaireId: string,
    answers: Record<string, string>,
    residentId?: string,
    activeRoleId?: string
  ): Promise<SubmissionResponse> => {
    const formattedAnswers: AnswerSubmission[] = Object.entries(answers).map(
      ([questionId, answerValue]) => {
        let convertedValue = answerValue;
        if (answerValue === "Ya") {
          convertedValue = "true";
        } else if (answerValue === "Tidak") {
          convertedValue = "false";
        }

        return {
          QuestionId: questionId,
          answerValue: convertedValue,
        };
      }
    );

    const requestData: SubmitAnswersRequest = {
      answers: formattedAnswers,
      ...(residentId && { UserId: residentId }),
    };

    const config: any = {};
    if (residentId && activeRoleId) {
      config.headers = {
        "x-active-role": activeRoleId,
      };
    }

    const response = await api.post<SubmissionResponse>(
      `/v1/questionnaire-submission/${questionnaireId}/submit`,
      requestData,
      config
    );

    return response.data;
  },

};
