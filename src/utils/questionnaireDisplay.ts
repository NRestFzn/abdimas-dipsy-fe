const questionnaireStatusLabels: Record<string, string> = {
    draft: "Konsep",
    publish: "Terbit",
    published: "Terbit",
    archived: "Diarsipkan",
};

const questionnaireQuestionTypeLabels: Record<string, string> = {
    radio: "Pilihan Tunggal",
    checkbox: "Kotak Centang",
    text: "Jawaban Teks",
};

const questionnaireResultLabels: Record<string, string> = {
    normal: "Normal",
    borderline: "Borderline",
    abnormal: "Abnormal",
};

export const getQuestionnaireStatusLabel = (status?: string | null) =>
    status ? questionnaireStatusLabels[status.toLowerCase()] || status : "-";

export const getQuestionnaireQuestionTypeLabel = (type?: string | null) =>
    type ? questionnaireQuestionTypeLabels[type.toLowerCase()] || type : "-";

export const getQuestionnaireResultLabel = (label?: string | null) =>
    label ? questionnaireResultLabels[label.trim().toLowerCase()] || label : "-";
