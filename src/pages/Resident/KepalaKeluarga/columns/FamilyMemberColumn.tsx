import type { ColumnsType } from "antd/es/table";
import { Button, Popconfirm } from "antd";
import { Trash2 } from "lucide-react";

interface Props {
    headOfFamilyId?: string;
    onRemove: (userId: string) => void;
}

export const getFamilyMemberColumns = ({ headOfFamilyId, onRemove }: Props): ColumnsType<any> => [
    {
        title: "Nama Lengkap",
        dataIndex: ["user", "fullname"],
        key: "fullname",
    },
    {
        title: "Email",
        dataIndex: ["user", "email"],
        key: "email",
    },
    {
        title: "Status",
        key: "status",
        render: (_: any, record: any) =>
            record.UserId === headOfFamilyId ? (
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-semibold">
                    Kepala Keluarga
                </span>
            ) : (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-semibold">
                    Anggota
                </span>
            ),
    },
    {
        title: "Aksi",
        key: "action",
        render: (_: any, record: any) => {
            if (record.UserId === headOfFamilyId) return null;
            return (
                <Popconfirm
                    title="Hapus anggota"
                    description="Apakah anda yakin ingin menghapus anggota ini dari keluarga?"
                    onConfirm={() => onRemove(record.UserId)}
                    okText="Ya"
                    cancelText="Tidak"
                    okButtonProps={{ danger: true }}
                >
                    <Button type="text" danger icon={<Trash2 size={16} />} />
                </Popconfirm>
            );
        },
    },
];
