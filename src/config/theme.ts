import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
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