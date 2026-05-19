import { Avatar, Dropdown, Tag, type MenuProps } from "antd";
import { ChevronDown, LogOut, SwitchCamera, User } from "lucide-react";
import type { Role, UserMeResponse } from "../../../types/AuthTypes/authTypes";
import { ROLE_ID } from "../../../constants";
import { useNavigate } from "react-router";

interface HeaderProps {
  fullname: string;
  profileUrl?: string;
  onLogout: () => void;
  activeRole: Role;
  switchRole: (role: Role) => void
  user: UserMeResponse
}

export const HomeHeader = ({ fullname, onLogout, profileUrl, activeRole, user }: HeaderProps) => {
  const navigate = useNavigate();

  const getRoleLabel = () => {
    if (activeRole?.id === ROLE_ID.KADER) return "Petugas Kader";
    if (activeRole?.id === ROLE_ID.KEPALA_KELUARGA) return "Kepala Keluarga";
    if (activeRole?.id === ROLE_ID.WARGA) return "Warga Desa";
    return "User";
  };

  const getRoleColor = () => {
    if (activeRole?.id === ROLE_ID.KADER) return "blue";
    if (activeRole?.id === ROLE_ID.KEPALA_KELUARGA) return "gold";
    return "green";
  };

  const getRoleTextClass = () => {
    if (activeRole?.id === ROLE_ID.KADER) return "text-blue-500";
    if (activeRole?.id === ROLE_ID.KEPALA_KELUARGA) return "text-amber-500";
    return "text-green-600";
  };

  const getAvatarClass = () => {
    if (activeRole?.id === ROLE_ID.KADER) return "bg-blue-100 text-blue-600 border-blue-200";
    if (activeRole?.id === ROLE_ID.KEPALA_KELUARGA) return "bg-amber-100 text-amber-600 border-amber-200";
    return "bg-green-100 text-green-600 border-green-200";
  };

  const items: MenuProps['items'] = [
    {
      key: 'role-info',
      label: (
        <div className="flex flex-col px-1 py-1 cursor-default">
          <span className="text-xs text-gray-400 font-medium">Masuk sebagai</span>
          <Tag color={getRoleColor()} className="!mt-1 !w-fit !border-none !px-2 !py-0.5 !font-semibold">
            {getRoleLabel()}
          </Tag>
        </div>
      ),
      disabled: true,
    },
    {
      key: "profile",
      label: "Lihat Profil Saya",
      icon: <User size={16} />,
      onClick: () => navigate("/profile"),
    },
    {
      type: 'divider',
    },
    ...(user?.roles && user.roles.length > 1 ? [
      {
        key: 'switch-role',
        label: <span className="text-gray-600 font-medium">Ganti Peran</span>,
        icon: <SwitchCamera size={16} className="text-gray-500" />,
        onClick: () => navigate("/pilih-peran"),
      },
      { type: 'divider' } as any,
    ] : []),
    {
      key: 'logout',
      label: <span className="text-red-600 font-medium">Logout</span>,
      icon: <LogOut size={16} className="text-red-500" />,
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
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight" arrow>
              <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 transition-colors">

                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-700 leading-tight">
                    {fullname}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${getRoleTextClass()}`}>
                    {getRoleLabel()}
                  </span>
                </div>

                <Avatar
                  src={profileUrl}
                  icon={!profileUrl && <User size={20} />}
                  className={`flex-shrink-0 border-2 ${getAvatarClass()}`}
                  size={40}
                />

                <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};
