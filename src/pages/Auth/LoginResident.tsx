import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Form, Input, Button, Alert, Typography } from "antd";
import { Lock, SquareUserRound, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROLE_ID } from "../../constants";
import type { LoginResidentPayload } from "../../types/AuthTypes/authTypes";

const { Title, Text } = Typography;

export default function LoginResident() {
  const navigate = useNavigate();
  const { loginResident, isLoading, error } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const onFinish = async (values: LoginResidentPayload) => {
    setFormError(null);
    try {
      const response = await loginResident({
        nik: values.nik,
        password: values.password,
      });

      const userRoleId = response?.data?.RoleId;

      if (userRoleId === ROLE_ID.WARGA) {
        navigate("/", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Resident Login error:", err);
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gray-50 font-sans selection:bg-[#70B748] selection:text-white">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#70B748]/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#5a9639]/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[540px] z-10 animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gray-200/50 rounded-3xl p-8 sm:p-10">

          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center bg-green-50 p-4 rounded-2xl mb-6 shadow-sm border border-green-100">
              <img
                src="/icon.png"
                alt="Logo Desa"
                className="w-12 h-12 object-contain drop-shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Title
                level={2}
                className="!text-gray-800 !mb-0 !font-extrabold tracking-tight"
              >
                Selamat Datang
              </Title>
              <Text className="!text-gray-500 text-base font-medium block">
                Portal Kesehatan Warga Desa Cibiru Wetan
              </Text>
            </div>
          </div>

          {(error || formError) && (
            <Alert
              title="Gagal Masuk"
              description={formError || getErrorMessage(error)}
              type="error"
              showIcon
              className="!mb-6 !border-red-100 !bg-red-50/80 rounded-xl"
            />
          )}

          <Form
            name="login_resident"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
            className="!space-y-5"
          >
            <Form.Item
              name="nik"
              label={<span className="font-semibold !text-gray-600 !ml-1">NIK (Nomor Induk Kependudukan)</span>}
              rules={[
                { required: true, message: "Mohon masukkan NIK Anda" },
                { len: 16, message: "NIK harus 16 digit angka" },
                { pattern: /^[0-9]+$/, message: "NIK harus berupa angka" },
              ]}
              className="mb-0"
            >
              <Input
                prefix={<SquareUserRound className="!text-gray-400 !mr-2 transition-colors !group-focus-within:text-[#70B748]" size={20} />}
                placeholder="Masukkan 16 digit NIK"
                className="!bg-gray-50 !border-gray-200 hover:!border-green-300 focus:!border-[#70B748] focus:!shadow-[0_0_0_4px_rgba(112,183,72,0.1)] !rounded-xl !py-3 !text-gray-700 !text-base !font-medium transition-all duration-300"
                maxLength={16}
                inputMode="numeric"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="font-semibold !text-gray-600 !ml-1">Kata Sandi</span>}
              rules={[{ required: true, message: "Mohon masukkan kata sandi" }]}
              className="!mb-2"
            >
              <Input.Password
                prefix={<Lock className="text-gray-400 !mr-2 transition-colors !group-focus-within:text-[#70B748]" size={20} />}
                placeholder="Masukkan kata sandi"
                className="!bg-gray-50 !border-gray-200 hover:!border-green-300 focus:!border-[#70B748] focus:!shadow-[0_0_0_4px_rgba(112,183,72,0.1)] !rounded-xl !py-3 !text-gray-700 !text-base !font-medium transition-all duration-300"
              />
            </Form.Item>

            <div className="flex justify-end mb-4">
              {/* <a href="#" className="text-xs font-semibold text-[#70B748] hover:underline">Lupa Kata Sandi?</a> */}
            </div>

            <Form.Item className="!mb-0 !mt-8">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                className="!bg-gradient-to-r !from-[#70B748] !to-[#5a9639] !border-none !h-12 !rounded-xl !text-lg !font-bold !shadow-lg !shadow-green-500/20 hover:!shadow-green-500/40 hover:!scale-[1.02] active:!scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Masuk Sekarang</span>
                {!isLoading && <ChevronRight size={20} className="!stroke-[3px]" />}
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
            <div className="space-y-1">
              <Text className="text-gray-500 text-sm">Belum terdaftar sebagai warga?</Text>
              <div>
                <Link
                  to="/daftar"
                  className="inline-flex items-center !text-[#70B748] font-bold !hover:text-[#5a9639] transition-colors"
                >
                  Daftar Akun Baru
                </Link>
              </div>
            </div>

            <div className="w-full max-w-[200px] h-px bg-gray-100 my-1" />

            <div className="flex items-center justify-center gap-2">
              <Text className="text-gray-400 text-xs">Anda Petugas Desa?</Text>
              <Link
                to="/masuk"
                className="!text-gray-500 font-semibold text-xs !hover:text-[#70B748] !hover:underline transition-colors"
              >
                Login Petugas
              </Link>
            </div>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} Pemerintah Desa Cibiru Wetan
          </p>
        </div>
      </div>
    </div>
  );
}