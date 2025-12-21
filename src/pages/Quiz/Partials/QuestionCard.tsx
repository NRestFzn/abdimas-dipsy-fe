import { CheckCircle } from "lucide-react";

interface QuestionCardProps {
    id: string;
    index: number;
    text: string;
    type: string;
    options: string[];
    selectedAnswer: string;
    onAnswer: (id: string, val: string) => void;
}

export const QuestionCard = ({ id, index, text,  options, selectedAnswer, onAnswer }: QuestionCardProps) => {
    const safeOptions = Array.isArray(options) && options.length > 0 ? options : ["Ya", "Tidak"];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 scroll-mt-24" id={`question-${id}`}>
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-[#70B748] font-bold text-sm border border-green-100">
                        {index + 1}
                    </span>
                </div>
                <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-4 leading-snug">
                        {text}
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {safeOptions.map((option, idx) => {
                            const isSelected = selectedAnswer === option;
                            return (
                                <label
                                    key={idx}
                                    className={`
                                        cursor-pointer relative flex items-center justify-center px-6 py-3 rounded-lg border transition-all duration-200 flex-1 sm:flex-none min-w-[100px] text-center select-none
                                        ${isSelected 
                                            ? "bg-[#70B748] border-[#70B748] text-white shadow-md shadow-green-100 transform scale-[1.02]" 
                                            : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50/50"
                                        }
                                    `}
                                >
                                    <input
                                        type="radio"
                                        name={id}
                                        value={option}
                                        checked={isSelected}
                                        onChange={(e) => onAnswer(id, e.target.value)}
                                        className="sr-only"
                                    />
                                    <span className="font-medium">{option}</span>
                                    
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 bg-white text-[#70B748] rounded-full p-0.5 shadow-sm border border-green-100">
                                            <CheckCircle size={14} fill="white" />
                                        </div>
                                    )}
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};