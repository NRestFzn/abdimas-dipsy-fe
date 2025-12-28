import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface UserQuestionResult {
    no: number;
    question: string;
    answer: string;
}

export const getUserResultColumns = (): ColumnsType<UserQuestionResult> => [
    {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 80,
        align: "center",
        responsive: ["sm"],
    },
    {
        title: "Pertanyaan",
        dataIndex: "question",
        key: "question",
    },
    {
        title: "Jawaban",
        dataIndex: "answer",
        key: "answer",
        width: 150,
        align: "center",
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