import { lazy } from "react";

// Fallbacks
export const Unauthorized = lazy(
  () => import("../pages/Fallbacks/Unauthorized")
);
export const NotFound = lazy(() => import("../pages/Fallbacks/NotFound"));

// Auth
export const Login = lazy(() => import("../pages/Auth/Admin/Login"));
export const LoginResident = lazy(() => import("../pages/Auth/Resident/LoginResident"))
export const Register = lazy(() => import("../pages/Auth/Resident/Register"));

// Resident
export const RoleSelection = lazy(() => import("../pages/Auth/Resident/RoleSelection"));
export const HomeKader = lazy(() => import("../pages/Resident/Kader/HomeKader"));
export const Home = lazy(() => import("../pages/Resident/Home/Home"));
export const Profile = lazy(() => import("../pages/Resident/Profile/Profile"));
export const Quiz = lazy(() => import("../pages/Resident/Quiz/Quiz"));
export const Result = lazy(() => import("../pages/Resident/Result/Result"));
export const SummaryRWDashboard = lazy(() => import("../pages/Resident/Kader/Summary/RWSummaryDashboard"));
export const SummaryRTDashboard = lazy(() => import("../pages/Resident/Kader/Summary/RTSummaryDashboard"));

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
export const AdminMedisCategory = lazy(
  () => import("../pages/Admin/AdminMedis/MasterData/Category/CategoryPage")
);
