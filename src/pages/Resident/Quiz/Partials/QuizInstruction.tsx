export const QuizInstruction = () => (
    <div className="bg-green-50 border border-green-100 rounded-xl p-4 sm:p-5 mb-8 mx-4">
        <h4 className="text-green-800 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <div className="w-1.5 h-4 bg-green-500 rounded-full"></div>
            Petunjuk Pengerjaan
        </h4>
        <ul className="text-xs sm:text-sm text-green-700 space-y-2 pl-2">
            <li className="flex items-start gap-2">
                <span className="block w-1 h-1 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></span>
                Pertanyaan menyangkut masalah yang Anda alami dalam 30 hari terakhir.
            </li>
            <li className="flex items-start gap-2">
                <span className="block w-1 h-1 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></span>
                Untuk setiap pertanyaan pilih jawaban yang paling sesuai.
            </li>
            <li className="flex items-start gap-2">
                <span className="block w-1 h-1 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></span>
                Jawaban bersifat rahasia dan hanya digunakan untuk membantu Anda.
            </li>
        </ul>
    </div>
);