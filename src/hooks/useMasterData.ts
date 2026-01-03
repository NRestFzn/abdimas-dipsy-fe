import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { masterDataService } from "../service/masterDataService";
import type { GetParams } from "../types/adminDesaService";

export const useMasterData = () => {
	const queryClient = useQueryClient();

	const rukunWarga = (params?: GetParams) => {
		return useQuery({
			queryKey: ["rukunWarga", params],
			queryFn: () => masterDataService.getRukunWarga(params),
			placeholderData: keepPreviousData,
		});
	}

	const createRWMutation = useMutation({
		mutationFn: (count: number) => masterDataService.createRukunWarga(count),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rukunWarga"] });
		},
	});

	const deleteRWMutation = useMutation({
		mutationFn: (id: string) => masterDataService.deleteRukunWarga(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rukunWarga"] });
		},
	});

	const educations = useQuery({
		queryKey: ["educations"],
		queryFn: masterDataService.getEducations,
	});

	const marriageStatuses = useQuery({
		queryKey: ["marriageStatuses"],
		queryFn: masterDataService.getMarriageStatuses,
	});

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
		rukunWarga,
		createRWMutation,
		deleteRWMutation,

		educations,
		marriageStatuses,
		rukunTetangga,
		salaryRanges,

		infiniteRukunWarga,
	};
};
