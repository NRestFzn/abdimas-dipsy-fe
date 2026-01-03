import { lazy } from "react";

// Fallbacks
export const Unauthorized = lazy(
  () => import("../pages/Fallbacks/Unauthorized")
);
export const NotFound = lazy(() => import("../pages/Fallbacks/NotFound"));

// Auth
export const Login = lazy(() => import("../pages/Auth/Admin/Login"));
export const LoginResident = lazy(() => import ("../pages/Auth/LoginResident"))
export const Register = lazy(() => import("../pages/Auth/Register"));

// Resident
export const Home = lazy(() => import("../pages/Home/Home"));
export const Profile = lazy(() => import("../pages/Profile/Profile"));
export const Quiz = lazy(() => import("../pages/Quiz/Quiz"));
export const Result = lazy(() => import("../pages/Result/Result"));

// Admin General
export const AdminDesaResponden = lazy(
  () => import("../pages/Admin/AdminDesa/Responden/AdminDesaResponden")
);
export const AdminMedisResponden = lazy(
  () => import("../pages/Admin/AdminMedis/Responden/AdminMedisReponden")
);

// Admin Desa Dashboards
export const DesaRwDashboard = lazy(
  () =>
    import("../pages/Admin/AdminDesa/Responden/DesaRwDashboard/DesaRwDashboard")
);
export const DesaRtDashboard = lazy(
  () =>
    import("../pages/Admin/AdminDesa/Responden/DesaRtDashboard/DesaRtDashboard")
);
export const DesaWargaDashboard = lazy(
  () =>
    import(
      "../pages/Admin/AdminDesa/Responden/DesaWargaDashboard/DesaWargaDashboard"
    )
);
export const KelolaWilayah = lazy(
  () => import("../pages/Admin/AdminDesa/KelolaWilayah/KelolaWilayah")
);
export const PreviewResident = lazy(
  () =>
    import("../pages/Admin/AdminDesa/KelolaWilayah/partials/PreviewResident")
);
export const AdminDesaProfile = lazy(
  () => import("../pages/Admin/AdminDesa/ProfileAdmin/ProfileAdmin")
);

// Admin Medis Dashboards
export const RWDashboard = lazy(
  () => import("../pages/Admin/AdminMedis/Responden/RwDashboard/RwDashboard")
);
export const RTDashboard = lazy(
  () => import("../pages/Admin/AdminMedis/Responden/RtDashboard/RTDashboard")
);
export const WargaDashboard = lazy(
  () =>
    import("../pages/Admin/AdminMedis/Responden/WargaDashboard/WargaDashboard")
);
export const Submissions = lazy(
  () => import("../pages/Admin/AdminMedis/Responden/Submissions/Submissions")
);
export const MedisResult = lazy(
  () => import("../pages/Admin/AdminMedis/Responden/MedisResult/MedisResult")
);
export const KuisionerDashboard = lazy(
  () => import("../pages/Admin/AdminMedis/Kuisioner/KuisionerDashborad")
);
export const KuisionerPreview = lazy(
  () => import("../pages/Admin/AdminMedis/Kuisioner/KuisionerPreviews")
);
export const AdminMedisProfile = lazy(
  () => import("../pages/Admin/AdminMedis/ProfileAdmin/ProfileAdmin")
);
