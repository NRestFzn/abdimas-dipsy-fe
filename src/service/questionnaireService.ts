import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE;

export interface Questionnaire {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  status: 'draft' | 'publish';
  riskThreshold?: number;
  availableAt: string;
  isAvailable: boolean;
}

export interface DataResponse<T> {
  data: T;
  metadata: {
    totalData: number;
    paginatedDataCount: number;
  };
}

export interface QuestionnaireUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  status: string;
}

export interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options?: string[];
  status: string;
  order: number;
  QuestionnaireId: string;
}

export interface QuestionnaireDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  questions: Question[];
}

export interface AnswerSubmission {
  QuestionId: string;
  answerValue: string;
}

export interface SubmitAnswersRequest {
  answers: AnswerSubmission[];
}

export interface SubmissionResponseData {
  id: string;
  questionnaireId: string;
  userId: string;
  score?: number;
  result?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface SubmissionSummary {
  id: string;
  questionnaireId: string;
  userId: string;
  score?: number;
  result?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SummarizeMeResponse {
  statusCode: number;
  message: string;
  data: {
    submissions: SubmissionSummary[];
    total: number;
    averageScore?: number;
  };
}

export interface HistoryMeResponse {
  statusCode: number;
  message: string;
  data: {
    submissions: SubmissionSummary[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const validateQuestionnaireData = (data: any): QuestionnaireDetail => {
  const questions = Array.isArray(data.questions)
    ? data.questions.map((q: any) => {
        let options: string[] = ['Ya', 'Tidak'];

        if (q.options) {
          try {
            if (typeof q.options === 'string') {
              options = JSON.parse(q.options);
            } else if (Array.isArray(q.options)) {
              options = q.options;
            }
          } catch (e) {
            options = ['Ya', 'Tidak'];
          }
        }

        return {
          id: q.id || `temp-${Math.random()}`,
          questionText:
            q.questionText || q.question || 'Pertanyaan tidak tersedia',
          questionType: q.questionType || q.type || 'radio',
          status: q.status || 'publish',
          order: q.order || 0,
          QuestionnaireId: q.QuestionnaireId || '',
          options: options,
        };
      })
    : [];

  return {
    id: data.id || '',
    title: data.title || 'No Title',
    description: data.description || 'No Description',
    status: data.status || 'draft',
    questions: questions.sort((a: any, b: any) => a.order - b.order),
  };
};

export const questionnaireService = {
  async getAllQuestionnaires(): Promise<Questionnaire[]> {
    const response = await api.get<ApiResponse<Questionnaire[]>>(
      '/v1/questionnaire/me',
    );
    return response.data.data;
  },

  async getQuestionnaireById(id: string): Promise<QuestionnaireDetail> {
    const response = await api.get<ApiResponse<QuestionnaireDetail>>(
      `/v1/questionnaire/${id}`,
    );

    const data = response.data.data;

    if (data.questions && Array.isArray(data.questions)) {
      data.questions = [...data.questions].sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
    }

    return data;
  },

  async getPublicQuestionnaireById(id: string): Promise<QuestionnaireDetail> {
    const response = await api.get<ApiResponse<QuestionnaireDetail>>(
      `/v1/questionnaire/${id}/public`,
    );

    const data = response.data.data;

    if (data.questions && Array.isArray(data.questions)) {
      data.questions = [...data.questions].sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
    }

    return data;
  },

  submitAnswers: async (
    questionnaireId: string,
    answers: Record<string, string>,
    residentId?: string,
    activeRoleId?: string,
  ): Promise<ApiResponse<SubmissionResponseData>> => {
    const formattedAnswers: AnswerSubmission[] = Object.entries(answers).map(
      ([questionId, answerValue]) => {
        let convertedValue = answerValue;
        if (answerValue === 'Ya') {
          convertedValue = 'true';
        } else if (answerValue === 'Tidak') {
          convertedValue = 'false';
        }

        return {
          QuestionId: questionId,
          answerValue: convertedValue,
        };
      },
    );

    const requestData: SubmitAnswersRequest = {
      answers: formattedAnswers,
      ...(residentId && {UserId: residentId}),
    };

    const config: any = {};

    if (residentId && activeRoleId) {
      config.headers = {
        'x-active-role': activeRoleId,
      };
    }

    const response = await api.post<ApiResponse<SubmissionResponseData>>(
      `/v1/questionnaire-submission/${questionnaireId}/submit`,
      requestData,
      config,
    );

    return response.data;
  },

  async getDetailAnswer(questionnaireId: string) {
    const response = await api.get(
      `/v1/questionnaire-submission/${questionnaireId}/detail`,
    );

    return response.data;
  },

  async summarizeMe(
    questionnaireId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const params: any = {};

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    const response = await api.get(
      `/v1/questionnaire-submission/summary-me/${questionnaireId}`,
      {params},
    );

    return response.data;
  },

  async getHistory(
    page: number = 1,
    pageSize: number = 10,
    questionnaireId?: string,
  ): Promise<HistoryMeResponse> {
    const params: any = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (questionnaireId && questionnaireId !== 'all') {
      params.QuestionnaireId = questionnaireId;
    }

    const response = await api.get<HistoryMeResponse>(
      `/v1/questionnaire-submission/history-me`,
      {params},
    );
    return response.data;
  },
};
