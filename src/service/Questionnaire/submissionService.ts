import { api } from "../api";
import type {
    RtSummaryData,
    RWSummaryData,
    SummaryRtParams,
    SummaryRwParams
} from "../../types/Questionnaire/submissionTypes";
import type { ResponseData } from "../../types/commons";

export type RWSummaryResponse = ResponseData<RWSummaryData>;
export type RTSummaryResponse = ResponseData<RtSummaryData>;

export const submissionService = {
    getSummaryRw: async ({ questionnaireId, RukunWargaId, startDate, endDate }: SummaryRwParams) => {
        const response = await api.get<RWSummaryResponse>(
            `/v1/questionnaire-submission/summary-rw/${questionnaireId}`,
            {
                params: {
                    RukunWargaId,
                    startDate,
                    endDate,
                },
            }
        );
        return response.data;
    },

    getSummaryRt: async (params: SummaryRtParams) => {
        const response = await api.get<RTSummaryResponse>(
            `/v1/questionnaire-submission/summary-rt/${params.questionnaireId}`, { params: { ...params, RukunWargaId: params.rwId, RukunTetanggaId: params.rtId } }
        );
        return response.data;
    },
};