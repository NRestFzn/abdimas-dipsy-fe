import { Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye } from "lucide-react";
import type { Questionnaire } from "../../../../types/Questionnaire/questionnaireTypes";

interface ColumnProps {
    pagination: { current: number; pageSize: number; };
    onSeeDetail: (id: string) => void
}

export const getAdminDesaColumns = ({ pagination, onSeeDetail }: ColumnProps): ColumnsType<Questionnaire> => [
    {
        title: "No",
        key: "index",
        width: 70,
        align: "center",
        render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
        title: "Judul Kuisioner",
        dataIndex: "title",
        key: "title",
        render: (text) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
        title: "Deskripsi",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        render: (status: string) => {
            let color = "default";
            if (status === "publish" || status === "published") color = "success";
            if (status === "draft") color = "warning";
            if (status === "archived") color = "error";

            return <Tag color={color}>{status.toUpperCase()}</Tag>;
        },
    },
    {
        title: "Threshold",
        dataIndex: "riskThreshold",
        key: "riskThreshold",
        align: "center",
        width: 100,
        render: (val) => val ?? "-",
    },
    {
        title: "Dibuat Pada",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        render: (date) => new Date(date).toLocaleDateString("id-ID", {
            day: 'numeric', month: 'short', year: 'numeric'
        }),
    },
    {
        title: "Aksi",
        key: "action",
        width: 150,
        render: (_, record) => (
            <Space>
                <Button
                    icon={<Eye size={16} />}
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSeeDetail(record.id)
                    }}
                >Lihat Detail</Button>
            </Space>
        ),
    },
];