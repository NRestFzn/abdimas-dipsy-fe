import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ROLE_ID } from "../constants";
import Loading from "../pages/Loading";

export const RootRedirect = () => {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) return <Loading />;

  if (!user) return null;

  if (user.RoleId === ROLE_ID.ADMIN_DESA) {
    return <Navigate to="/admin" replace />;
  }

  if (user.RoleId === ROLE_ID.ADMIN_MEDIS) {
    return <Navigate to="/admin-medis" replace />;
  }

  if (user.RoleId === ROLE_ID.WARGA) {
    return null; 
  }

  return <Navigate to="/unauthorized" replace />;
};