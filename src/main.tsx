import {
  RouterProvider,
} from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import idID from "antd/locale/id_ID";
import router from "./routes";

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
