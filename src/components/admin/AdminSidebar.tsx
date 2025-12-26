import { Link, useLocation } from "react-router";
import { File, FileHeartIcon, HouseIcon } from "lucide-react";

interface SidebarItemProps {
    label: string;
    path: string;
    icon: React.ElementType;
}

export default function AdminSideBar({ responsiveSidebar }: { responsiveSidebar: boolean }) {
    const location = useLocation();
    const pathname = location.pathname;

    const isAdminMedis = pathname.startsWith("/admin-medis");

    const menuItems: SidebarItemProps[] = [
        {
            label: "Responden",
            path: isAdminMedis ? "/admin-medis/responden" : "/admin/responden",
            icon: FileHeartIcon,
        },
        {
            label: isAdminMedis ? "Kuisioner" : "Kelola Wilayah",
            path: isAdminMedis ? "/admin-medis/kuisioner" : "/admin/kelola-wilayah",
            icon: isAdminMedis ? File : HouseIcon,
        }
    ];

    return (
        <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.path);

                return (
                    <Link key={item.path} to={item.path} className="block">
                        <div
                            className={`
                                flex items-center gap-[20px] p-[10px] rounded-[8px] transition-all duration-200
                                ${responsiveSidebar ? "justify-center" : "justify-start"}
                                ${isActive 
                                    ? "bg-[#f0f7e9] text-[#70B748]" 
                                    : "bg-transparent text-zinc-600 hover:text-[#70B748] hover:bg-gray-50"
                                }
                            `}
                        >
                            <item.icon className="w-6 h-6 shrink-0" />
                            
                            {!responsiveSidebar && (
                                <span className="text-base font-medium whitespace-nowrap animate-in fade-in duration-300">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}