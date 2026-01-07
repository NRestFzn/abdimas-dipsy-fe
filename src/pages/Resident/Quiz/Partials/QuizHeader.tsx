import { FileText } from "lucide-react";

interface QuizHeaderProps {
    title: string;
    description: string;
}

export const QuizHeader = ({ title, description }: QuizHeaderProps) => {
    return (
        <div className="text-center mb-8 pt-6 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4 shadow-sm border border-green-100">
                <FileText size={32} className="text-[#70B748]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                {title}
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
                {description || "Silakan isi kuisioner ini dengan jujur sesuai kondisi Anda."}
            </p>
        </div>
    );
};