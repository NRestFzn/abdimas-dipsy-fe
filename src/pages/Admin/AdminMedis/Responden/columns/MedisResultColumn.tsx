import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface QuestionResult {
    no: number;
    question: string;
    answer: string;
}

export const getMedisResultColumns = (): ColumnsType<QuestionResult> => [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 70,
        align: 'center',
        responsive: ["sm"],
    },
    {
        title: 'Pertanyaan',
        dataIndex: 'question',
        key: 'question',
        render: (text) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
        title: 'Jawaban',
        dataIndex: 'answer',
        key: 'answer',
        align: 'center',
        width: 150,
        render: (answer: string) => {
            const isYa = answer === "Ya";
            return (
                <Tag 
                    color={isYa ? "error" : "success"} 
                    className="px-4 py-1 text-sm font-medium rounded-full min-w-[80px] text-center"
                >
                    {answer}
                </Tag>
            );
        },
    },
];