import type { ColumnsType } from "antd/es/table";
import { Avatar, Button, Typography } from "antd";
import { User, UserCheck } from "lucide-react";
import dayjs from "dayjs";
import type { QuestionnaireHistoryResponse } from "../../../../types/Questionnaire/questionnaireTypes";
import { getImageUrl } from "../../../../utils/imageHelper";

const { Text } = Typography;

interface Props {
    pagination: { page: number; pageSize: number };
    currentUserId?: string;
    onViewResult: (id: string) => void;
}

export const getFamilyHistoryColumns = ({ pagination, currentUserId, onViewResult }: Props): ColumnsType<QuestionnaireHistoryResponse> => [
    {
        title: "No",
        width: 55,
        align: "center",
        render: (_: any, __: any, index: number) =>
            (pagination.page - 1) * pagination.pageSize + index + 1,
    },
    {
        title: "Judul Kuesioner",
        dataIndex: ["questionnaire", "title"],
        key: "title",
        render: (text: string) => (
            <span className="font-medium text-gray-700">{text}</span>
        ),
    },
    {
        title: "Untuk",
        key: "for",
        width: 180,
        render: (_: any, record: QuestionnaireHistoryResponse) => {
            const isSelf = !record.isAssisted || record.UserId === currentUserId;
            if (isSelf) {
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="bg-amber-50 text-amber-600 border border-amber-200">
                            <User size={14} />
                        </Avatar>
                        <span className="text-sm font-medium text-amber-700">Diri Sendiri</span>
                    </div>
                );
            }
            return (
                <div className="flex items-center gap-2">
                    <Avatar
                        src={getImageUrl(record.user?.profilePicture)}
                        className="bg-blue-50 text-blue-600 border border-blue-200"
                    >
                        {record.user?.fullname?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Text className="text-sm text-gray-700">{record.user?.fullname}</Text>
                </div>
            );
        },
    },
    {
        title: "Status",
        key: "assisted",
        width: 130,
        render: (_: any, record: QuestionnaireHistoryResponse) =>
            record.isAssisted ? (
                <div className="flex items-center gap-1.5">
                    <UserCheck size={14} className="text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">Dibantu</span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5">
                    <User size={14} className="text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Mandiri</span>
                </div>
            ),
    },
    {
        title: "Tanggal",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) => (
            <div className="flex flex-col">
                <span className="text-gray-700 text-sm">{dayjs(date).format("DD MMM YYYY")}</span>
                <span className="text-xs text-gray-400">{dayjs(date).format("HH:mm")} WIB</span>
            </div>
        ),
    },
    {
        title: "Aksi",
        key: "action",
        align: "center",
        width: 110,
        render: (_: any, record: QuestionnaireHistoryResponse) => (
            <Button
                size="small"
                className="bg-amber-500 hover:bg-amber-600 text-white border-none"
                onClick={() => onViewResult(record.id)}
            >
                Lihat Hasil
            </Button>
        ),
    },
];
