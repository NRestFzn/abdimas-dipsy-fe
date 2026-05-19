import { useState } from "react";
import { Modal, Input, Divider, message } from "antd";
import { UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { useAdminAddFamilyMemberByNik } from "../../../../../hooks/Family/useAdminFamily";

interface Props {
    open: boolean;
    familyId: string;
    onCancel: () => void;
}

export default function AddMemberModal({ open, familyId, onCancel }: Props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [nikInput, setNikInput] = useState("");
    const navigate = useNavigate();

    const addMemberByNik = useAdminAddFamilyMemberByNik();

    const handleCancel = () => {
        setNikInput("");
        onCancel();
    };

    const handleOk = async () => {
        if (!nikInput) {
            messageApi.error("NIK wajib diisi");
            return;
        }
        try {
            await addMemberByNik.mutateAsync({ familyId, nik: nikInput });
            messageApi.success("Berhasil menambahkan anggota keluarga");
            setNikInput("");
            onCancel();
        } catch (error: any) {
            messageApi.error(error?.response?.data?.message || "Gagal menambahkan anggota keluarga");
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Tambah Anggota Keluarga"
                open={open}
                onCancel={handleCancel}
                onOk={handleOk}
                confirmLoading={addMemberByNik.isPending}
                okText="Tambah"
                cancelText="Batal"
            >
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cari Berdasarkan NIK
                        </label>
                        <Input
                            placeholder="Masukkan NIK Penduduk"
                            value={nikInput}
                            onChange={(e) => setNikInput(e.target.value)}
                            maxLength={16}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Anggota keluarga yang dimasukan harus sudah terdaftar terlebih dahulu.
                        </p>
                    </div>

                    <Divider plain className="!my-3 !text-gray-400 !text-xs">atau</Divider>

                    <button
                        type="button"
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-colors cursor-pointer text-left"
                        onClick={() => {
                            handleCancel();
                            navigate("/admin/kelola-wilayah", { state: { defaultTab: "3" } });
                        }}
                    >
                        <div className="bg-blue-600 text-white p-2 rounded-lg shrink-0">
                            <UserRoundPlus size={18} />
                        </div>
                        <div>
                            <p className="font-semibold text-blue-700 text-sm">Daftarkan Anggota Baru</p>
                            <p className="text-xs text-blue-600 opacity-80">
                                Anggota belum terdaftar? Daftarkan terlebih dahulu melalui halaman Data Warga
                            </p>
                        </div>
                    </button>
                </div>
            </Modal>
        </>
    );
}
