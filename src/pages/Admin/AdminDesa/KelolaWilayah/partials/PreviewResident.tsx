import { useNavigate, useParams } from "react-router";
import {
    Card,
    Avatar,
    Tag,
    Descriptions,
    Button,
    Skeleton,
    Divider,
    Result,
    Grid,
} from "antd";
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    GraduationCap,
    Phone,
    CreditCard,
    Heart,
    Calendar,
} from "lucide-react";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/id";

import { adminDesaService } from "../../../../../service/adminDesaService";
import { getImageUrl } from "../../../../../utils/imageHelper";

const { useBreakpoint } = Grid;

export default function PreviewResident() {
    const navigate = useNavigate();
    const params = useParams<{ residentId: string }>();
    const questionnaireId = params?.residentId?.split("=")?.[1] as string

    const screens = useBreakpoint();
    const descriptionLayout = screens.md ? "horizontal" : "vertical";
    const labelStyle = screens.md ? { width: "180px", color: "#6b7280" } : { color: "#6b7280" };

    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["resident-detail", questionnaireId],
        queryFn: () => adminDesaService.getResidentDetail(questionnaireId!),
        enabled: !!questionnaireId,
    });

    const formatCurrency = (val: string) => {
        return parseInt(val).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        });
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <main className="max-w-3xl mx-auto">
                    <div className="flex flex-col gap-6">
                        <Skeleton.Node active style={{ width: "100%", height: 350, borderRadius: 16 }} />
                        <Skeleton active paragraph={{ rows: 6 }} />
                        <Skeleton active paragraph={{ rows: 6 }} />
                    </div>
                </main>
            </div>
        );
    }

    if (isError || !response?.data) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Result
                    status="error"
                    title="Data Tidak Ditemukan"
                    subTitle="Gagal memuat detail data warga. Mungkin data sudah dihapus."
                    extra={[
                        <Button
                            type="primary"
                            onClick={() => refetch()}
                            key="retry"
                            className="bg-[#70B748]"
                        >
                            Coba Lagi
                        </Button>,
                        <Button onClick={() => navigate("/admin/master-data/warga")} key="back">
                            Kembali ke Daftar
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    const profile = response.data;
    const profilePictureUrl = getImageUrl(profile.profilePicture);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        type="text"
                        onClick={() => navigate("/admin/kelola-wilayah")}
                        className="hover:bg-gray-200 text-gray-600 font-medium flex items-center gap-x-2 px-0"
                    >
                        <ArrowLeft size={18} />
                        <span>Kembali</span>
                    </Button>
                </div>

                <div className="flex flex-col gap-6">

                    <Card className="shadow-sm border-gray-200 rounded-2xl overflow-hidden" bodyStyle={{ padding: 0 }}>
                        <div className="flex flex-col items-center py-8 px-4 bg-gradient-to-b from-white to-gray-50">
                            <div className="relative group mb-4">
                                <Avatar
                                    size={128}
                                    src={profilePictureUrl}
                                    className="bg-gradient-to-br from-[#70B748] to-[#5a9639] text-white shadow-xl text-5xl font-bold border-4 border-white"
                                >
                                    {!profilePictureUrl && profile.fullname.charAt(0).toUpperCase()}
                                </Avatar>

                                <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md z-10">
                                    {profile.gender === "m" ? <BsGenderMale /> : <BsGenderFemale />}
                                </div>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 text-center break-words max-w-full px-2">
                                {profile.fullname}
                            </h2>
                            <p className="text-gray-500 mb-4 font-medium text-sm sm:text-base break-all text-center">
                                {profile.email}
                            </p>

                            <Tag
                                color="green"
                                className="px-4 py-1 rounded-full text-sm border-0 bg-green-100 text-green-700 font-semibold"
                            >
                                Warga Terdaftar
                            </Tag>
                        </div>

                        <Divider className="my-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 bg-white">
                            <div className="p-4 text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                    No Induk Kependudukan
                                </p>
                                <p className="font-mono font-medium text-gray-700 text-sm sm:text-base">
                                    {profile.userDetail?.nik || "-"}
                                </p>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                    Terdaftar Sejak
                                </p>
                                <p className="font-medium text-gray-700 text-sm sm:text-base">
                                    {profile.userDetail?.createdAt
                                        ? dayjs(profile.userDetail.createdAt)
                                            .locale("id")
                                            .format("DD MMM YYYY")
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#70B748] rounded-full"></div>
                                <span className="text-gray-800 font-bold text-base">Informasi Pribadi</span>
                            </div>
                        }
                        className="shadow-sm border-gray-200 rounded-2xl"
                        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                        <Descriptions
                            column={1}
                            layout={descriptionLayout}
                            labelStyle={labelStyle}
                            contentStyle={{ fontWeight: 500, color: "#374151" }}
                        >
                            <Descriptions.Item label="Jenis Kelamin">
                                {profile.gender === "m" ? "Laki-Laki" : "Perempuan"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tanggal Lahir">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-[#70B748] shrink-0" />
                                    {dayjs(profile.birthDate).locale("id").format("DD MMMM YYYY")}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nomor Telepon">
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-[#70B748] shrink-0" />
                                    {profile.userDetail?.phoneNumber || "-"}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status Pernikahan">
                                <div className="flex items-center gap-2">
                                    <Heart size={16} className="text-[#70B748] shrink-0" />
                                    {profile.userDetail?.marriageStatus?.name || "-"}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-800 font-bold text-base">Domisili & Pekerjaan</span>
                            </div>
                        }
                        className="shadow-sm border-gray-200 rounded-2xl"
                        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                        <Descriptions
                            column={1}
                            layout={descriptionLayout} // Responsive Layout
                            labelStyle={labelStyle}    // Responsive Label Width
                            contentStyle={{ fontWeight: 500, color: "#374151" }}
                        >
                            <Descriptions.Item label="Wilayah Tinggal">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500 shrink-0" />
                                    <span>
                                        RW {String(profile.userDetail?.rukunWarga?.name || 0).padStart(2, "0")}{" "}
                                        / RT {String(profile.userDetail?.rukunTetangga?.name || 0).padStart(2, "0")}
                                    </span>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Pendidikan Terakhir">
                                <div className="flex items-center gap-2">
                                    <GraduationCap size={16} className="text-blue-500 shrink-0" />
                                    {profile.userDetail?.education?.name || "-"}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Pekerjaan">
                                <div className="flex items-center gap-2">
                                    <Briefcase size={16} className="text-blue-500 shrink-0" />
                                    {profile.userDetail?.profession || "-"}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Rentang Pendapatan">
                                <div className="flex items-center gap-2">
                                    <CreditCard size={16} className="text-blue-500 shrink-0" />
                                    {profile.userDetail?.salaryRange
                                        ? `${formatCurrency(profile.userDetail.salaryRange.minRange)} - ${formatCurrency(profile.userDetail.salaryRange.maxRange)}`
                                        : "-"}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </div>
            </main>
        </div>
    );
}