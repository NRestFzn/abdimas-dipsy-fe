import type { Education, GetParams, MarriageStatus, MasterDataResponse } from "../types/adminDesaService";
import type { ResponseData } from "../types/commons";
import type { GetRTParams, GetRWParams, RukunTetanggaWithCount, RukunWargaWithCount } from "../types/masterDataTypes";
import { api } from "./api";

export interface MasterData {
	id: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface SalaryRange extends MasterData {
	minRange: string;
	maxRange: string;
}

export interface RukunTetangga extends MasterData {
	RukunWargaId: string;
}

export type RukunWargaResponse = ResponseData<RukunWargaWithCount[]>;
export type RukunTetanggaResponse = ResponseData<RukunTetanggaWithCount[]>;

export const masterDataService = {
	getRukunWarga: async (params?: GetRWParams) => {
		const response = await api.get<RukunWargaResponse>("/v1/rukun-warga", { params });
		return response.data;
	},

	createRukunWarga: async (count: number) => {
		const response = await api.post("/v1/rukun-warga", { count });
		return response.data;
	},

	deleteRukunWarga: async (id: string) => {
		const response = await api.delete(`/v1/rukun-warga/${id}`);
		return response.data;
	},

	getRukunTetangga: async (params?: GetRTParams) => {
		const response = await api.get<RukunTetanggaResponse>("/v1/rukun-tetangga", { params });
		return response.data;
	},

	createRukunTetangga: async (count: number, rwId: string) => {
		const response = await api.post("/v1/rukun-tetangga", { count, RukunWargaId: rwId });
		return response.data;
	},

	deleteRukunTetangga: async (id: string) => {
		const response = await api.delete(`/v1/rukun-tetangga/${id}`);
		return response.data;
	},

	getEducations: async (): Promise<MasterData[]> => {
		const response = await api.get("/v1/education");
		return response.data.data;
	},

	getMarriageStatuses: async (): Promise<MasterData[]> => {
		const response = await api.get("/v1/marriage-status");
		return response.data.data;
	},

	getSalaryRanges: async (params: GetParams): Promise<SalaryRange[]> => {
		const response = await api.get("/v1/salary-range", { params });
		return response.data.data;
	},

	async getEducationList() {
		const response = await api.get<MasterDataResponse<Education>>("/v1/education");
		return response.data.data;
	},
	async getMarriageStatusList() {
		const response = await api.get<MasterDataResponse<MarriageStatus>>("/v1/marriage-status");
		return response.data.data;
	},
	async getSalaryRangeList() {
		const response = await api.get<MasterDataResponse<SalaryRange>>("/v1/salary-range");
		return response.data.data;
	},

};
