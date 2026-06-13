import axios from "axios";
import type { ApiResponse } from "./questionnaireService";
import type {
	BulkUpdateQuestionPayload,
	CreateQuestionnairePayload,
	CreateQuestionPayload,
	GetAllRWResponse,
	GetQuestionnaireParams,
	PaginatedResponse,
	QueryParams,
	QuestionnaireQuestion,
	QuestionnaireSummary,
	RTData,
	RTDetail,
	RTSummary,
	RWSummary,
	SubmissionDetailResponse,
	SummarizeAllResponse,
	UpdateQuestionnairePayload,
	UserSummaryResponse,
	WargaHistory,
	Questionnaire,
	AdminProfile,
	UpdateAdminProfilePayload
} from "../types/adminMedisService";

const API_BASE_URL = import.meta.env.VITE_API_BASE;

const getAuthToken = (): string | null => {
	return localStorage.getItem("authToken");
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
	}
);

export const adminMedisService = {
	getMe: async () => {
		const response = await api.get<ApiResponse<AdminProfile>>("/v1/user/me");
		return response.data;
	},

	updateProfile: async (payload: UpdateAdminProfilePayload) => {
		const response = await api.put("/v1/user/me", payload);
		return response.data;
	},

	async getAllQuestionnaires(params: GetQuestionnaireParams): Promise<PaginatedResponse<Questionnaire>> {
		const response = await api.get<PaginatedResponse<Questionnaire>>(
			"/v1/questionnaire",
			{ params }
		);

		return response.data;
	},

	async getQuestionnaireStats(questionnaireId: string) {
		const response = await api.get(`/v1/questionnaire/${questionnaireId}/stats`);
		return response.data;
	},

	async getQuestionnaireSummary(
		questionnaireId: string
	): Promise<QuestionnaireSummary> {
		const response = await api.get<ApiResponse<QuestionnaireSummary>>(
			`/v1/questionnaire-submission/summary/${questionnaireId}`
		);
		return response.data.data;
	},

	async getSummaryUser(
		questionnaireId: string,
		RukunWargaId: string,
		RukunTetanggaId: string,
		userId: string,
		startDate?: string,
		endDate?: string
	): Promise<UserSummaryResponse> {
		const response = await api.get<ApiResponse<UserSummaryResponse>>(
			`/v1/questionnaire-submission/summary-user/${questionnaireId}`,
			{
				params: { UserId: userId, RukunTetanggaId: RukunTetanggaId, RukunWargaId: RukunWargaId, startDate, endDate }
			}
		);
		return response.data.data;
	},

	async getSubmissionDetail(submissionId: string): Promise<SubmissionDetailResponse> {
		const response = await api.get<ApiResponse<SubmissionDetailResponse>>(
			`/v1/questionnaire-submission/${submissionId}/detail`
		);
		return response.data.data;
	},

	async getRTDetail(
		questionnaireId: string,
		rwId: string,
		rtId: string,
		startDate?: string,
		endDate?: string
	): Promise<RTDetail> {
		const params: QueryParams = {
			RukunWargaId: rwId,
			RukunTetanggaId: rtId,
		};
		if (startDate) params.startDate = startDate;
		if (endDate) params.endDate = endDate;

		const response = await api.get<ApiResponse<RTDetail>>(
			`/v1/questionnaire-submission/detail-rt/${questionnaireId}`,
			{ params }
		);
		return response.data.data;
	},

	async getWargaHistory(
		questionnaireId: string,
		wargaId: string
	): Promise<WargaHistory[]> {
		const response = await api.get<ApiResponse<WargaHistory[]>>(
			`/v1/questionnaire-submission/history/${questionnaireId}/${wargaId}`
		);
		return response.data.data;
	},

	async getAllRW(): Promise<GetAllRWResponse> {
		const response = await api.get<GetAllRWResponse>("/v1/rukun-warga");
		return response.data;
	},

	async getRTByRW(rwId: string): Promise<RTData[]> {
		const response = await api.get<ApiResponse<RTData[]>>(
			`/v1/admin-medis/rw/${rwId}/rt`
		);
		return response.data.data;
	},

	async getQuestionnaireQuestions(
		questionnaireId: string,
		params?: any
	): Promise<QuestionnaireQuestion[]> {
		const response = await api.get<ApiResponse<QuestionnaireQuestion[]>>(
			`/v1/questionnaire-question`,
			{
				params: {
					QuestionnaireId: questionnaireId,
					...params,
				},
			}
		);

		const data = response.data.data;

		// Sorting di client side tetap oke sebagai fallback
		const sortedData = [...data].sort((a, b) => {
			const orderA = a.order ?? 999;
			const orderB = b.order ?? 999;
			return orderA - orderB;
		});

		return sortedData;
	},

	async createQuestionnaireQuestion(
		payload: CreateQuestionPayload
	): Promise<QuestionnaireQuestion> {
		const response = await api.post<ApiResponse<QuestionnaireQuestion>>(
			"/v1/questionnaire-question",
			payload
		);
		return response.data.data;
	},

	async bulkUpdateQuestions(
		payload: BulkUpdateQuestionPayload[]
	): Promise<QuestionnaireQuestion[]> {
		const response = await api.put<ApiResponse<QuestionnaireQuestion[]>>(
			"/v1/questionnaire-question/bulk-update",
			payload
		);
		return response.data.data;
	},

	async deleteQuestionnaireQuestion(questionId: string): Promise<void> {
		await api.delete(`/v1/questionnaire-question/${questionId}`);
	},

	async toggleQuestionStatus(
		questionId: string,
		status: "publish" | "draft",
		allQuestions: QuestionnaireQuestion[]
	): Promise<QuestionnaireQuestion[]> {
		const payload: BulkUpdateQuestionPayload[] = allQuestions.map((q, index) => ({
			id: q.id,
			questionText: q.questionText,
			questionType: q.questionType,
			status: (q.id === questionId ? status : q.status) as "publish" | "draft",
			order: q.order ?? index + 1,
			scoringCategory: q.scoringCategory || null,
			scoreOverrides: q.scoreOverrides || null,
		}));

		const response = await api.put<ApiResponse<QuestionnaireQuestion[]>>(
			"/v1/questionnaire-question/bulk-update",
			payload
		);

		return response.data.data;
	},

	async getQuestionnaireById(id: string): Promise<Questionnaire> {
		const response = await api.get<ApiResponse<Questionnaire>>(
			`/v1/questionnaire/${id}`
		);
		return response.data.data;
	},

	async createQuestionnaire(
		payload: CreateQuestionnairePayload
	): Promise<Questionnaire> {
		const response = await api.post<ApiResponse<Questionnaire>>(
			"/v1/questionnaire",
			payload
		);
		return response.data.data;
	},

	async updateQuestionnaire(
		id: string,
		payload: UpdateQuestionnairePayload
	): Promise<Questionnaire> {
		const response = await api.put<ApiResponse<Questionnaire>>(
			`/v1/questionnaire/${id}`,
			payload
		);
		return response.data.data;
	},

	async deleteQuestionnaire(id: string): Promise<void> {
		await api.delete(`/v1/questionnaire/${id}`);
	},

	async summarizeAll(
		questionnaireId: string,
		startDate?: string,
		endDate?: string
	): Promise<SummarizeAllResponse> {
		const params: Partial<{ startDate: string; endDate: string }> = {};

		if (startDate) params.startDate = startDate;
		if (endDate) params.endDate = endDate;

		const response = await api.get<SummarizeAllResponse>(
			`/v1/questionnaire-submission/summary/${questionnaireId}`,
			{ params }
		);

		return response.data;
	},

	async summaryRw(
		questionnaireId: string,
		rwId: string,
		startDate?: string,
		endDate?: string
	): Promise<RWSummary> {
		const params: QueryParams = { RukunWargaId: rwId };
		if (startDate) params.startDate = startDate;
		if (endDate) params.endDate = endDate;

		const response = await api.get<ApiResponse<RWSummary>>(
			`/v1/questionnaire-submission/summary-rw/${questionnaireId}`,
			{ params }
		);

		return response.data.data;
	},

	async summaryRt(
		questionnaireId: string,
		rwId: string,
		rtId: string,
		startDate?: string,
		endDate?: string
	): Promise<RTSummary> {
		const params: QueryParams = { RukunWargaId: rwId, RukunTetanggaId: rtId };
		if (startDate) params.startDate = startDate;
		if (endDate) params.endDate = endDate;

		const response = await api.get<ApiResponse<RTSummary>>(
			`/v1/questionnaire-submission/summary-rt/${questionnaireId}`,
			{ params }
		);

		return response.data.data;
	},

	async updateProfilePicture(file: File) {
		const formData = new FormData();
		formData.append("profilePicture", file);

		const response = await api.put("/v1/user/update/profile-picture", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	}
};
