import { useState } from "react";
import { useNavigate } from "react-router";
import { Form, Input, Button, Alert, Typography } from "antd";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { ROLE_ID } from "../../../constants";
import type { LoginPayload } from "../../../types/AuthTypes/authTypes";

const { Title, Text, Paragraph } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const [formError, setFormError] = useState<string | null>(null);
  const [isFormFilled, setIsFormFilled] = useState(false);

  const onFinish = async (values: LoginPayload) => {
    setFormError(null);
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      const userRoleId = response?.data?.RoleId;

      if (userRoleId === ROLE_ID.ADMIN_DESA) {
        navigate("/admin/responden");
      } else if (userRoleId === ROLE_ID.ADMIN_MEDIS) {
        navigate("/admin-medis/responden");
      } else {
        console.warn("Role ID tidak dikenali:", userRoleId);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setFormError(getErrorMessage(err));
    }
  };

  const handleValuesChange = (_: any, allValues: LoginPayload) => {
    const hasEmail = allValues.email && allValues.email.trim() !== "";
    const hasPassword = allValues.password && allValues.password.trim() !== "";

    setIsFormFilled(!!(hasEmail && hasPassword));
  };

  return (
    <div className="min-h-screen flex w-full bg-white overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-[#70B748] relative flex-col p-12 overflow-hidden h-screen">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150 pointer-events-none" />
        <div className="relative z-10 flex-none">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
              <img
                src="/icon.png"
                alt="Logo Desa"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-wide uppercase text-xs opacity-90">
                Pemerintah Desa
              </span>
              <span className="text-white font-bold text-lg leading-none">
                Cibiru Wetan
              </span>
            </div>
          </div>

          <Title level={1} className="!text-white !font-bold !text-5xl leading-tight mb-4">
            Kelola Data Desa <br /> & Kesehatan Warga
          </Title>
          <Paragraph className="!text-white/90 text-base max-w-md leading-relaxed mb-0">
            Platform terintegrasi untuk pemantauan, validasi, dan pengelolaan data kesehatan mental demi mewujudkan desa yang sejahtera.
          </Paragraph>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center py-2">
          <img
            src="/enthusiastic-rafiki.png"
            alt="Ilustrasi Sehat Jiwa"
            className="w-full max-w-[480px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="relative z-10 flex-none text-white/70 text-sm flex items-center gap-2">
          <ShieldCheck size={16} />
          <span className="font-medium tracking-wide">Sistem Terenkripsi & Aman</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50/50 h-screen overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-8 lg:hidden mt-8 pt-4">
            <div className="mb-4 p-3 bg-white rounded-full shadow-sm border border-gray-100">
              <img
                src="/icon.png"
                alt="Logo"
                className="w-16 h-16 object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#70B748]/10 border border-[#70B748]/20 text-[#70B748] text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={14} />
              <span>Admin Access</span>
            </div>

            <Title level={3} className="!mb-1 !font-bold text-gray-800">
              Portal Pengelola
            </Title>
            <Text className="text-gray-500 text-sm">
              Masuk untuk mengelola data desa
            </Text>
          </div>

          <div className="hidden lg:block mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} />
              Portal Internal
            </div>
            <Title level={2} className="!mb-2 !font-bold text-gray-800">
              Selamat Datang Kembali
            </Title>
            <Text type="secondary" className="text-gray-500 text-base">
              Masukkan kredensial Anda untuk mengakses dashboard.
            </Text>
          </div>

          {(error || formError) && (
            <Alert
              title="Autentikasi Gagal"
              description={formError || getErrorMessage(error)}
              type="error"
              showIcon
              className="!mb-6 rounded-xl border-red-200 bg-red-50 text-red-700"
            />
          )}

          <Form
            name="login_admin"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            onValuesChange={handleValuesChange}
            size="large"
            className="space-y-5"
          >
            <Form.Item
              name="email"
              label={<span className="font-semibold text-gray-700 ml-1">Email Kedinasan</span>}
              rules={[
                { required: true, message: "Email wajib diisi" },
                { type: "email", message: "Format email tidak valid" },
              ]}
            >
              <Input
                prefix={<Mail className="text-gray-400 mr-2" size={20} />}
                placeholder="admin@cibiruwetan.desa.id"
                className="rounded-xl py-2.5 border-gray-300 hover:border-[#70B748] focus:border-[#70B748] transition-colors"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="font-semibold text-gray-700 ml-1">Kata Sandi</span>}
              rules={[
                { required: true, message: "Password wajib diisi" },
              ]}
            >
              <Input.Password
                prefix={<Lock className="text-gray-400 mr-2" size={20} />}
                placeholder="••••••••"
                className="rounded-xl py-2.5 border-gray-300 hover:border-[#70B748] focus:border-[#70B748] transition-colors"
              />
            </Form.Item>

            <Form.Item className="pt-2">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                disabled={!isFormFilled}
                className={`
                  !h-12 !text-base !font-bold !rounded-xl transition-all duration-300
                  ${isFormFilled
                    ? "!bg-[#70B748] hover:!bg-[#5a9639] shadow-lg shadow-[#70B748]/20 hover:scale-[1.02] active:scale-95"
                    : "!bg-gray-200 !text-gray-400 !border-gray-200 cursor-not-allowed shadow-none"
                  }
                `}
              >
                Masuk Dashboard
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex-shrink-0 mt-0.5">
                <ShieldCheck className="text-red-500" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-red-700 text-xs uppercase mb-1">Area Terbatas</span>
                <Text className="text-xs text-gray-600 leading-relaxed">
                  Akses ini dikhususkan untuk <strong>Admin Desa</strong> dan <strong>Tenaga Medis</strong>. Aktivitas login Anda tercatat demi keamanan data warga.
                </Text>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}