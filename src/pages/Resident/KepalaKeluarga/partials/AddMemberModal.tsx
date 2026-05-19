import { useState } from "react";
import { Modal, Input, Divider, message } from "antd";
import { UserRoundPlus } from "lucide-react";
import { useAddFamilyMemberByNik } from "../../../../hooks/Family/useFamily";

interface Props {
    open: boolean;
    onCancel: () => void;
    onOpenRegister: () => void;
}

export default function AddMemberModal({ open, onCancel, onOpenRegister }: Props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [nikInput, setNikInput] = useState("");

    const addMemberByNik = useAddFamilyMemberByNik();

    const handleCancel = () => {
        setNikInput("");
        onCancel();
    };

    const handleOk = async () => {
        if (!nikInput) {
            messageApi.error("NIK tidak boleh kosong");
            return;
        }
        try {
            await addMemberByNik.mutateAsync({ nik: nikInput });
            messageApi.success("Berhasil menambahkan anggota keluarga");
            setNikInput("");
            onCancel();
        } catch (error: any) {
            messageApi.error(error?.response?.data?.message || "Gagal menambahkan anggota keluarga");
        }
    };

    const handleOpenRegister = () => {
        setNikInput("");
        onCancel();
        onOpenRegister();
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Tambah Anggota — Sudah Punya Akun"
                open={open}
                onCancel={handleCancel}
                onOk={handleOk}
                confirmLoading={addMemberByNik.isPending}
                okText="Tambah"
                cancelText="Batal"
                okButtonProps={{ className: "bg-amber-500 hover:bg-amber-600 border-none" }}
            >
                <div className="mt-4 space-y-4">
                    <div>
                        <p className="mb-2 text-gray-600 text-sm">
                            Masukkan NIK anggota yang sudah terdaftar di sistem:
                        </p>
                        <Input
                            placeholder="Masukkan NIK (16 digit)"
                            value={nikInput}
                            onChange={(e) => setNikInput(e.target.value)}
                            maxLength={16}
                            size="large"
                        />
                    </div>

                    <Divider plain className="!my-3 !text-gray-400 !text-xs">atau</Divider>

                    <button
                        type="button"
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 hover:border-amber-400 transition-colors cursor-pointer text-left"
                        onClick={handleOpenRegister}
                    >
                        <div className="bg-amber-500 text-white p-2 rounded-lg shrink-0">
                            <UserRoundPlus size={18} />
                        </div>
                        <div>
                            <p className="font-semibold text-amber-700 text-sm">Daftarkan Anggota Baru</p>
                            <p className="text-xs text-amber-600 opacity-80">
                                Anggota belum punya akun? Buat akun sekaligus tambahkan ke keluarga
                            </p>
                        </div>
                    </button>
                </div>
            </Modal>
        </>
    );
}
