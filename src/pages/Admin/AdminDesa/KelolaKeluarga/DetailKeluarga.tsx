import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Table, Button, Card, Breadcrumb, Descriptions, message } from "antd";
import { Plus, UserCog, ArrowLeft } from "lucide-react";
import { useAdminFamilyDetail, useAdminRemoveFamilyMember } from "../../../../hooks/Family/useAdminFamily";
import { getFamilyMemberColumns } from "./columns/FamilyMemberColumn";
import AddMemberModal from "./partials/AddMemberModal";
import ChangeHeadModal from "./partials/ChangeHeadModal";

export default function DetailKeluarga() {
    const { familyId } = useParams<{ familyId: string }>();
    const navigate = useNavigate();
    const [messageApi] = message.useMessage();

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isChangeHeadModalOpen, setIsChangeHeadModalOpen] = useState(false);

    const { data: family, isLoading } = useAdminFamilyDetail(familyId as string);
    const removeMember = useAdminRemoveFamilyMember();

    const members = family?.members || [];

    const handleRemoveMember = (userId: string) => {
        removeMember.mutate(
            { familyId: familyId as string, userId },
            {
                onSuccess: () => messageApi.success("Berhasil menghapus anggota keluarga"),
                onError: (error: any) =>
                    messageApi.error(error?.response?.data?.message || "Gagal menghapus anggota keluarga"),
            }
        );
    };

    const memberColumns = getFamilyMemberColumns({
        headOfFamilyId: family?.headOfFamilyId,
        onRemove: handleRemoveMember,
    });

    if (isLoading) return <div>Memuat...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        type="text"
                        icon={<ArrowLeft size={20} />}
                        onClick={() => navigate("/admin/kelola-keluarga")}
                        className="bg-white hover:bg-gray-100 shrink-0"
                    />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Detail Keluarga</h1>
                        <Breadcrumb
                            items={[
                                { title: "Dashboard" },
                                {
                                    title: (
                                        <span
                                            className="cursor-pointer"
                                            onClick={() => navigate("/admin/kelola-keluarga")}
                                        >
                                            Manajemen Keluarga
                                        </span>
                                    ),
                                },
                                { title: "Detail Keluarga" },
                            ]}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:shrink-0">
                    <Button
                        icon={<UserCog size={16} />}
                        onClick={() => setIsChangeHeadModalOpen(true)}
                        className="border-blue-600 text-blue-600 hover:text-blue-700 hover:border-blue-700"
                    >
                        <span className="hidden sm:inline">Ganti Kepala Keluarga</span>
                        <span className="sm:hidden">Ganti Kepala</span>
                    </Button>
                    <Button
                        icon={<Plus size={16} />}
                        onClick={() => setIsAddMemberModalOpen(true)}
                        className="border-blue-600 text-blue-600 hover:text-blue-700 hover:border-blue-700"
                    >
                        Tambah Anggota
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm border border-gray-100 rounded-xl mb-6">
                <Descriptions
                    title="Informasi Keluarga"
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                >
                    <Descriptions.Item label="No. KK">{family?.familyCardNumber}</Descriptions.Item>
                    <Descriptions.Item label="Kepala Keluarga">
                        <span className="font-semibold text-blue-600">{family?.headOfFamily?.fullname}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Anggota">{members.length} Orang</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card
                className="shadow-sm border border-gray-100 rounded-xl overflow-hidden"
                title="Daftar Anggota Keluarga"
            >
                <Table
                    columns={memberColumns}
                    dataSource={members}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 500 }}
                />
            </Card>

            <AddMemberModal
                open={isAddMemberModalOpen}
                familyId={familyId as string}
                onCancel={() => setIsAddMemberModalOpen(false)}
            />

            <ChangeHeadModal
                open={isChangeHeadModalOpen}
                familyId={familyId as string}
                members={members}
                headOfFamilyId={family?.headOfFamilyId}
                onCancel={() => setIsChangeHeadModalOpen(false)}
            />
        </div>
    );
}
