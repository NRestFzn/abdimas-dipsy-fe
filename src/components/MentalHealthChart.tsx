import { useState, useMemo } from "react";
import { Select, Progress } from "antd";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	PieChart,
	Pie,
	LineChart,
	Line
} from "recharts";
import { Users, FileText, Activity, AlertCircle, History } from "lucide-react";
import dayjs from "dayjs";

export interface PerRwData {
	rwId: string;
	rwName: number;
	userCount: number;
	submitCount: number;
	stableMentalCount: number;
	unStableMentalCount: number;
	unStableMentalPercentage: number;
}

export interface PerRtData {
	rtId: string;
	rtName: number;
	userCount: number;
	submitCount: number;
	stableMentalCount: number;
	unStableMentalCount: number;
	unStableMentalPercentage: number;
}

export interface SubmissionData {
	submissionId: string;
	submissionDate: string;
	trueCount: string;
	isMentalUnStable: number;
}

export interface UserListData {
	UserId: string;
	fullname: string;
	lastSubmissionDate: string;
	isMentalUnStable: boolean;
}

interface MentalHealthChartProps {
	overallDepressionRate: number;
	totalSubmit?: number;
	totalUser?: number;

	perRwData?: PerRwData[];
	perRtData?: PerRtData[];
	usersData?: UserListData[];
	submissionsData?: SubmissionData[];

	title?: string;
	subtitle?: string;
}

export default function MentalHealthChart({
	overallDepressionRate,
	totalSubmit = 0,
	totalUser = 0,
	perRwData,
	perRtData,
	usersData,
	submissionsData,
	title = "Statistik Kesehatan Mental",
	subtitle = "Overview Data"
}: MentalHealthChartProps) {

	const mode = useMemo(() => {
		if (submissionsData && submissionsData.length > 0) return "USER_HISTORY";
		if (perRtData && perRtData.length > 0) return "RT_LEVEL";
		if (usersData && usersData.length > 0) return "USER_LIST";
		return "RW_LEVEL"; // Default
	}, [submissionsData, perRtData]);

	const [chartView, setChartView] = useState<string>("health_distribution");

	const healthyMentalPercentage = 100 - overallDepressionRate;

	const donutData = [
		{ name: "Berisiko", value: overallDepressionRate, color: "#EF4444" },
		{ name: "Stabil", value: healthyMentalPercentage, color: "#10B981" },
	];

	const formattedChartData = useMemo(() => {
		if (mode === "USER_HISTORY" && submissionsData) {
			return [...submissionsData]
				.sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime())
				.map(item => ({
					name: dayjs(item.submissionDate).format("DD MMM YYYY"),
					"Skor Indikasi": parseInt(item.trueCount),
					status: item.isMentalUnStable === 1 ? "Berisiko" : "Stabil"
				}));
		}

		if (mode === "RT_LEVEL" && perRtData) {
			return perRtData.map(item => ({
				name: `RT ${String(item.rtName).padStart(2, '0')}`,
				"Mental Stabil": item.stableMentalCount,
				"Mental Berisiko": item.unStableMentalCount,
				"Resiko (%)": item.unStableMentalPercentage,
				"Total User": item.userCount,
				"Total Submit": item.submitCount
			}));
		}

		if (mode === "USER_LIST" && usersData) {
			const riskyCount = usersData.filter(u => u.isMentalUnStable).length;
			const stableCount = usersData.length - riskyCount;

			return [
				{
					name: "Status Mental Warga",
					"Mental Berisiko": riskyCount,
					"Mental Stabil": stableCount,
					"Total User": usersData.length
				}
			];
		}

		return (perRwData || []).map(item => ({
			name: `RW ${String(item.rwName).padStart(2, '0')}`,
			"Mental Stabil": item.stableMentalCount,
			"Mental Berisiko": item.unStableMentalCount,
			"Resiko (%)": item.unStableMentalPercentage,
			"Total User": item.userCount,
			"Total Submit": item.submitCount
		}));
	}, [mode, perRwData, perRtData, submissionsData]);

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white border border-gray-200 p-3 rounded-lg shadow-xl text-sm z-50">
					<p className="font-semibold text-gray-800 mb-2">{label}</p>
					{payload.map((entry: any, index: number) => (
						<div key={index} className="flex items-center gap-2 mb-1">
							<div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke }} />
							<span className="text-gray-600">
								{entry.name}: <span className="font-medium text-gray-900">{entry.value}</span>
								{entry.unit || ''}
							</span>
						</div>
					))}
					{mode === "USER_HISTORY" && payload[0]?.payload?.status && (
						<div className="mt-2 text-xs font-bold text-gray-500">
							Status: <span className={payload[0].payload.status === "Berisiko" ? "text-red-500" : "text-green-500"}>
								{payload[0].payload.status}
							</span>
						</div>
					)}
				</div>
			);
		}
		return null;
	};

	const KpiCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
		<div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
			<div>
				<p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
				<h3 className="text-2xl font-bold text-gray-800">{value}</h3>
			</div>
			<div className={`p-3 rounded-full ${bgClass}`}>
				<Icon className={`w-5 h-5 ${colorClass}`} />
			</div>
		</div>
	);

	const renderChart = () => {
		if (mode === "USER_HISTORY") {
			return (
				<LineChart data={formattedChartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
					<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
					<YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
					<Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }} />
					<Legend verticalAlign="top" height={36} />
					<Line
						type="monotone"
						dataKey="Skor Indikasi"
						stroke="#EF4444"
						strokeWidth={3}
						activeDot={{ r: 8 }}
						dot={{ r: 4, strokeWidth: 2 }}
					/>
				</LineChart>
			);
		}

		if (mode === "USER_LIST") {
			return (
				<BarChart data={formattedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} layout="vertical">
					<CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
					<XAxis type="number" hide />
					<YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 14, fill: '#4B5563' }} axisLine={false} tickLine={false} />
					<Tooltip cursor={{ fill: 'transparent' }} />
					<Legend />
					<Bar dataKey="Mental Berisiko" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={40}>
						<Cell fill="#EF4444" />
					</Bar>
					<Bar dataKey="Mental Stabil" fill="#10B981" radius={[0, 4, 4, 0]} barSize={40}>
						<Cell fill="#10B981" />
					</Bar>
				</BarChart>
			);
		}

		switch (chartView) {
			case "health_distribution":
				return (
					<BarChart data={formattedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
						<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
						<YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
						<Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
						<Legend verticalAlign="top" height={36} iconType="circle" />
						<Bar dataKey="Mental Berisiko" stackId="a" fill="#EF4444" radius={[0, 0, 4, 4]} barSize={32} />
						<Bar dataKey="Mental Stabil" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
					</BarChart>
				);
			case "risk_percentage":
				return (
					<BarChart data={formattedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
						<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
						<YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} unit="%" />
						<Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
						<Bar dataKey="Resiko (%)" fill="#F59E0B" radius={[4, 4, 4, 4]} barSize={32}>
							{formattedChartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={(entry as any)["Resiko (%)"] > 50 ? '#EF4444' : '#F59E0B'} />
							))}
						</Bar>
					</BarChart>
				);
			case "participation":
				return (
					<BarChart data={formattedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
						<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
						<YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
						<Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
						<Legend verticalAlign="top" height={36} iconType="circle" />
						<Bar dataKey="Total User" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
						<Bar dataKey="Total Submit" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={20} />
					</BarChart>
				);
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col gap-6 mb-6">
			<div>
				<h2 className="text-xl font-bold text-gray-800">{title}</h2>
				<p className="text-gray-500">{subtitle}</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

				{mode === "USER_HISTORY" ? (
					<>
						<KpiCard
							title="Total Tes Dilakukan"
							value={totalSubmit}
							icon={History}
							colorClass="text-purple-600"
							bgClass="bg-purple-50"
						/>
						<KpiCard
							title="Terindikasi Berisiko"
							value={`${submissionsData?.filter(s => s.isMentalUnStable === 1).length} Kali`}
							icon={AlertCircle}
							colorClass="text-red-600"
							bgClass="bg-red-50"
						/>
					</>
				) : (
					<>
						<KpiCard
							title="Total User"
							value={totalUser}
							icon={Users}
							colorClass="text-blue-600"
							bgClass="bg-blue-50"
						/>
						<KpiCard
							title="Total Submit"
							value={totalSubmit}
							icon={FileText}
							colorClass="text-indigo-600"
							bgClass="bg-indigo-50"
						/>
					</>
				)}

				<div className="col-span-1 md:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<Activity className="text-gray-400" size={18} />
							<span className="text-gray-500 text-sm font-medium">
								{mode === "USER_HISTORY" ? "Status Akumulasi Personal" : "Status Akumulasi Wilayah"}
							</span>
						</div>

						<div className="mt-4">
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-600">Risiko Gangguan Mental</span>
								<span className="font-bold text-red-500">{overallDepressionRate}%</span>
							</div>
							<Progress percent={overallDepressionRate} showInfo={false} strokeColor="#EF4444" trailColor="#F3F4F6" />

							<div className="flex justify-between text-sm mt-3 mb-1">
								<span className="text-gray-600">Kondisi Stabil</span>
								<span className="font-bold text-emerald-500">{healthyMentalPercentage}%</span>
							</div>
							<Progress percent={healthyMentalPercentage} showInfo={false} strokeColor="#10B981" trailColor="#F3F4F6" />
						</div>
					</div>

					<div className="w-full sm:w-auto flex justify-center items-center">
						<div className="w-32 h-32 relative">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={donutData}
										cx="50%"
										cy="50%"
										innerRadius={40}
										outerRadius={55}
										paddingAngle={5}
										dataKey="value"
										startAngle={90}
										endAngle={-270}
									>
										{donutData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip content={<CustomTooltip />} />
								</PieChart>
							</ResponsiveContainer>
							<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
								<span className="text-xs text-gray-400">Total</span>
								<span className="text-lg font-bold text-gray-700">
									{mode === "USER_HISTORY" ? totalSubmit : totalUser}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-gray-100 rounded-lg">
							<AlertCircle className="text-gray-500" size={20} />
						</div>
						<div>
							<h3 className="font-bold text-gray-800">
								{mode === "USER_HISTORY" ? "Grafik Riwayat Tes" :
									mode === "USER_LIST" ? "Distribusi Status Warga" :
										"Analisis Detail Wilayah"}
							</h3>
							<p className="text-xs text-gray-500">
								{mode === "USER_HISTORY" ? "Perkembangan skor indikasi dari waktu ke waktu" : "Visualisasi data per wilayah"}
							</p>
						</div>
					</div>

					{mode !== "USER_HISTORY" && mode !== "USER_LIST" && (
						<Select
							defaultValue="health_distribution"
							style={{ width: 240 }}
							onChange={setChartView}
							options={[
								{ value: 'health_distribution', label: 'Distribusi Sehat vs Berisiko' },
								{ value: 'risk_percentage', label: 'Persentase Risiko (%)' },
								{ value: 'participation', label: 'Partisipasi (User vs Submit)' },
							]}
						/>
					)}
				</div>

				<div className="h-[350px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						{renderChart() || <div />}
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}