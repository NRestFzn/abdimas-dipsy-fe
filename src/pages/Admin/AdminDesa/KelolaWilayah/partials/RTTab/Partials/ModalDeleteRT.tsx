import { Modal, Button, Alert, message } from "antd";
import { AlertTriangle } from "lucide-react";
import type { RukunTetanggaWithCount } from "../../../../../../../types/masterDataTypes";
import { useMasterData } from "../../../../../../../hooks/useMasterData";

interface ModalDeleteRtProps {
    open: boolean;
    onClose: () => void;
    selectedRT: RukunTetanggaWithCount | null;
    onSuccess: () => void;
}

export default function ModalDeleteRt({ open, onClose, selectedRT, onSuccess }: ModalDeleteRtProps) {
    const masterData = useMasterData();

    const confirmDelete = () => {
        if (selectedRT) {
            message.loading({ content: "Menghapus RT...", key: "deleteRT" });
            masterData.deleteRTMutation.mutate(selectedRT.id, {
                onSuccess: () => {
                    message.success({ content: "RT dihapus", key: "deleteRT" });
                    onSuccess(); // Reset selectedRT
                    onClose();
                },
                onError: () => {
                    message.error({ content: "Gagal menghapus RT", key: "deleteRT" });
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
                    loading={masterData.deleteRTMutation.isPending}
                    onClick={confirmDelete}
                >
                    Ya, Hapus RT
                </Button>
            ]}
            centered
        >
            {selectedRT && (
                <div className="flex flex-col gap-4 py-2">
                    <p className="text-gray-600 leading-relaxed">
                        Apakah Anda yakin ingin menghapus
                        <span className="font-bold text-gray-800"> RT {selectedRT.name}</span>?
                    </p>

                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                        <p className="text-red-800 font-medium mb-2 text-sm">
                            Dampak Penghapusan:
                        </p>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                            <li>
                                <span className="font-bold">{selectedRT.userCount} Data Warga</span> di dalam RT ini akan hilang permanen.
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