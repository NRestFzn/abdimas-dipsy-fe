import { Outlet, useNavigate, Navigate, useLocation } from "react-router";
import { Modal, Spin } from "antd";
import { Loader2 } from "lucide-react";
import { useResident } from "../../hooks/useResident";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/imageHelper";
import { HomeHeader } from "./Partials/Header";

export default function ResidentLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: response, isLoading } = useResident();

  const isQuizPage = location.pathname.includes("/quiz") || location.pathname.includes("/result");

  const handleLogout = () => {
    Modal.confirm({
      title: "Konfirmasi Keluar",
      content: "Apakah Anda yakin ingin keluar dari aplikasi?",
      okText: "Ya, Keluar",
      cancelText: "Batal",
      okButtonProps: { danger: true },
      onOk: () => {
        logout();
        navigate("/masuk-warga");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spin
            indicator={
              <Loader2 className="animate-spin text-[#70B748]" size={40} />
            }
          />
          <p className="text-gray-500 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/masuk-warga" state={{ from: location }} replace />;
  }

  const profile = response?.data;
  const profilePictureUrl = getImageUrl(profile?.profilePicture);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isQuizPage &&
        <HomeHeader
          fullname={profile?.fullname || user?.fullname || "Warga"}
          profileUrl={profilePictureUrl}
          onLogout={handleLogout}
        />
      }

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
