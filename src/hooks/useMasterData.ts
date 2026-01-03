import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { masterDataService } from "../service/masterDataService";
import type { GetRTParams, GetRWParams } from "../types/masterDataTypes";

export const useMasterData = () => {
	const queryClient = useQueryClient();

	// Rukun Warga Hooks and Mutation
	const rukunWarga = (params?: GetRWParams) => {
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
	// End Rukun Warga Hooks and Mutation

	// Rukun Tetangga Hooks and Mutation
	const rukunTetangga = (params?: GetRTParams) => {
		return useQuery({
			queryKey: ["rukunTetangga", params],
			queryFn: () => masterDataService.getRukunTetangga(params),
			placeholderData: keepPreviousData,
			enabled: !!params?.RukunWargaId
		});
	}

	const createRTMutation = useMutation({
		mutationFn: (vals: { count: number, rwId: string }) =>
			masterDataService.createRukunTetangga(vals.count, vals.rwId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["rukunTetangga", { RukunWargaId: variables.rwId }]
			});
		},
	});

	const deleteRTMutation = useMutation({
		mutationFn: (id: string) => masterDataService.deleteRukunTetangga(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rukunTetangga"] });
		},
	});
	// END Rukun Tetangga Hooks and Mutation

	const educations = useQuery({
		queryKey: ["educations"],
		queryFn: masterDataService.getEducations,
	});

	const marriageStatuses = useQuery({
		queryKey: ["marriageStatuses"],
		queryFn: masterDataService.getMarriageStatuses,
	});

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

		rukunTetangga,
		createRTMutation,
		deleteRTMutation,

		educations,
		marriageStatuses,
		salaryRanges,

		infiniteRukunWarga,
	};
};
