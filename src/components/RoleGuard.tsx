import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Spin } from "antd";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoleIds: string[];
  loginPath?: string;
}

export const RoleGuard = ({ children, allowedRoleIds, loginPath = "/masuk" }: RoleGuardProps) => {
  const { user, isLoadingUser } = useAuth();
  const location = useLocation();

  if (isLoadingUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Spin
            indicator={
              <Loader2 className="animate-spin text-[#70B748]" size={40} />
            }
          />
          <span className="text-gray-500 font-medium">
            Memverifikasi akses...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (!allowedRoleIds.includes(user.RoleId)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
