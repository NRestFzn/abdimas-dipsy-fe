import { Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface WargaDesa {
    id: string;
    nik: string;
    user: {
        fullname: string;
    };
}

interface WargaMedis {
    UserId: string;
    fullname: string;
    lastSubmissionDate: string;
}

interface DesaColumnProps {
    rwName: string;
    rtName: string;
}

export const getWargaDesaColumns = ({ rwName, rtName }: DesaColumnProps): ColumnsType<WargaDesa> => [
    {
        title: 'No',
        key: 'index',
        width: 60,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Nama',
        dataIndex: ['user', 'fullname'],
        key: 'fullname',
        render: (text) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
        title: 'NIK',
        dataIndex: 'nik',
        key: 'nik',
    },
    {
        title: 'Alamat',
        key: 'alamat',
        render: () => <span className="text-gray-500">{rwName} {rtName}</span>,
    }
];

interface MedisColumnProps {
    onSeeDetail: (UserId: string) => void;
}

export const getWargaMedisColumns = ({ onSeeDetail }: MedisColumnProps): ColumnsType<WargaMedis> => [
    {
        title: 'No',
        key: 'index',
        width: 60,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Nama',
        dataIndex: 'fullname',
        key: 'fullname',
        render: (text) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
        title: 'Kondisi Mental',
        dataIndex: 'isMentalUnStable',
        key: 'isMentalUnStable',
        render: (condition) => {
            let color = "success"
            let label = "Beresiko"

            if (condition) {
                color = "error"
                label = "Beresiko"
            } else {
                color = "success"
                label = "Stabil"
            }

            return (
                <Tag color={color} className="m-0 text-center">
                    {label}
                </Tag>
            )
        },
    },
    {
        title: 'Terakhir Submit',
        dataIndex: 'lastSubmissionDate',
        key: 'lastSubmissionDate',
        render: (date) => (
            <div className="flex flex-col text-sm">
                <span className="font-medium">
                    {new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                <span className="text-gray-400 text-xs">
                    {new Date(date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
        ),
    },
    {
        title: 'Aksi',
        key: 'action',
        align: 'center',
        width: 100,
        render: (_, record) => (
            <Button
                type="primary"
                size="small"
                className="!bg-[#70B748] !hover:bg-[#5a9639] border-none"
                onClick={() => onSeeDetail(record.UserId)}
            >
                Lihat
            </Button>
        ),
    },
];