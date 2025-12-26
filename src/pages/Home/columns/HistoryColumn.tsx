import type { ColumnsType } from "antd/es/table";
import type { HistoryData } from "../../../types/wargaType";
import { Button } from "antd";
import dayjs from "dayjs"

interface HistoryColumnsProps {
    pagination: { current: number; pageSize: number }
    onSee: (id: string) => void
}

export const getHistoryColumn = ({ onSee, pagination }: HistoryColumnsProps): ColumnsType<HistoryData> => [
    {
        title: "No",
        width: 60,
        align: "center",
        render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
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