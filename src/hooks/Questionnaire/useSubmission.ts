import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { submissionService, type RTSummaryResponse } from "../../service/Questionnaire/submissionService";
import type { SummaryRtParams, SummaryRwParams } from "../../types/Questionnaire/submissionTypes";

export const useSummaryRw = (params: SummaryRwParams) => {
    return useQuery({
        queryKey: ["summary-rw", params],
        queryFn: () => submissionService.getSummaryRw(params),
        placeholderData: keepPreviousData,
        enabled: !!params.questionnaireId && !!params.RukunWargaId,
        staleTime: 1000 * 60 * 5,
    });
};

export const useSummaryRt = ({
    questionnaireId,
    rwId,
    rtId,
    startDate,
    endDate
}: SummaryRtParams) => {
    return useQuery<RTSummaryResponse, Error>({
        queryKey: ['summary-rt', questionnaireId, rwId, rtId, startDate, endDate],
        queryFn: async () => {
            return await submissionService.getSummaryRt({ questionnaireId: questionnaireId!, rwId: rwId!, rtId: rtId!, startDate, endDate });
        },
        enabled: !!questionnaireId && !!rtId,
        placeholderData: (previousData) => previousData,
    });
};
