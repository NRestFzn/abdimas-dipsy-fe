import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { QuestionnaireHistoryParams } from "../../types/Questionnaire/questionnaireTypes";
import { questionnaireService } from "../../service/Questionnaire/questionnaireService";

export const useHistory = (params: QuestionnaireHistoryParams) => {
  return useQuery({
    queryKey: ["history-me", params],
    queryFn: () => questionnaireService.getHistory(params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
};