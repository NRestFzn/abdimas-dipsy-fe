import type { ResponseData } from "../../types/commons";
import type { CategoryPayload, GetCategoryParams, QuestionnaireCategory } from "../../types/Questionnaire/questionnaireTypes";
import { api } from "../api"

export type CategoryResponse = ResponseData<QuestionnaireCategory[]>;
export type SingleCategoryResponse = ResponseData<QuestionnaireCategory>;

export const categoryService = {
    getAllCategories: async (params?: GetCategoryParams) => {
        const response = await api.get<CategoryResponse>("/v1/questionnaire-category", { params });
        return response.data;
    },

    getCategoryById: async (id: string) => {
        const response = await api.get<SingleCategoryResponse>(`/v1/questionnaire-category/${id}`);
        return response.data;
    },

    createCategory: async (payload: CategoryPayload) => {
        const response = await api.post<SingleCategoryResponse>("/v1/questionnaire-category", payload);
        return response.data;
    },

    updateCategory: async (id: string, payload: CategoryPayload) => {
        const response = await api.put<SingleCategoryResponse>(`/v1/questionnaire-category/${id}`, payload);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await api.delete(`/v1/questionnaire-category/${id}`);
        return response.data;
    },
};