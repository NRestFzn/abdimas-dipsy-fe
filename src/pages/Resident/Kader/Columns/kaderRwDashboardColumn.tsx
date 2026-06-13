import { Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface KaderRTDataRow {
    rtId: string;
    rtName: number | string;
    userCount: number;
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
}

interface RtColumnProps {
    onSeeDetail: (rtId: string) => void;
}

export const getKaderRwDashboardColumn = ({
    onSeeDetail
}: RtColumnProps): ColumnsType<KaderRTDataRow> => [
        {
            title: 'Nama RT',
            dataIndex: 'rtName',
            key: 'rtName',
            render: (text) => <span className="font-medium text-gray-700">RT {text}</span>,
        },
        {
            title: 'Total Warga',
            dataIndex: 'userCount',
            key: 'userCount',
            align: 'center',
        },
        {
            title: 'Pengisian Kuisioner',
            dataIndex: 'submitCount',
            key: 'submitCount',
            align: 'center',
        },
        {
            title: 'Resiko Gangguan', // Label disesuaikan agar lebih ramah
            dataIndex: 'unStableMentalPercentage',
            key: 'unStableMentalPercentage',
            align: 'center',
            render: (percentage: number) => {
                let color = "success";
                let label = "Rendah";

                if (percentage >= 70) {
                    color = "error";
                    label = "Tinggi";
                } else if (percentage >= 40) {
                    color = "warning";
                    label = "Sedang";
                }

                return (
                    <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold">{percentage}%</span>
                        <Tag color={color} className="m-0 min-w-[60px] text-center">
                            {label}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: 'Aksi',
            key: 'aksi',
            align: 'center',
            width: 120,
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    className="!bg-[#70B748] !hover:bg-[#5a9639] border-none"
                    onClick={() => onSeeDetail(record.rtId)}
                >
                    Lihat
                </Button>
            ),
        },
    ];
