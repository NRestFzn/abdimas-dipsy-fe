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