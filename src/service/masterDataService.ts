import type { Education, GetParams, MarriageStatus, MasterDataResponse } from "../types/adminDesaService";
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

export const masterDataService = {
	getEducations: async (): Promise<MasterData[]> => {
		const response = await api.get("/v1/education");
		return response.data.data;
	},

	getMarriageStatuses: async (): Promise<MasterData[]> => {
		const response = await api.get("/v1/marriage-status");
		return response.data.data;
	},

	getRukunWarga: async (): Promise<MasterData[]> => {
		const response = await api.get("/v1/rukun-warga");
		return response.data.data;
	},

	getRukunTetangga: async (): Promise<RukunTetangga[]> => {
		const response = await api.get("/v1/rukun-tetangga");
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
