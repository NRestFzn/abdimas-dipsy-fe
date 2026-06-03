import { useState } from "react";
import { Modal, Input, Divider, message, Button } from "antd";
import { Search, UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { useAdminAddFamilyMemberByNik } from "../../../../../hooks/Family/useAdminFamily";
import { residentService } from "../../../../../service/Admin/AdminDesa/residentServices";
import type { ResidentData } from "../../../../../types/Resident/residentType";

interface Props {
    open: boolean;
    familyId: string;
    onCancel: () => void;
}

export default function AddMemberModal({ open, familyId, onCancel }: Props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [nikInput, setNikInput] = useState("");
    const [foundResident, setFoundResident] = useState<ResidentData | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const addMemberByNik = useAdminAddFamilyMemberByNik();

    const handleCancel = () => {
        setNikInput("");
        setFoundResident(null);
        onCancel();
    };

    const handleSearchResident = async () => {
        const nik = nikInput.trim();

        if (!nik) {
            messageApi.error("NIK wajib diisi");
            return;
        }

        if (!/^\d{16}$/.test(nik)) {
            messageApi.error("NIK harus 16 digit angka");
            return;
        }

        setIsSearching(true);
        setFoundResident(null);

        try {
            const response = await residentService.getResidentByNik(nik);

            setFoundResident(response.data);
            messageApi.success("Penduduk ditemukan");
        } catch (error: any) {
            const statusCode = error?.response?.status || error?.statusCode;

            if (statusCode === 404) {
                messageApi.warning("Penduduk dengan NIK tersebut tidak ditemukan");
                return;
            }

            messageApi.error(error?.response?.data?.message || error?.message || "Gagal mencari penduduk");
        } finally {
            setIsSearching(false);
        }
    };

    const handleOk = async () => {
        const nik = nikInput.trim();

        if (!foundResident || foundResident.userDetail?.nik !== nik) {
            messageApi.error("Cari dan pilih penduduk terlebih dahulu sebelum menambahkan");
            return;
        }

        try {
            await addMemberByNik.mutateAsync({ familyId, nik });
            messageApi.success("Berhasil menambahkan anggota keluarga");
            setNikInput("");
            setFoundResident(null);
            onCancel();
        } catch (error: any) {
            messageApi.error(error?.response?.data?.message || error?.message || "Gagal menambahkan anggota keluarga");
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
                okButtonProps={{ disabled: !foundResident || foundResident.userDetail?.nik !== nikInput.trim() }}
                okText="Tambah"
                cancelText="Batal"
            >
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cari Berdasarkan NIK
                        </label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Input
                                placeholder="Masukkan NIK Penduduk"
                                value={nikInput}
                                onChange={(e) => {
                                    setNikInput(e.target.value);
                                    setFoundResident(null);
                                }}
                                onPressEnter={handleSearchResident}
                                maxLength={16}
                            />
                            <Button
                                icon={<Search size={16} />}
                                loading={isSearching}
                                onClick={handleSearchResident}
                                className="sm:shrink-0"
                            >
                                Cari
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Anggota keluarga yang dimasukan harus sudah terdaftar terlebih dahulu.
                        </p>

                        {foundResident && (
                            <div className="mt-3 rounded-lg bg-blue-50 p-3">
                                <p className="text-xs text-blue-600">Penduduk ditemukan</p>
                                <p className="font-semibold text-gray-800">{foundResident.fullname}</p>
                                <p className="text-sm text-gray-500">
                                    NIK {foundResident.userDetail?.nik || "-"}
                                </p>
                            </div>
                        )}
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
