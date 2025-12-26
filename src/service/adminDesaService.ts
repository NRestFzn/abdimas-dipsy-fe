import axios from "axios";
import type {
	AdminProfile,
	ApiResponse,
	CreateResidentPayload,
	GetParams,
	GetPublicQuestionnaireParams,
	QueryParams,
	Questionnaire,
	QuestionnaireByIdResponse,
	RtResponse,
	RTSummary,
	RWSummary,
	SummarizeAllResponse,
	UpdateAdminProfilePayload,
	UpdateResidentPayload,
	WargaResponse,
} from "../types/adminDesaService";
import type { GetAllRWResponse } from "../types/adminMedisService";

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

export const adminDesaService = {
	getMe: async () => {
		const response = await api.get<ApiResponse<AdminProfile>>("/v1/user/me");
		return response.data;
	},

	updateProfile: async (payload: UpdateAdminProfilePayload) => {
		const response = await api.put("/v1/user/me", payload);
		return response.data;
	},

	async getAllQuestionnaires(params?: GetPublicQuestionnaireParams): Promise<Questionnaire[]> {
		const response = await api.get<ApiResponse<Questionnaire[]>>(
			"/v1/questionnaire/public",
			{ params }
		);
		return response.data.data;
	},

	async addRW(data: number) {
		const response = await api.post("/v1/rukun-warga", {
			count: data,
		});

		return response;
	},

	async addRT(data: number, rwId: string) {
		const response = await api.post("/v1/rukun-tetangga", {
			count: data,
			RukunWargaId: rwId,
		});

		return response;
	},

	async deleteRW(rwId: string) {
		const response = await api.delete(`/v1/rukun-warga/${rwId}`);

		return response;
	},

	async deleteRT(rtId: string) {
		const response = await api.delete(`/v1/rukun-tetangga/${rtId}`);

		return response;
	},

	async getRT(params?: GetParams, rwId?: string) {
		const response = await api.get<RtResponse>(`/v1/rukun-warga/${rwId}`, { params });

		return response.data;
	},

	async getWarga(rtId: string) {
		const response = await api.get<WargaResponse>(`/v1/rukun-tetangga/${rtId}`);

		return response.data;
	},

	async summarizeAll(
		questionnaireId: string,
		startDate?: string,
		endDate?: string): Promise<SummarizeAllResponse> {
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

	async getQuestionnaireById(
		questionnaireId: string
	): Promise<QuestionnaireByIdResponse> {
		const response = await api.get<QuestionnaireByIdResponse>(
			`/v1/questionnaire/${questionnaireId}/public`
		);
		return response.data;
	},

	async getMedisQuestionnaireById(
		questionnaireId: string
	): Promise<QuestionnaireByIdResponse> {
		const response = await api.get<QuestionnaireByIdResponse>(
			`/v1/questionnaire/${questionnaireId}`
		);
		return response.data;
	},

	async getWargaByRt(rtId: string) {
		const response = await api.get(`/v1/rukun-tetangga/${rtId}`);

		return response.data;
	},

	async getAllRW(params?: GetParams): Promise<GetAllRWResponse> {
		const response = await api.get<GetAllRWResponse>("/v1/rukun-warga", { params });
		return response.data;
	},

	async createRW(count: number) {
		return await api.post("/v1/rukun-warga", { count });
	},

	async createRT(count: number, rwId: string) {
		return await api.post("/v1/rukun-tetangga", { count, RukunWargaId: rwId });
	},

	async createResident(payload: CreateResidentPayload) {
		return await api.post("/v1/resident", payload);
	},

	async getAllResidents(params?: any) {
		const response = await api.get("/v1/resident", { params });
		return response.data;
	},

	async getResidentDetail(id: string) {
		const response = await api.get(`/v1/resident/${id}`);
		return response.data;
	},

	async updateResident(id: string, payload: UpdateResidentPayload) {
		const response = await api.put(`/v1/resident/${id}`, payload);
		return response.data;
	},

	async deleteResident(id: string) {
		const response = await api.delete(`/v1/resident/${id}`);
		return response.data;
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
