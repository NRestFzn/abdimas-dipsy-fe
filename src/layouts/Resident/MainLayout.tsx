import { Outlet, useNavigate, Navigate, useLocation } from "react-router";
import { App, Spin } from "antd";
import { Loader2 } from "lucide-react";
import { useResident } from "../../hooks/useResident";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/imageHelper";
import { HomeHeader } from "./Partials/Header";
import { HomeFooter } from "./Partials/Footer";

export default function ResidentLayout() {
  const { modal } = App.useApp();
  const { logout, activeRole, user, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: response, isLoading } = useResident();

  const isCleanLayout =
    location.pathname.includes("/quiz") ||
    location.pathname.includes("/result") ||
    location.pathname === "/pilih-peran";

  const handleLogout = () => {
    modal.confirm({
      title: "Konfirmasi Keluar",
      content: "Apakah Anda yakin ingin keluar dari aplikasi?",
      okText: "Ya, Keluar",
      cancelText: "Batal",
      okButtonProps: { danger: true },
      onOk: () => {
        logout();
        navigate("/masuk");
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
    return <Navigate to="/masuk-masuk" state={{ from: location }} replace />;
  }

  const profile = response?.data;
  const profilePictureUrl = getImageUrl(profile?.profilePicture);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isCleanLayout &&
        <HomeHeader
          fullname={profile?.fullname || user?.fullname || "Warga"}
          profileUrl={profilePictureUrl}
          activeRole={activeRole!}
          onLogout={handleLogout}
          user={user}
          switchRole={switchRole}
        />
      }

      <div className="flex-1">
        <Outlet />
      </div>

      {!isCleanLayout && <HomeFooter />}
    </div>
  );
}
