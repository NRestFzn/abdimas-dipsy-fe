import { Button, Typography } from "antd";
import { useNavigate } from "react-router";
import { ArrowLeft, FileQuestion } from "lucide-react";

const { Title, Text } = Typography;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#70B748]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[15rem] font-bold text-gray-900/5 select-none pointer-events-none z-0">
        404
      </div>

      <div className="bg-white/80 backdrop-blur-md w-full max-w-lg shadow-2xl border border-white/50 rounded-3xl relative z-10 p-8 md:p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner relative">
            <div className="absolute inset-0 bg-[#70B748]/20 rounded-full animate-ping opacity-75"></div>
            <FileQuestion className="text-[#70B748] w-10 h-10 relative z-10" />
          </div>
        </div>

        <Title level={2} className="!mb-2 text-gray-800 tracking-tight">
          Halaman Tidak Ditemukan
        </Title>

        <Text
          type="secondary"
          className="text-base block mb-8 leading-relaxed text-gray-500"
        >
          Ups! Halaman yang Anda cari sepertinya telah dipindahkan, dihapus,
          atau alamat URL yang Anda masukkan salah.
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="large"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)} // Balik ke halaman sebelumnya
            className="w-full sm:w-auto hover:bg-gray-100 border-gray-300 text-gray-600 rounded-xl h-12 px-6 font-medium"
          >
            Kembali
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 text-center w-full text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Desa Sehat Jiwa - Cibiru Wetan
      </div>
    </div>
  );
}
