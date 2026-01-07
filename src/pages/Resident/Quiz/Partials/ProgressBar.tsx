import { CheckCircle } from "lucide-react";

interface QuizProgressBarProps {
    current: number;
    total: number;
    percent: number;
}

export const QuizProgressBar = ({ current, total, percent }: QuizProgressBarProps) => {
    return (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 transition-all duration-300">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                    <span className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-[#70B748]" />
                        Terjawab: <span className="text-gray-900">{current}</span> / {total}
                    </span>
                    <span className="text-[#70B748]">{Math.round(percent)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-[#70B748] h-2.5 rounded-full transition-all duration-500 ease-out relative"
                        style={{ width: `${percent}%` }}
                    >
                        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-shimmer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};