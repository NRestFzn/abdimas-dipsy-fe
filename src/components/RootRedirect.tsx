import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ROLE_ID } from "../constants";
import Loading from "../pages/Loading";

export const RootRedirect = () => {
  const { user, isLoadingUser, activeRole } = useAuth();

  if (isLoadingUser) return <Loading />;

  if (!user || !activeRole) return null;

  if (activeRole.id === ROLE_ID.ADMIN_DESA) {
    return <Navigate to="/admin" replace />;
  }

  if (activeRole.id === ROLE_ID.ADMIN_MEDIS) {
    return <Navigate to="/admin-medis" replace />;
  }

  if (activeRole.id === ROLE_ID.KADER) {
    return <Navigate to="/pilih-peran" replace />;
  }

  if (activeRole.id === ROLE_ID.WARGA) {
    return null;
  }

  return <Navigate to="/unauthorized" replace />;
};