export interface RukunWarga {
    id: string;
    name: number;
    createdAt: string;
    updatedAt: string;
}

export interface RukunTetangga {
    id: string;
    name: number;
    RukunWargaId: string;
    createdAt: string;
    updatedAt: string;
}

export interface MarriageStatus {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Education {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface SalaryRange {
    id: string;
    createdAt: string;
    updatedAt: string;
    minRange: string;
    maxRange: string;
}

export interface RukunWargaWithCount extends RukunWarga {
    rtCount: number;
    userCount: number;
}

export interface GetRWParams {
    page?: number;
    pageSize?: number;
    name?: string;
    order?: string;
}

export interface RukunTetanggaWithCount extends RukunTetangga {
    userCount: number;
}

export interface GetRTParams {
    page?: number;
    pageSize?: number;
    name?: string;
    order?: string;
    RukunWargaId?: string;
}