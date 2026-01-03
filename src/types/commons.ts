export interface PaginationMeta {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number
}

export interface Metadata {
    pagination: PaginationMeta
    userCount?: number
}

export interface ResponseData<T> {
    statusCode: number;
    message: string;
    data?: T
    meta?: Metadata
}