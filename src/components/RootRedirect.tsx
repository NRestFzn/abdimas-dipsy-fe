import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ROLE_ID } from "../constants";
import Loading from "../pages/Loading";

export const RootRedirect = () => {
  const { user, isLoadingUser, activeRole } = useAuth();

  if (isLoadingUser) return <Loading />;

  if (!user || !activeRole) return null;

  const currentRoleId = String(activeRole.id);

  if (currentRoleId === ROLE_ID.ADMIN_DESA) {
    return <Navigate to="/admin" replace />;
  }

  if (currentRoleId === ROLE_ID.ADMIN_MEDIS) {
    return <Navigate to="/admin-medis" replace />;
  }

  if (currentRoleId === ROLE_ID.KADER) {
    return <Navigate to="/kader" replace />;
  }

  if (currentRoleId === ROLE_ID.KEPALA_KELUARGA) {
    return <Navigate to="/keluarga" replace />;
  }

  if (currentRoleId === ROLE_ID.WARGA) {
    return null;
  }

  return <Navigate to="/unauthorized" replace />;
};