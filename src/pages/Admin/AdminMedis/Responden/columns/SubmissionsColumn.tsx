import { Button, Tag } from "antd";
import { Eye } from "lucide-react";
import type { ColumnsType } from "antd/es/table";

export interface SubmissionRow {
    submissionId: string;
    submissionDate: string;
    trueCount: string;
    isMentalUnStable: number;
}

interface SubmissionColumnProps {
    onViewDetail: (submissionId: string) => void;
}

export const getSubmissionsColumns = ({ 
    onViewDetail 
}: SubmissionColumnProps): ColumnsType<SubmissionRow> => [
    {
        title: 'No',
        key: 'index',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Tanggal Tes',
        dataIndex: 'submissionDate',
        key: 'submissionDate',
        render: (date) => (
            <div className="flex flex-col">
                <span className="font-medium text-gray-700">
                    {new Date(date).toLocaleDateString("id-ID", { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                </span>
                <span className="text-xs text-gray-400">
                    {new Date(date).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                </span>
            </div>
        ),
    },
    {
        title: 'Kondisi Mental',
        dataIndex: 'isMentalUnStable',
        key: 'isMentalUnStable',
        align: 'center',
        render: (isUnstable: number) => {
            const color = isUnstable === 1 ? "error" : "success";
            const text = isUnstable === 1 ? "Beresiko" : "Stabil";
            
            return (
                <Tag color={color} className="min-w-[80px] text-center py-1 text-sm">
                    {text}
                </Tag>
            );
        },
    },
    {
        title: 'Aksi',
        key: 'action',
        align: 'center',
        width: 120,
        render: (_, record) => (
            <Button 
                type="primary"
                size="small"
                className="!bg-[#70B748] !hover:bg-[#5a9639] border-none flex items-center gap-1 mx-auto"
                onClick={() => onViewDetail(record.submissionId)}
            >
                <Eye size={14} /> Detail
            </Button>
        ),
    },
];