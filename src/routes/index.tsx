import { createBrowserRouter, Navigate } from "react-router";
import { Suspense, type ComponentType, type LazyExoticComponent, } from "react";
import Loading from "../pages/Loading";
import ProtectedLayout from "../layouts/ProtectedLayout";
import ResidentLayout from "../layouts/Resident/MainLayout";
import AdminDesaLayout from "../layouts/Admin/AdminDesa/AdminDesaLayout";
import AdminMediLayout from "../layouts/Admin/AdminMedis/AdminMedisLayout";
import { RoleGuard } from "../components/RoleGuard";
import { ROLE_ID } from "../constants";
import * as Pages from "./lazyImports";
import { RootRedirect } from "../components/RootRedirect";

interface LoadableProps {
  Component: LazyExoticComponent<ComponentType<any>>;
}

const Loadable = ({ Component }: LoadableProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

const router = createBrowserRouter([
  { path: "/masuk-admin", element: <Loadable Component={Pages.Login} /> },
  { path: "/masuk", element: <Loadable Component={Pages.LoginResident} /> },
  { path: "/daftar", element: <Loadable Component={Pages.Register} /> },
  {
    path: "/unauthorized",
    element: <Loadable Component={Pages.Unauthorized} />,
  },
  { path: "*", element: <Loadable Component={Pages.NotFound} /> },

  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        element: (
          <RoleGuard allowedRoleIds={[ROLE_ID.WARGA, ROLE_ID.KADER]}>
            <ResidentLayout />
          </RoleGuard>
        ),
        children: [
          {
            path: "pilih-peran",
            element: <Loadable Component={Pages.RoleSelection} />,
          },
          {
            index: true, element: (
              <>
                <RootRedirect />
                <Loadable Component={Pages.Home} />
              </>
            )
          },
          {
            path: "kader",
            element: (
              <RoleGuard allowedRoleIds={[ROLE_ID.KADER]}>
                <Loadable Component={Pages.HomeKader} />
              </RoleGuard>
            ),
          },
          { path: "summary-rw/:questionnaireId/:rwId", element: <Loadable Component={Pages.SummaryRWDashboard} /> },
          { path: "summary-rt/:questionnaireId/:rwId/:rtId", element: <Loadable Component={Pages.SummaryRTDashboard} /> },
          { path: "profile", element: <Loadable Component={Pages.Profile} /> },
          { path: "quiz/:id", element: <Loadable Component={Pages.Quiz} /> },
          {
            path: "result/:id",
            element: <Loadable Component={Pages.Result} />,
          },
        ],
      },

      {
        path: "admin",
        element: (
          <RoleGuard allowedRoleIds={[ROLE_ID.ADMIN_DESA]} loginPath="/masuk-admin">
            <AdminDesaLayout />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <Navigate to="responden" replace /> },
          {
            path: "profile",
            element: <Loadable Component={Pages.AdminDesaProfile} />,
          },
          {
            path: "responden",
            children: [
              {
                index: true,
                element: <Loadable Component={Pages.AdminDesaResponden} />,
              },
              {
                path: ":questionnaireId",
                element: <Loadable Component={Pages.DesaRwDashboard} />,
              },
              {
                path: ":questionnaireId/:rwId",
                element: <Loadable Component={Pages.DesaRtDashboard} />,
              },
              {
                path: ":questionnaireId/:rwId/:rtId",
                element: <Loadable Component={Pages.DesaWargaDashboard} />,
              },
            ],
          },
          {
            path: "kelola-wilayah",
            children: [
              {
                index: true,
                element: <Loadable Component={Pages.KelolaWilayah} />,
              },
              {
                path: "preview-warga/:residentId",
                element: <Loadable Component={Pages.PreviewResident} />,
              },
            ],
          },
        ],
      },

      {
        path: "/admin-medis",
        element: (
          <RoleGuard allowedRoleIds={[ROLE_ID.ADMIN_MEDIS]}>
            <AdminMediLayout />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <Navigate to="responden" replace /> },
          {
            path: "profile",
            element: <Loadable Component={Pages.AdminMedisProfile} />,
          },
          {
            path: "kuisioner",
            element: <Loadable Component={Pages.KuisionerDashboard} />,
          },
          {
            path: "kuisioner/:questionnaireId/preview",
            element: <Loadable Component={Pages.KuisionerPreview} />,
          },
          {
            path: "master-data",
            children: [
              {
                path: "category",
                element: <Loadable Component={Pages.AdminMedisCategory} />,
              }
            ]
          },
          {
            path: "responden",
            children: [
              {
                index: true,
                element: <Loadable Component={Pages.AdminMedisResponden} />,
              },
              {
                path: ":questionnaireId",
                element: <Loadable Component={Pages.RWDashboard} />,
              },
              {
                path: ":questionnaireId/:rwId",
                element: <Loadable Component={Pages.RTDashboard} />,
              },
              {
                path: ":questionnaireId/:rwId/:rtId",
                element: <Loadable Component={Pages.WargaDashboard} />,
              },
              {
                path: "submissions/:questionnaireId/:rwId/:rtId/:userId",
                element: <Loadable Component={Pages.Submissions} />,
              },
              {
                path: "result/:submissionId",
                element: <Loadable Component={Pages.MedisResult} />,
              },
              {
                path: ":rwId/:rtId/:keluargaId/history/tes",
                element: <Loadable Component={Pages.Result} />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
