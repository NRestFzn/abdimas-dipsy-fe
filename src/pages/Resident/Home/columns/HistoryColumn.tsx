import type { ColumnsType } from "antd/es/table";
import { Avatar, Button, Typography } from "antd";
import dayjs from "dayjs"
import type { HistoryTableData } from "../Home";
import { User, UserCheck } from "lucide-react";
import { getImageUrl } from "../../../../utils/imageHelper";

const { Text } = Typography;

interface HistoryColumnsProps {
    pagination: { page: number; pageSize: number }
    onSee: (id: string) => void
}

export const getHistoryColumn = ({ onSee, pagination }: HistoryColumnsProps): ColumnsType<HistoryTableData> => [
    {
        title: "No",
        width: 60,
        align: "center",
        render: (_, __, index) => (pagination.page - 1) * pagination.pageSize + index + 1,
    },
    {
        title: "Judul Kuisioner",
        dataIndex: ["questionnaire", "title"],
        key: "title",
        render: (text) => (
            <span className="font-medium text-gray-700">{text}</span>
        ),
    },
    {
        title: "Dikerjakan Oleh",
        key: "submittedBy",
        width: 200,
        render: (_, record) => {
            if (record.isAssisted) {
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar
                                src={getImageUrl(record.submittedBy?.profilePicture)}
                                className="bg-blue-100 text-blue-600 border border-blue-200"
                            >
                                {record.submittedBy?.fullname?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <UserCheck size={12} className="text-blue-500 fill-blue-500" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <Text className="text-xs text-gray-500 mb-0.5">Dibantu oleh</Text>
                            <Text strong className="text-sm text-gray-700 leading-tight">
                                {record.submittedBy?.fullname}
                            </Text>
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="bg-green-50 text-green-600 border border-green-200">
                        <User size={16} />
                    </Avatar>
                    <span className="text-sm font-medium text-green-700">Mandiri</span>
                </div>
            );
        },
    },
    {
        title: "Tanggal Pengerjaan",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => (
            <div className="flex flex-col">
                <span className="text-gray-700">
                    {dayjs(date).format("DD MMMM YYYY")}
                </span>
                <span className="text-xs text-gray-400">
                    {dayjs(date).format("HH:mm")} WIB
                </span>
            </div>
        ),
    },
    {
        title: "Aksi",
        key: "action",
        align: "center",
        width: 120,
        render: (_, record) => (
            <Button
                size="small"
                className="bg-[#70B748] hover:bg-[#5a9639] text-white border-none"
                onClick={() => onSee(record.id)}
            >
                Lihat Hasil
            </Button>
        ),
    },
]