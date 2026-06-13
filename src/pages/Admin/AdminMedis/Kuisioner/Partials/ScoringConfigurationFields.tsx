import { Button, Checkbox, Form, Input, InputNumber, Switch } from "antd";
import type { NamePath } from "antd/es/form/interface";
import { Plus, Trash2 } from "lucide-react";
import { createDefaultResultRange, createScoringKey } from "../scoringDefaults";

interface ResultRangeFieldsProps {
    name: NamePath;
    title: string;
}

const ResultRangeFields = ({ name, title }: ResultRangeFieldsProps) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>

        <Form.List name={name}>
            {(fields, { add, remove }) => (
                <div className="space-y-3">
                    {fields.map((field) => (
                        <div
                            key={field.key}
                            className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_110px_40px] gap-2 items-start"
                        >
                            <Form.Item name={[field.name, "key"]} hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={[field.name, "label"]}
                                rules={[{ required: true, message: "Nama hasil wajib diisi" }]}
                                className="!mb-0"
                            >
                                <Input placeholder="Nama hasil, mis. Dalam Batas Wajar" />
                            </Form.Item>
                            <Form.Item
                                name={[field.name, "minScore"]}
                                rules={[{ required: true, message: "Wajib" }]}
                                className="!mb-0"
                            >
                                <InputNumber className="!w-full" placeholder="Min" />
                            </Form.Item>
                            <Form.Item
                                name={[field.name, "maxScore"]}
                                rules={[{ required: true, message: "Wajib" }]}
                                className="!mb-0"
                            >
                                <InputNumber className="!w-full" placeholder="Maks" />
                            </Form.Item>
                            <Form.Item
                                name={[field.name, "isRisk"]}
                                valuePropName="checked"
                                className="!mb-0"
                            >
                                <Switch checkedChildren="Risiko" unCheckedChildren="Aman" />
                            </Form.Item>
                            <Button
                                type="text"
                                danger
                                icon={<Trash2 size={16} />}
                                onClick={() => remove(field.name)}
                                aria-label="Hapus rentang hasil"
                            />
                            <Form.Item
                                name={[field.name, "recommendation"]}
                                className="!mb-0 md:col-span-5"
                            >
                                <Input placeholder="Rekomendasi atau tindak lanjut (opsional)" />
                            </Form.Item>
                        </div>
                    ))}

                    <Button
                        type="dashed"
                        icon={<Plus size={16} />}
                        onClick={() => add(createDefaultResultRange())}
                    >
                        Tambah Rentang Hasil
                    </Button>
                </div>
            )}
        </Form.List>
    </div>
);

export default function ScoringConfigurationFields() {
    return (
        <div className="space-y-5">
            <div className="border border-gray-200 p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-gray-800">Pilihan Jawaban</h3>
                    <p className="text-xs text-gray-500">
                        Skor ini menjadi nilai awal. Skor pertanyaan tertentu dapat diubah saat mengelola pertanyaan.
                    </p>
                </div>

                <Form.List name={["scoringConfig", "answerOptions"]}>
                    {(fields, { add, remove }) => (
                        <div className="space-y-2">
                            {fields.map((field) => (
                                <div
                                    key={field.key}
                                    className="grid grid-cols-[1fr_120px_40px] gap-2 items-start"
                                >
                                    <Form.Item name={[field.name, "value"]} hidden>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, "label"]}
                                        rules={[{ required: true, message: "Label wajib diisi" }]}
                                        className="!mb-0"
                                    >
                                        <Input placeholder="Nama jawaban" />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, "score"]}
                                        rules={[{ required: true, message: "Skor wajib" }]}
                                        className="!mb-0"
                                    >
                                        <InputNumber className="!w-full" placeholder="Skor" />
                                    </Form.Item>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<Trash2 size={16} />}
                                        disabled={fields.length <= 2}
                                        onClick={() => remove(field.name)}
                                        aria-label="Hapus pilihan jawaban"
                                    />
                                </div>
                            ))}

                            <Button
                                type="dashed"
                                icon={<Plus size={16} />}
                                onClick={() =>
                                    add({ value: createScoringKey("option"), label: "", score: 0 })
                                }
                            >
                                Tambah Pilihan
                            </Button>
                        </div>
                    )}
                </Form.List>
            </div>

            <div className="border border-gray-200 p-4 space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-800">Kelompok Penilaian</h3>
                    <p className="text-xs text-gray-500">
                        Kelompok bersifat opsional. Gunakan untuk memisahkan aspek penilaian, seperti Emosional, Perilaku, atau Prososial.
                    </p>
                </div>

                <Form.List name={["scoringConfig", "categories"]}>
                    {(fields, { add, remove }) => (
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.key} className="border-l-4 border-l-[#70B748] bg-gray-50 p-4 space-y-4">
                                    <Form.Item name={[field.name, "key"]} hidden>
                                        <Input />
                                    </Form.Item>
                                    <div className="flex items-start gap-3">
                                        <Form.Item
                                            label={`Nama Kelompok ${index + 1}`}
                                            name={[field.name, "label"]}
                                            rules={[{ required: true, message: "Nama kelompok wajib diisi" }]}
                                            className="!mb-0 flex-1"
                                        >
                                            <Input placeholder="Mis. Gejala Emosional" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Dihitung ke Skor Akhir"
                                            name={[field.name, "includeInTotal"]}
                                            valuePropName="checked"
                                            className="!mb-0"
                                        >
                                            <Checkbox />
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<Trash2 size={16} />}
                                            onClick={() => remove(field.name)}
                                            aria-label="Hapus kelompok penilaian"
                                        />
                                    </div>

                                    <ResultRangeFields
                                        name={[field.name, "ranges"]}
                                        title="Rentang Hasil Kelompok"
                                    />
                                </div>
                            ))}

                            <Button
                                type="dashed"
                                icon={<Plus size={16} />}
                                onClick={() =>
                                    add({
                                        key: createScoringKey("category"),
                                        label: "",
                                        includeInTotal: true,
                                        ranges: [createDefaultResultRange()],
                                    })
                                }
                            >
                                Tambah Kelompok
                            </Button>
                        </div>
                    )}
                </Form.List>
            </div>

            <div className="border border-gray-200 p-4 space-y-4">
                <Form.Item
                    label="Nama Total Penilaian"
                    name={["scoringConfig", "total", "label"]}
                    rules={[{ required: true, message: "Nama total wajib diisi" }]}
                    className="!mb-0"
                >
                    <Input placeholder="Mis. Total Kesulitan" />
                </Form.Item>

                <ResultRangeFields
                    name={["scoringConfig", "total", "ranges"]}
                    title="Rentang Hasil Akhir"
                />
            </div>
        </div>
    );
}
