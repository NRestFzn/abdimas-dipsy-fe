import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionnaireService } from "../../service/Questionnaire/questionnaireService";
import type { GetQuestionnaireParams, Questionnaire, QuestionnairePayload } from "../../types/Questionnaire/questionnaireTypes";

export const useQuestionnaire = () => {
  const query = useQuery({
    queryKey: ["questionnaires-me"],
    queryFn: questionnaireService.getQuestionnairesMe,
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

export const useAdminQuestionnaire = (params: GetQuestionnaireParams) => {
  const query = useQuery({
    queryKey: ["questionnaires", params],
    queryFn: () => questionnaireService.getAllQuestionnaire(params),
    staleTime: 1000 * 60 * 5,
  })

  return query
}

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

  return {
    createMutation,
    updateMutation,
    deleteMutation
  };
};