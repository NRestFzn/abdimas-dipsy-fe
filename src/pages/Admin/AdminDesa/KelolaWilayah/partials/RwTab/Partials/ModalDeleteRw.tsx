import { Modal, Button, Alert, message } from "antd";
import { AlertTriangle } from "lucide-react";
import type { RukunWargaWithCount } from "../../../../../../../types/masterDataTypes";
import { useMasterData } from "../../../../../../../hooks/useMasterData";

interface ModalDeleteRwProps {
    open: boolean;
    onClose: () => void;
    selectedRW: RukunWargaWithCount | null;
    onSuccess: () => void;
}

export default function ModalDeleteRw({ open, onClose, selectedRW, onSuccess }: ModalDeleteRwProps) {
    const masterData = useMasterData();

    const confirmDelete = () => {
        if (selectedRW) {
            message.loading({ content: "Menghapus RW...", key: "deleteRW" });
            masterData.deleteRWMutation.mutate(selectedRW.id, {
                onSuccess: () => {
                    message.success({ content: "RW dihapus", key: "deleteRW" });
                    onSuccess();
                    onClose();
                },
                onError: () => {
                    message.error({ content: "Gagal menghapus RW", key: "deleteRW" });
                }
            });
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle size={20} />
                    <span>Konfirmasi Hapus Wilayah</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Batal
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    danger
                    loading={masterData.deleteRWMutation.isPending}
                    onClick={confirmDelete}
                >
                    Ya, Hapus RW
                </Button>
            ]}
            centered
        >
            {selectedRW && (
                <div className="flex flex-col gap-4 py-2">
                    <p className="text-gray-600">
                        Apakah Anda yakin ingin menghapus
                        <span className="font-bold text-gray-800"> RW {selectedRW.name}</span>?
                    </p>

                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                        <p className="text-red-800 font-medium mb-2 text-sm">
                            Dampak Penghapusan:
                        </p>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                            <li>
                                <span className="font-bold">{selectedRW.rtCount} Rukun Tetangga (RT)</span> akan ikut terhapus.
                            </li>
                            <li>
                                <span className="font-bold">{selectedRW.userCount} Data Warga</span> di dalam wilayah ini akan hilang.
                            </li>
                        </ul>
                    </div>

                    <Alert
                        title="Tindakan ini tidak dapat dibatalkan!"
                        type="warning"
                        showIcon
                        className="text-xs"
                    />
                </div>
            )}
        </Modal>
    );
}