import { useQuery } from "@tanstack/react-query";
import { questionnaireService } from "../../service/Questionnaire/questionnaireService";
import type { Questionnaire } from "../../types/Questionnaire/questionnaireTypes";

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