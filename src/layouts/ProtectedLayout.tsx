import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router"; // Sesuaikan import react-router-dom
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout() {
  const token = localStorage.getItem("authToken");
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken" && !event.newValue) {
        logout();
        navigate("/masuk");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout, navigate]);

  useEffect(() => {
    if (user && !token) {
      logout();
    }
  }, [user, token, logout]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-[#70B748]" size={32} />
        <span className="ml-2 text-gray-600 font-medium">Memuat...</span>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/masuk" state={{ from: location }} replace />;
  }

  return <Outlet />;
}