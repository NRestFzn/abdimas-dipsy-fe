import { Button, Tooltip } from "antd";
import { Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { RukunTetangga } from "../../../../../types/adminDesaService";

interface RTColumnProps {
    onDelete: (record: RukunTetangga) => void;
}

export const getRTColumns = ({ onDelete }: RTColumnProps): ColumnsType<RukunTetangga> => [
    {
        title: 'No',
        key: 'index',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Nama RT',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        render: (text) => <span className="font-medium">RT {String(text).padStart(2, '0')}</span>,
    },
    {
        title: 'Total Warga',
        dataIndex: 'userCount',
        key: 'userCount',
        align: 'center',
        render: (count) => <span className="text-gray-600">{count} Warga</span>
    },
    {
        title: 'Aksi',
        key: 'action',
        align: 'center',
        width: 100,
        render: (_, record) => (
            <Tooltip title="Hapus RT">
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