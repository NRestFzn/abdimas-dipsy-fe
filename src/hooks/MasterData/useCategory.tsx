import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { CategoryPayload, GetCategoryParams } from "../../types/Questionnaire/questionnaireTypes";
import { categoryService } from "../../service/MasterData/categoryService";

export const useCategory = () => {
  const queryClient = useQueryClient();

  const getCategories = (params: GetCategoryParams) => {
    return useQuery({
      queryKey: ["categories", params],
      queryFn: () => categoryService.getAllCategories(params),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 5,
    });
  };

  const getCategoryDetail = (id: string | null) => {
    return useQuery({
      queryKey: ["category", id],
      queryFn: () => categoryService.getCategoryById(id!),
      enabled: !!id,
    });
  };

  const infiniteCategories = (pageSize = 20) => {
    return useInfiniteQuery({
      queryKey: ["categories", "infinite"],
      queryFn: async ({ pageParam = 1 }) => {
        return categoryService.getAllCategories({
          page: pageParam,
          pageSize: pageSize,
          order: '[["name", "asc"]]'
        });
      },
      getNextPageParam: (lastPage: any, allPages) => {
        const dataArray = Array.isArray(lastPage) ? lastPage : lastPage?.data || [];
        if (dataArray.length < pageSize) return undefined;
        return allPages.length + 1;
      },
      initialPageParam: 1,
    });
  };

  const createCategoryMutation = useMutation({
    mutationFn: (payload: CategoryPayload) => categoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Gagal membuat kategori");
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Gagal memperbarui kategori");
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Gagal menghapus kategori");
    }
  });

  return {
    getCategories,
    getCategoryDetail,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,

    infiniteCategories
  };
};