import { Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import type { Questionnaire } from "../../../../types/Questionnaire/questionnaireTypes";

interface KaderHistoryColumnsProps {
    onDetail: (id: string) => void;
    pagination: { page: number; pageSize: number };
}

export const getKaderHistoryColumn = ({
    onDetail,
    pagination,
}: KaderHistoryColumnsProps): ColumnsType<Questionnaire> => [
        {
            title: "No",
            width: 60,
            align: "center",
            render: (_, __, index) =>
                (pagination.page - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Judul Kuesioner",
            dataIndex: "title",
            key: "title",
            render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
        },
        {
            title: "Kategori",
            dataIndex: ["category", "name"],
            key: "category",
            render: (category) => (
                category ? (
                    <Tag color="blue" className="rounded-full px-3">
                        {category}
                    </Tag>
                ) : (
                    <span className="text-gray-400">-</span>
                )
            ),
        },
        {
            title: "Tanggal Dibuat",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (
                <span className="text-gray-600">
                    {dayjs(date).format("DD MMM YYYY, HH:mm")}
                </span>
            ),
        },
        {
            title: "Aksi",
            key: "action",
            align: "center",
            width: 120,
            render: (_, record) => (
                <Button
                    type="text"
                    className="flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => onDetail(record.id)}
                >
                    <Eye size={16} />
                    Detail
                </Button>
            ),
        },
    ];