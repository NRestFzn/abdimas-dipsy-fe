import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const { Title, Text } = Typography;

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#70B748]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      
      <Card 
        className="w-full max-w-lg shadow-xl border-0 rounded-2xl relative z-10"
        bodyStyle={{ padding: "48px 32px", textAlign: "center" }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <ShieldAlert className="text-red-500 w-8 h-8" />
            </div>
          </div>
        </div>

        <Title level={2} className="!mb-2 text-gray-800">
          Akses Dibatasi
        </Title>
        
        <Text type="secondary" className="text-base block mb-8 leading-relaxed max-w-xs mx-auto">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini khusus untuk peran (role) tertentu.
        </Text>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            size="large"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 border-gray-300 text-gray-600 rounded-xl h-11"
          >
            Kembali
          </Button>
        </div>
      </Card>

      <div className="absolute bottom-6 text-center w-full text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Desa Sehat Jiwa - Cibiru Wetan
      </div>
    </div>
  );
}