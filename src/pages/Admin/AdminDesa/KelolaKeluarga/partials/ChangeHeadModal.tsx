import { useState } from "react";
import { Modal, message } from "antd";
import { useAdminUpdateFamilyHead } from "../../../../../hooks/Family/useAdminFamily";

interface Member {
    UserId: string;
    user?: {
        fullname: string;
        email: string;
    };
}

interface Props {
    open: boolean;
    familyId: string;
    members: Member[];
    headOfFamilyId?: string;
    onCancel: () => void;
}

export default function ChangeHeadModal({ open, familyId, members, headOfFamilyId, onCancel }: Props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [newHeadId, setNewHeadId] = useState("");

    const updateFamilyHead = useAdminUpdateFamilyHead();

    const handleCancel = () => {
        setNewHeadId("");
        onCancel();
    };

    const handleOk = async () => {
        if (!newHeadId) {
            messageApi.error("Pilih anggota keluarga untuk dijadikan kepala keluarga");
            return;
        }
        try {
            await updateFamilyHead.mutateAsync({ familyId, headOfFamilyId: newHeadId });
            messageApi.success("Berhasil mengubah kepala keluarga");
            setNewHeadId("");
            onCancel();
        } catch (error: any) {
            messageApi.error(error?.response?.data?.message || "Gagal mengubah kepala keluarga");
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Ganti Kepala Keluarga"
                open={open}
                onCancel={handleCancel}
                onOk={handleOk}
                confirmLoading={updateFamilyHead.isPending}
                okText="Simpan"
                cancelText="Batal"
            >
                <div className="mt-4">
                    <p className="mb-3 text-gray-600">
                        Pilih anggota keluarga untuk dijadikan kepala keluarga baru:
                    </p>
                    <div className="flex flex-col gap-2">
                        {members.map((member) => (
                            <div
                                key={member.UserId}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    newHeadId === member.UserId
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-300"
                                }`}
                                onClick={() => setNewHeadId(member.UserId)}
                            >
                                <div className="font-medium text-gray-800">{member.user?.fullname}</div>
                                <div className="text-sm text-gray-500">{member.user?.email}</div>
                                {member.UserId === headOfFamilyId && (
                                    <span className="text-xs text-blue-600 font-semibold mt-1 block">
                                        Kepala Keluarga Saat Ini
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
}
