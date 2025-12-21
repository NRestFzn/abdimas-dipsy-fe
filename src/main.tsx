import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router";
import { lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from "axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import AdminDesaLayout from "./layouts/Admin/AdminDesa/AdminDesaLayout";
import Loading from "./pages/Loading";
import AdminDesa from "./pages/Admin/AdminDesa/Responden/AdminDesaResponden";
import AdminMediLayout from "./layouts/Admin/AdminMedis/AdminMedisLayout";
import KuisionerDashboard from "./pages/Admin/AdminMedis/Kuisioner/KuisionerDashborad";
import KelolaWilayah from "./pages/Admin/AdminDesa/KelolaWilayah/KelolaWilayah";
import Home from "./pages/Home/Home";
import KuisionerPreview from "./pages/Admin/AdminMedis/Kuisioner/KuisionerPreviews";
import { ConfigProvider } from "antd";
import idID from "antd/locale/id_ID";
import Profile from "./pages/Profile/Profile";
import AdminMedisProfile from "./pages/Admin/AdminMedis/ProfileAdmin/ProfileAdmin";
import AdminDesaProfile from "./pages/Admin/AdminDesa/ProfileAdmin/ProfileAdmin";
import ResidentLayout from "./layouts/Resident/MainLayout";
import PreviewResident from "./pages/Admin/AdminDesa/KelolaWilayah/partials/PreviewResident";
import { RoleGuard } from "./components/RoleGuard";
import { ROLE_ID } from "./constants";
import Unauthorized from "./pages/Fallbacks/Unauthorized";
import NotFound from "./pages/Fallbacks/NotFound";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminMedis = lazy(
  () => import("./pages/Admin/AdminMedis/Responden/AdminMedisReponden")
);
const RWDashboard = lazy(
  () => import("./pages/Admin/AdminMedis/Responden/RwDashboard/RwDashboard")
);
const RTDashboard = lazy(
  () => import("./pages/Admin/AdminMedis/Responden/RtDashboard/RTDashboard")
);
const WargaDashboard = lazy(
  () =>
    import("./pages/Admin/AdminMedis/Responden/WargaDashboard/WargaDashboard")
);
const MedisResult = lazy(
  () => import("./pages/Admin/AdminMedis/Responden/MedisResult/MedisResult")
);
const Submissions = lazy(
  () => import("./pages/Admin/AdminMedis/Responden/Submissions/Submissions")
);

const DesaRwDashboard = lazy(
  () =>
    import("./pages/Admin/AdminDesa/Responden/DesaRwDashboard/DesaRwDashboard")
);
const DesaRtDashboard = lazy(
  () =>
    import("./pages/Admin/AdminDesa/Responden/DesaRtDashboard/DesaRtDashboard")
);
const DesaWargaDashboard = lazy(
  () =>
    import(
      "./pages/Admin/AdminDesa/Responden/DesaWargaDashboard/DesaWargaDashboard"
    )
);

const Result = lazy(() => import("./pages/Result/Result"));
const Quiz = lazy(() => import("./pages/Quiz/Quiz"));

axios.defaults.withCredentials = true;

const antdTheme = {
  token: {
    colorPrimary: "#70B748",
    borderRadius: 6,
  },
  components: {
    Input: {
      activeBorderColor: "#70B748",
      hoverBorderColor: "#70B748",
    },
    Button: {
      colorPrimary: "#70B748",
      colorPrimaryHover: "#5a9639",
    },
  },
};

function ProtectedLayout() {
  const token = localStorage.getItem("authToken");
  const { user, isLoading, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Add new logic for multi-tab sync
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

  // Check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (user && !token) {
      logout();
    }
  }, [user, logout, location]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-[#70B748]" size={32} />
        <span className="ml-2 text-gray-600">Memuat...</span>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/masuk" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/masuk",
    element: <Login />,
  },
  {
    path: "/daftar",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<Loading />}>
        <Unauthorized />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: (
          <RoleGuard allowedRoleIds={[ROLE_ID.WARGA]}>
            <ResidentLayout />
          </RoleGuard>
        ),
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/profile",
            element: (
              <Suspense fallback={<Loading />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "/quiz/:id",
            element: <Quiz />,
          },
          {
            path: "/result/:id",
            element: <Result />,
          },
        ],
      },
      // Admin routes - Home page
      {
        path: "admin",
        element: (
          <RoleGuard allowedRoleIds={[ROLE_ID.ADMIN_DESA]}>
            <AdminDesaLayout />
          </RoleGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="responden" replace />,
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<Loading />}>
                <AdminDesaProfile />
              </Suspense>
            ),
          },
          // Responden Routes
          {
            path: "responden",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Loading />}>
                    <AdminDesa />
                  </Suspense>
                ),
              },
              {
                path: ":questionnaireId",
                element: (
                  <Suspense fallback={<Loading />}>
                    <DesaRwDashboard />
                  </Suspense>
                ),
              },
              {
                path: ":questionnaireId/:rwId",
                element: (
                  <Suspense fallback={<Loading />}>
                    <DesaRtDashboard />
                  </Suspense>
                ),
              },
              {
                path: ":questionnaireId/:rwId/:rtId",
                element: (
                  <Suspense fallback={<Loading />}>
                    <DesaWargaDashboard />
                  </Suspense>
                ),
              },
            ],
          },
          // Kelola Wilayah Routes
          {
            path: "kelola-wilayah",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Loading />}>
                    <KelolaWilayah />
                  </Suspense>
                ),
              },
              {
                path: "kelola-wilayah",
                element: (
                  <Suspense fallback={<Loading />}>
                    <KelolaWilayah />
                  </Suspense>
                ),
              },
              {
                path: "preview-warga/:residentId",
                element: (
                  <Suspense fallback={<Loading />}>
                    <PreviewResident />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // Admin Medis routes - Home page
      {
        path: "/admin-medis",
        element: (
          <RoleGuard allowedRoleIds={[ROLE_ID.ADMIN_MEDIS]}>
            <AdminMediLayout />
          </RoleGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="responden" replace />,
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<Loading />}>
                <AdminMedisProfile />
              </Suspense>
            ),
          },
          // Responden Routes
          {
            path: "responden",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Loading />}>
                    <AdminMedis />
                  </Suspense>
                ),
              },
              {
                path: ":questionnaireId",
                element: (
                  <Suspense fallback={<Loading />}>
                    <RWDashboard />
                  </Suspense>
                ),
              },
              {
                path: ":questionnaireId/:rwId",
                element: (
                  <Suspense fallback={<Loading />}>
                    <RTDashboard />
                  </Suspense>
                ),
              },
              {
                path: ":questionnaireId/:rwId/:rtId",
                element: <WargaDashboard />,
              },
              {
                path: "submissions/:questionnaireId/:rwId/:rtId/:userId",
                element: <Submissions />,
              },
              {
                path: "result/:questionnaireId/:rwId/:rtId/:userId",
                element: <MedisResult />,
              },
              {
                path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history/tes",
                element: <Result />,
              },
            ],
          },
          // Kelola RW Routes
          {
            path: "/admin-medis/kuisioner",
            element: <KuisionerDashboard />,
          },
          {
            path: "/admin-medis/kuisioner/:questionnaireId/preview",
            element: <KuisionerPreview />,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConfigProvider theme={antdTheme} locale={idID}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);
