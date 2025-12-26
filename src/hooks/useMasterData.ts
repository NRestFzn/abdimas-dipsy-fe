import { useQuery } from "@tanstack/react-query";
import { masterDataService } from "../service/masterDataService";

export const useMasterData = () => {
	const educations = useQuery({
		queryKey: ["educations"],
		queryFn: masterDataService.getEducations,
	});

	const marriageStatuses = useQuery({
		queryKey: ["marriageStatuses"],
		queryFn: masterDataService.getMarriageStatuses,
	});

	const rukunWarga = useQuery({
		queryKey: ["rukunWarga"],
		queryFn: masterDataService.getRukunWarga,
	});

	const rukunTetangga = useQuery({
		queryKey: ["rukunTetangga"],
		queryFn: masterDataService.getRukunTetangga,
	});

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
