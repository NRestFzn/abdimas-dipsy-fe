import { Tag, Button, Space } from "antd";
import { Eye } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { Questionnaire } from "../../../../../types/Questionnaire/questionnaireTypes";

interface ColumnProps {
    pagination: { current: number; pageSize: number };
    onSee: (id: string) => void;
}

export const getQuestionnaireColumns = ({
    pagination,
    onSee,
}: ColumnProps): ColumnsType<Questionnaire> => [
        {
            title: "No",
            key: "index",
            width: 70,
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
            title: "Kategori",
            dataIndex: ["category", "name"],
            key: "category",
            render: (value) => {
                return (
                    <Tag color="blue">{value || "-"}</Tag>
                )
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "default";
                if (status === "published" || status === "publish") color = "green";
                if (status === "draft") color = "orange";
                if (status === "archived") color = "red";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Dibuat Pada",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString("id-ID"),
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
                            onSee(record.id)
                        }}
                    >Lihat Detail</Button>
                </Space>
            ),
        },
    ];