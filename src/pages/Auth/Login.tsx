import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { Mail, Lock } from "lucide-react"; // Icon modern
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROLE_ID } from "../../constants";
import type { LoginPayload } from "../../types/AuthTypes/authTypes";

const { Title, Text, Paragraph } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const onFinish = async (values: LoginPayload) => {
    setFormError(null);
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      const userRoleId = response?.data?.RoleId;

      if (userRoleId === ROLE_ID.WARGA) {
        navigate("/");
      } else if (userRoleId === ROLE_ID.ADMIN_DESA) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card
        className="!w-full max-w-md shadow-lg rounded-2xl border-gray-100 overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/icon.png"
              alt="Logo Desa Cibiru Wetan"
              className="w-20 h-20 object-contain drop-shadow-sm"
            />
          </div>

          <Title level={3} className="!text-[#70B748] !mb-1 !font-bold">
            Desa Sehat Jiwa
          </Title>
          <Text className="text-gray-500 font-medium block mb-4">
            Desa Cibiru Wetan
          </Text>

          <Paragraph type="secondary" className="text-sm px-2 leading-relaxed">
            Platform deteksi dini dan pemantauan kesehatan mental untuk
            mewujudkan warga desa yang sehat, bahagia, dan produktif.
          </Paragraph>
        </div>

        {(error || formError) && (
          <Alert
            message="Gagal Masuk"
            description={formError || getErrorMessage(error)}
            type="error"
            showIcon
            className="mb-6 rounded-lg"
          />
        )}

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Mohon masukkan email Anda" },
              { type: "email", message: "Format email tidak valid" },
            ]}
          >
            <Input
              prefix={<Mail className="text-gray-400" size={18} />}
              placeholder="nama@email.com"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Mohon masukkan password Anda" },
            ]}
          >
            <Input.Password
              prefix={<Lock className="text-gray-400" size={18} />}
              placeholder="Masukkan password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="!bg-[#70B748] hover:!bg-[#5a9639] h-12 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Masuk Sekarang
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text className="text-gray-500">Belum punya akun? </Text>
          <Link
            to="/daftar"
            className="!text-[#70B748] !hover:text-[#5a9639] font-semibold hover:underline"
          >
            Daftar disini
          </Link>
        </div>
      </Card>
    </div>
  );
}
