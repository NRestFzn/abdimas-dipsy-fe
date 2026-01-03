import { Button, Dropdown, Modal, Tag, type MenuProps } from "antd";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { ResidentData } from "../../../../../types/Resident/residentType";


interface ResidentColumnProps {
    pagination: { current: number; pageSize: number };
    onViewDetail: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const getResidentColumns = ({
    pagination,
    onViewDetail,
    onDelete,
    onEdit
}: ResidentColumnProps): ColumnsType<ResidentData> => [
        {
            title: 'No',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Nama Lengkap',
            dataIndex: 'fullname',
            key: 'fullname',
            sorter: true,
            render: (text) => <span className="font-medium text-gray-700">{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Jenis Kelamin',
            dataIndex: 'gender',
            key: 'gender',
            width: 120,
            align: 'center',
            render: (gender: string) => (
                <Tag color={gender === 'm' ? 'blue' : 'magenta'}>
                    {gender === 'm' ? 'Laki-laki' : 'Perempuan'}
                </Tag>
            ),
        },
        {
            title: 'NIK',
            key: 'nik',
            render: (_, record) => record.userDetail?.nik || "-",
        },
        {
            title: 'Aksi',
            key: 'action',
            align: 'center',
            width: 100,
            render: (_, record) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'view',
                        label: 'Lihat Detail',
                        icon: <Eye size={16} />,
                        onClick: () => onViewDetail(record.id),
                    },
                    {
                        key: 'edit',
                        label: 'Edit Data',
                        icon: <Edit size={16} />,
                        onClick: () => onEdit(record.id),
                    },
                    {
                        type: 'divider',
                    },
                    {
                        key: 'delete',
                        label: 'Hapus',
                        icon: <Trash2 size={16} />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Hapus Warga?',
                                content: `Apakah Anda yakin ingin menghapus data warga "${record.fullname}"? Tindakan ini tidak dapat dibatalkan.`,
                                okText: 'Ya, Hapus',
                                okType: 'danger',
                                cancelText: 'Batal',
                                onOk: () => onDelete(record.id),
                            });
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                        <Button
                            type="text"
                            icon={<MoreVertical size={18} className="text-gray-500" />}
                        />
                    </Dropdown>
                );
            },
        },
    ];