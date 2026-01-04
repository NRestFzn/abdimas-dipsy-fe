import { Button } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { QuestionnaireCategory } from "../../../../../../types/Questionnaire/questionnaireTypes";

interface GetCategoryColumnsProps {
    pagination: { current: number; pageSize: number };
    onEdit: (record: QuestionnaireCategory) => void;
    onDelete: (id: string, name: string) => void;
}

export const getCategoryColumns = ({
    pagination,
    onEdit,
    onDelete,
}: GetCategoryColumnsProps): ColumnsType<QuestionnaireCategory> => [
        {
            title: "No",
            key: "index",
            width: 70,
            align: "center",
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Nama Kategori",
            dataIndex: "name",
            key: "name",
            sorter: true,
            render: (text) => <span className="font-medium text-gray-800">{text}</span>,
        },
        {
            title: "Dibuat Pada",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (date) => new Date(date).toLocaleDateString("id-ID", {
                day: 'numeric', month: 'long', year: 'numeric'
            }),
        },
        {
            title: "Aksi",
            key: "action",
            width: 150,
            align: "center",
            render: (_, record) => (
                <div className="flex justify-center gap-2">
                    <Button
                        type="text"
                        size="small"
                        icon={<Pencil size={16} className="text-yellow-600" />}
                        onClick={() => onEdit(record)}
                    />
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => onDelete(record.id, record.name)}
                    />
                </div>
            ),
        },
    ];