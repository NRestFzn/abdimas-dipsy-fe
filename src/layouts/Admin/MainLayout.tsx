import { Avatar, Dropdown, Layout, type MenuProps } from "antd";
import { ChevronDown, Heart, User } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useAdminMedisProfile } from "../../hooks/useAdminMedis";
import { getImageUrl } from "../../utils/imageHelper";

const { Header } = Layout;

const items: MenuProps["items"] = [
  {
    key: "profile-key",
    label: "Lihat Profil Saya",
    icon: <User size={16} />,
  },
  {
    type: "divider",
  },
  {
    key: "logout-btn",
    danger: true,
    label: "Logout",
    icon: <RiLogoutCircleRLine className="w-5 h-5" />,
  },
];

const ProfileComponent = () => {
  const { logout } = useAuth();

  const { data } = useAdminMedisProfile();

  const role = data?.data?.role?.name;
  const fullname = data?.data?.fullname;
  const profileUrl = getImageUrl(data?.data?.profilePicture);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/masuk");
  };

  const onMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout-btn") {
      handleLogout();
    } else if (e.key === "profile-key") {
      navigate(`/${role === "admin medis" ? "admin-medis" : "admin"}/profile`);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-4">
        <Dropdown
          menu={{ items, onClick: onMenuClick }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 group">
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-gray-700 group-hover:text-[#70B748] transition-colors">
                {fullname || "User"}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {role || "Role"}
              </div>
            </div>

            <Avatar
              size="large"
              src={profileUrl}
              className="bg-gray-200 text-gray-600 group-hover:bg-[#70B748] group-hover:text-white transition-colors"
            >
              {fullname?.charAt(0)?.toUpperCase() || <User />}
            </Avatar>

            <ChevronDown
              size={16}
              className="text-gray-400 group-hover:text-[#70B748] transition-colors"
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  startAction: ReactNode;
}

function MainLayout(props: MainLayoutProps) {
  const { children, title, startAction } = props;

  return (
    <Layout className="h-screen w-screen overflow-hidden">
      <Header className="w-full !bg-white text-white flex justify-between items-center !px-4 !py-3 !md:p-[20px] !shadow-sm z-20 relative h-auto min-h-[64px]">
        <section className="flex items-center gap-3">
          {startAction && <div>{startAction}</div>}

          {!startAction && (
            <a
              className="flex items-center space-x-2 md:space-x-4 cursor-pointer"
              href="/"
            >
              <Heart className="fill-[#70B748] text-[#70B748] w-8 h-8 md:w-10 md:h-10 shrink-0" />
              <div className="text-[#70B748] text-base md:text-lg lg:text-[24px] font-bold leading-tight">
                {title}
              </div>
            </a>
          )}
        </section>
        <ProfileComponent />
      </Header>
      <Layout className="h-full overflow-hidden">{children}</Layout>
    </Layout>
  );
}

export default MainLayout;
