export interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

export interface Questionnaire {
	id: string;
	createdAt: string;
	updatedAt: string;
	title: string;
	description: string;
	status: "publish" | "draft" | "archived";
	riskThreshold: number
}

export interface RtResponse {
	statusCode: number;
	message: string;
	data: RukunWarga;
	metadata: Metadata;
	userCount: number
}

export interface RukunWarga {
	id: string;
	name: number;
	rtCount: number;
	userCount: number;
	createdAt: string;
	updatedAt: string;
	rukunTetangga: RukunTetangga[];
}

export interface RukunTetangga {
	totalWarga: number;
	id: string;
	name: number;
	createdAt: string;
	userCount: number;
	updatedAt: string;
	RukunWargaId: string;
}

export interface Metadata {
	rtCount: number;
	userCount: number;
}

export interface WargaResponse {
	statusCode: number;
	message: string;
	data: WargaData;
	metadata: WargaMetadata;
}

export interface WargaData {
	id: string;
	name: number;
	createdAt: string;
	updatedAt: string;
	RukunWargaId: string;
	userDetails: UserDetail[];
}

export interface UserDetail {
	id: string;
	nik: string;
	profession: string;
	createdAt: string;
	updatedAt: string;
	UserId: string;
	RukunTetanggaId: string;
	RukunWargaId: string;
	EducationId: string;
	MarriageStatusId: string;
	SalaryRangeId: string;
	user: User;
}

export interface User {
	id: string;
	fullname: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	phoneNumber?: string;
	role?: string;
}

export interface WargaMetadata {
	userCount: number;
}

export interface QuestionnaireByIdResponse {
	statusCode: number;
	message: string;
	data: {
		id: string;
		title: string;
		description: string;
		status: "publish" | "draft";
		createdAt: string;
		updatedAt: string;
	};
}

export interface SummarizeAllResponse {
	statusCode: number;
	message: string;
	data: {
		summarize: {
			userCount: number;
			submitCount: number;
			stableMentalCount: number;
			unStableMentalCount: number;
			unStableMentalPercentage: number;
		};
		perRw: Array<{
			rwId: string;
			rwName: number;
			rtCount: number;
			userCount: number;
			submitCount: number;
			stableMentalCount: number;
			unStableMentalCount: number;
			unStableMentalPercentage: number;
		}>;
	};
}

export interface GetPublicQuestionnaireParams {
	page: number;
	pageSize: number;
	title?: string;
	description?: string;
	status?: string;
	order?: string;
}

export interface QueryParams {
	RukunWargaId?: string;
	RukunTetanggaId?: string;
	startDate?: string;
	endDate?: string;
}

export interface RTData {
	rtId: string;
	rtName: number;
	userCount: number;
	submitCount: number;
	stableMentalCount: number;
	unStableMentalCount: number;
	unStableMentalPercentage: number;
}

export interface RWSummary {
	summarize: {
		userCount: number;
		submitCount: number;
		stableMentalCount: number;
		unStableMentalCount: number;
		unStableMentalPercentage: number;
	};
	perRt: RTData[];
}

export interface RTSummary {
	summarize: {
		userCount: number;
		submitCount: number;
		stableMentalCount: number;
		unStableMentalCount: number;
		unStableMentalPercentage: number;
	};
	users: Array<{
		UserId: string;
		fullname: string;
		nik?: string;
		lastSubmissionDate: string;
	}>;
}

export interface GetParams {
	name?: string
	page?: number
	pageSize?: number
	order: string
}

export interface Education {
    id: string;
    name: string;
}

export interface MarriageStatus {
    id: string;
    name: string;
}

export interface SalaryRange {
    id: string;
    minRange: string;
    maxRange: string;
}

export interface CreateResidentPayload {
    fullname: string;
    email: string;
    gender: "m" | "f";
    profession: string;
    birthDate: string;
    MarriageStatusId: string;
    RukunWargaId: string;
    RukunTetanggaId: string;
    EducationId: string;
    SalaryRangeId: string;
    nik: string;
}

export interface CreateRWPayload {
    count: number;
}

export interface CreateRTPayload {
    count: number;
    RukunWargaId: string;
}

export interface MasterDataResponse<T> {
    statusCode: number;
    message: string;
    data: T[];
}

export interface AdminProfile {
	id: string;
	fullname: string;
	email: string;
	gender: "m" | "f";
	birthDate: string;
	profilePicture: string;
	role: {
		id: string;
		name: string;
	};
	createdAt: string;
}

export interface UpdateAdminProfilePayload {
	fullname: string;
	gender: "m" | "f";
	birthDate: string;
	newPassword?: string;
	confirmNewPassword?: string;
}

export interface UpdateResidentPayload {
    fullname: string;
    email: string;
    gender: "m" | "f";
    birthDate: string;
    nik: string;
    profession: string;
    MarriageStatusId: string;
    RukunWargaId: string;
    RukunTetanggaId: string;
    EducationId: string;
    SalaryRangeId: string;
    password?: string;
    confirmPassword?: string;
}