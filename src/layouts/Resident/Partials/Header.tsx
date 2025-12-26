import { Avatar, Dropdown, type MenuProps } from "antd";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  fullname: string;
  profileUrl?: string;
  onLogout: () => void;
}

export const HomeHeader = ({ fullname, onLogout, profileUrl }: HeaderProps) => {
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Lihat Profil Saya",
      icon: <User size={16} />,
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Keluar",
      icon: <LogOut size={16} />,
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-99">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 object-contain"
            src="/icon.png"
            alt="Logo"
          />
          <span className="text-lg font-bold text-[#70B748] hidden sm:block">
            Desa Cibiru Wetan
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 group">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-gray-700 group-hover:text-[#70B748] transition-colors">
                    {fullname}
                  </div>
                  <div className="text-xs text-gray-500">Warga</div>
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
      </div>
    </header>
  );
};
