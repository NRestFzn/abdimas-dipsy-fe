import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { masterDataService } from "../service/masterDataService";
import type { GetParams } from "../types/adminDesaService";

export const useMasterData = () => {
	const educations = useQuery({
		queryKey: ["educations"],
		queryFn: masterDataService.getEducations,
	});

	const marriageStatuses = useQuery({
		queryKey: ["marriageStatuses"],
		queryFn: masterDataService.getMarriageStatuses,
	});

	const rukunWarga = (params?: GetParams) => {
		return useQuery({
			queryKey: ["rukunWarga", params],
			queryFn: () => masterDataService.getRukunWarga(params),
		});
	}

	const rukunTetangga = (params?: GetParams) => {
		return useQuery({
			queryKey: ["rukunTetangga", params],
			queryFn: () => masterDataService.getRukunTetangga(params),
		});
	}

	const salaryRanges = useQuery({
		queryKey: ["salaryRanges"],
		queryFn: () => masterDataService.getSalaryRanges({ order: '[["minRange", "asc"]]' }),
	});

	const infiniteRukunWarga = (pageSize = 20) => {
        return useInfiniteQuery({
            queryKey: ["rukunWarga", "infinite"],
            queryFn: async ({ pageParam = 1 }) => {
                return masterDataService.getRukunWarga({
                    page: pageParam,
                    pageSize: pageSize,
                    order: '[["name", "asc"]]'
                });
            },
            getNextPageParam: (lastPage: any, allPages) => {
                const dataArray = Array.isArray(lastPage) ? lastPage : lastPage?.data || [];
                
                if (dataArray.length === pageSize) {
                    return allPages.length + 1;
                }
                return undefined;
            },
            initialPageParam: 1,
        });
    }

	return {
		educations,
		marriageStatuses,
		rukunWarga,
		rukunTetangga,
		salaryRanges,

		infiniteRukunWarga,
	};
};
