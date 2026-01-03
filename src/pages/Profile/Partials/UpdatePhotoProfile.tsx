import { useState, useEffect } from "react";
import { Modal, Button, Upload, Avatar, message } from "antd";
import { UploadCloud } from "lucide-react";
import type { RcFile } from "antd/es/upload/interface";
import { useUpdateProfilePicture } from "../../../hooks/useResident";

interface UpdatePhotoModalProps {
    open: boolean;
    onClose: () => void;
    currentPhotoUrl?: string | null;
    fullname: string;
}

export default function UpdatePhotoModal({ open, onClose, currentPhotoUrl, fullname }: UpdatePhotoModalProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    
    const updatePictureMutation = useUpdateProfilePicture();

    useEffect(() => {
        if (open) {
            setPreview(currentPhotoUrl || null);
            setFileToUpload(null);
        }
    }, [open, currentPhotoUrl]);

    const handleBeforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJpgOrPng) {
            message.error('Hanya boleh upload file JPG/PNG!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ukuran gambar harus lebih kecil dari 2MB!');
            return Upload.LIST_IGNORE;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setFileToUpload(file);

        return false;
    };

    const handleSave = () => {
        if (!fileToUpload) {
            onClose();
            return;
        }

        updatePictureMutation.mutate(fileToUpload, {
            onSuccess: () => {
                onClose();
                if (preview && preview !== currentPhotoUrl) {
                    URL.revokeObjectURL(preview);
                }
            }
        });
    };

    const handleCancel = () => {
        setPreview(null);
        setFileToUpload(null);
        onClose();
    };

    return (
        <Modal
            title="Ubah Foto Profil"
            open={open}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel} disabled={updatePictureMutation.isPending}>
                    Batal
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleSave}
                    loading={updatePictureMutation.isPending}
                    disabled={!fileToUpload}
                    className="bg-[#70B748] hover:bg-[#5a9639]"
                >
                    Simpan Foto
                </Button>
            ]}
            centered
            width={400}
        >
            <div className="flex flex-col items-center justify-center py-6 gap-6">
                <div className="relative group">
                    <Avatar
                        size={180}
                        src={preview}
                        className="bg-gradient-to-br from-[#70B748] to-[#5a9639] text-white text-6xl border-4 border-gray-100 shadow-lg"
                    >
                        {!preview && fullname?.charAt(0)?.toUpperCase()}
                    </Avatar>
                </div>

                <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={handleBeforeUpload}
                    accept="image/png, image/jpeg, image/jpg"
                >
                    <Button icon={<UploadCloud size={18} />}>
                        Pilih Foto Baru
                    </Button>
                </Upload>

                <p className="text-xs text-gray-400 text-center px-8">
                    Format yang didukung: JPG, PNG. Ukuran maksimal 2MB.
                </p>
            </div>
        </Modal>
    );
}