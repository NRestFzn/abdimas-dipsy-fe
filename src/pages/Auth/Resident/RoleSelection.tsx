import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Typography, Button, Spin } from "antd";
import { User, ChevronRight, CheckCircle2, UsersRound } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { ROLE_ID } from "../../../constants";

const { Title, Text } = Typography;

export default function RoleSelection() {
    const navigate = useNavigate();
    const { user, switchRole, isLoadingUser } = useAuth();

    useEffect(() => {
        if (!isLoadingUser && !user) {
            navigate("/masuk-warga", { replace: true });
        }
    }, [user, isLoadingUser, navigate]);

    if (isLoadingUser || !user) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50/50 backdrop-blur-sm">
                <Spin size="large" />
            </div>
        );
    }

    const handleSelectRole = (roleId: string) => {
        const selectedRole = user.roles.find((r) => r.id === roleId);

        if (selectedRole) {
            switchRole(selectedRole);
            if (roleId === ROLE_ID.KADER) {
                navigate("/kader", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-gray-50 font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#70B748]/20 to-transparent blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-blue-400/20 to-transparent blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-4xl animate-in fade-in zoom-in duration-500 slide-in-from-bottom-8">

                <div className="text-center mb-10 sm:mb-14 space-y-3">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        <Text className="text-gray-500 text-xs font-semibold tracking-wide uppercase">
                            Akun Terverifikasi
                        </Text>
                    </div>

                    <Title level={1} className="!text-gray-800 !mb-0 !font-extrabold tracking-tight text-3xl sm:text-4xl">
                        Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70B748] to-green-600">{user.fullname}</span>
                    </Title>
                    <Text className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto block leading-relaxed">
                        Silakan pilih peran aktif Anda untuk mengakses fitur yang sesuai dengan kebutuhan Anda saat ini.
                    </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-2 sm:px-0">

                    <div
                        onClick={() => handleSelectRole(ROLE_ID.WARGA)}
                        className="group relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col h-full items-center text-center">
                            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-green-50 to-white shadow-inner border border-green-100 group-hover:scale-110 transition-transform duration-300">
                                <User size={48} className="text-[#70B748]" />
                            </div>

                            <Title level={3} className="!mb-3 !text-gray-800 !font-bold">Warga Desa</Title>

                            <div className="flex-grow space-y-4 mb-8">
                                <Text className="text-gray-500 block leading-relaxed">
                                    Akses dashboard pribadi Anda untuk memantau kesehatan dan riwayat pemeriksaan sendiri.
                                </Text>
                                <ul className="text-sm text-gray-400 space-y-1 hidden sm:block">
                                    <li className="flex items-center justify-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Isi Kuesioner Mandiri</li>
                                    <li className="flex items-center justify-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Lihat Riwayat Hasil</li>
                                </ul>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                className="!h-12 !rounded-xl !text-base !font-bold !bg-gradient-to-r !from-[#70B748] !to-green-600 !border-none !shadow-lg !shadow-green-500/30 group-hover:!shadow-green-500/50 w-full flex items-center justify-center gap-2 transition-all duration-300 transform group-hover:scale-[1.02]"
                            >
                                Masuk Dashboard Warga <ChevronRight size={18} strokeWidth={3} />
                            </Button>
                        </div>
                    </div>

                    <div
                        onClick={() => handleSelectRole(ROLE_ID.KADER)}
                        className="group relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col h-full items-center text-center">
                            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-inner border border-blue-100 group-hover:scale-110 transition-transform duration-300">
                                <UsersRound size={48} className="text-blue-500" />
                            </div>

                            <Title level={3} className="!mb-3 !text-gray-800 !font-bold">Kader Kesehatan</Title>

                            <div className="flex-grow space-y-4 mb-8">
                                <Text className="text-gray-500 block leading-relaxed">
                                    Mode fasilitator untuk <b>membantu warga lain</b> mengisi kuesioner menggunakan perangkat ini.
                                </Text>
                                <ul className="text-sm text-gray-400 space-y-1 hidden sm:block">
                                    <li className="flex items-center justify-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-blue-500" />
                                        Bantu Input Kuesioner Warga
                                    </li>
                                    <li className="flex items-center justify-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-blue-500" />
                                        Fasilitasi Warga Tanpa Gawai
                                    </li>
                                </ul>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                className="!h-12 !rounded-xl !text-base !font-bold !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-none !shadow-lg !shadow-blue-500/30 group-hover:!shadow-blue-500/50 w-full flex items-center justify-center gap-2 transition-all duration-300 transform group-hover:scale-[1.02]"
                            >
                                Masuk Mode Petugas <ChevronRight size={18} strokeWidth={3} />
                            </Button>
                        </div>
                    </div>

                </div>

                <div className="mt-12 text-center">
                    <Text className="text-gray-400 text-sm">
                        Anda dapat mengganti peran kapan saja melalui menu Profil.
                    </Text>
                </div>
            </div>
        </div>
    );
}