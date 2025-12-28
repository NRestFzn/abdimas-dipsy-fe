import { Button, Tooltip } from "antd";
import { Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { RukunWarga } from "../../../../../types/adminDesaService";

interface RWColumnProps {
    onDelete: (record: RukunWarga) => void;
}

export const getRWColumns = ({ onDelete }: RWColumnProps): ColumnsType<RukunWarga> => [
    {
        title: 'No',
        key: 'index',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Nama RW',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        render: (text) => <span className="font-medium">RW {text}</span>,
    },
    {
        title: 'Jumlah RT',
        key: 'rtCount',
        dataIndex: 'rtCount',
        align: 'center',
    },
    {
        title: 'Aksi',
        key: 'action',
        align: 'center',
        width: 100,
        render: (_, record) => (
            <Tooltip title="Hapus RW">
                <Button
                    danger
                    size="small"
                    icon={<Trash2 size={16} />}
                    onClick={() => onDelete(record)}
                />
            </Tooltip>
        ),
    },
];