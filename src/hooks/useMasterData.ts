import { useQuery } from "@tanstack/react-query";
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
		queryFn: () => masterDataService.getSalaryRanges({ order: '[["createdAt", "desc"]]' }),
	});

	return {
		educations,
		marriageStatuses,
		rukunWarga,
		rukunTetangga,
		salaryRanges,
	};
};
