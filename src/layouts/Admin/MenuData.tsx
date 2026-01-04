import { Database, File, FileHeartIcon, HouseIcon, Tags } from "lucide-react";

interface SidebarItemProps {
    key: string;
    label: string;
    path: string;
    icon: React.ElementType;
    children?: SidebarItemProps[];
}

export const ADMIN_DESA_MENU: SidebarItemProps[] = [
    {
        key: 'responden',
        label: "Responden",
        path: "/admin/responden",
        icon: FileHeartIcon,
    },
    {
        key: 'wilayah',
        label: "Kelola Wilayah",
        path: "/admin/kelola-wilayah",
        icon: HouseIcon,
    },
];

export const ADMIN_MEDIS_MENU: SidebarItemProps[] = [
    {
        key: 'responden',
        label: "Responden",
        path: "/admin-medis/responden",
        icon: FileHeartIcon,
    },
    {
        key: 'kuisioner',
        label: "Kuisioner",
        path: "/admin-medis/kuisioner",
        icon: File,
    },
    {
        key: 'master-data',
        label: "Master Data",
        path: "#",
        icon: Database,
        children: [
            {
                key: 'kategori',
                label: "Kategori",
                path: "/admin-medis/kategori",
                icon: Tags,
            },
        ]
    },
];