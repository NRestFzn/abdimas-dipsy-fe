export interface Metadata {
    userCount: number
}

export interface ResponseData<T> {
    statusCode: number;
    message: string;
    data?: T
    metadata?: Metadata
}