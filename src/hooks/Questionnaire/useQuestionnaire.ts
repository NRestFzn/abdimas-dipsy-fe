import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionnaireService } from "../../service/Questionnaire/questionnaireService";
import type { GetPublicQuestionnaireParams, GetQuestionnaireParams, Questionnaire, QuestionnairePayload } from "../../types/Questionnaire/questionnaireTypes";
import type { SubmitParams } from "../../types/Questionnaire/submissionTypes";

export const useQuestionnaire = () => {
  const query = useQuery({
    queryKey: ["questionnaires-me"],
    queryFn: questionnaireService.getQuestionnairesMe,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return {
    questionnaires: query.data?.data || [] as Questionnaire[],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export const usePublicQuestionnaire = (params: GetPublicQuestionnaireParams) => {
  return useQuery({
    queryKey: ["public-questionnaires", params],
    queryFn: () => questionnaireService.getPublicQuestionnaires(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminQuestionnaire = (params: GetQuestionnaireParams) => {
  const query = useQuery({
    queryKey: ["questionnaires", params],
    queryFn: () => questionnaireService.getAllQuestionnaire(params),
    staleTime: 1000 * 60 * 5,
  })

  return query
}

export const useQuestionnaireDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["questionnaire-detail", id],
    queryFn: () => {
      if (!id) throw new Error("ID is required");
      // Panggil service yang punya logika fallback
      return questionnaireService.getDetailWithFallback(id);
    },
    enabled: !!id, // Hanya jalan jika ID ada
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    retry: 1, // Retry 1 kali saja jika gagal total
  });
};

export const useQuestionnaireMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: QuestionnairePayload) => questionnaireService.createQuestionnaire(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: QuestionnairePayload }) =>
      questionnaireService.updateQuestionnaire(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionnaireService.deleteQuestionnaire(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });

  const submitMutation = useMutation({
    mutationFn: ({ id, answers, residentId, activeRoleId }: SubmitParams) =>
      questionnaireService.submitAnswers(id, answers, residentId, activeRoleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history-me"] });
      queryClient.invalidateQueries({ queryKey: ["questionnaires-me"] });
      queryClient.invalidateQueries({ queryKey: ["public-questionnaires"] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,

    submitMutation
  };
};