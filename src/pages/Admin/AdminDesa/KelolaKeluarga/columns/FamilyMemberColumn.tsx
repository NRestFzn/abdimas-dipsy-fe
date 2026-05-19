import type { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Tag } from "antd";
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
                <Tag color="blue">Kepala Keluarga</Tag>
            ) : (
                <Tag>Anggota</Tag>
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
                    description="Keluarkan anggota ini dari keluarga?"
                    onConfirm={() => onRemove(record.UserId)}
                    okText="Ya"
                    cancelText="Batal"
                    okButtonProps={{ danger: true }}
                >
                    <Button type="text" danger icon={<Trash2 size={16} />} />
                </Popconfirm>
            );
        },
    },
];
