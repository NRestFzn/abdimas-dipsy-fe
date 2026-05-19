import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    Button,
    Card,
    Modal,
    Input,
    message,
    Breadcrumb
} from "antd";
import { Plus, Search } from "lucide-react";
import { useAdminFamilies, useAdminCreateFamily } from "../../../../hooks/Family/useAdminFamily";
import { api } from "../../../../service/api";

export default function KelolaKeluarga() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [familyCardNumber, setFamilyCardNumber] = useState("");
    const [searchNik, setSearchNik] = useState("");
    const [searchResult, setSearchResult] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    
    const { data: families, isLoading } = useAdminFamilies();
    const createFamily = useAdminCreateFamily();

    const handleSearchResident = async () => {
        if (!searchNik) {
            messageApi.error("NIK wajib diisi");
            return;
        }
        setIsSearching(true);
        setSearchResult(null);
        try {
            const response = await api.get("/v1/resident", { params: { search: searchNik } });
            const residents = response.data?.data?.data || response.data?.data || [];
            if (residents.length > 0) {
                setSearchResult(residents[0]);
            } else {
                messageApi.warning("Penduduk tidak ditemukan");
            }
        } catch {
            messageApi.error("Gagal mencari penduduk");
        } finally {
            setIsSearching(false);
        }
    };

    const handleCreateFamily = async () => {
        if (!familyCardNumber) {
            messageApi.error("No KK wajib diisi");
            return;
        }

        if (!searchResult?.id) {
            messageApi.error("Silakan cari calon kepala keluarga berdasarkan NIK terlebih dahulu");
            return;
        }

        try {
            await createFamily.mutateAsync({
                familyCardNumber,
                headOfFamilyId: searchResult.id
            });
            messageApi.success("Berhasil membuat keluarga baru");
            setIsCreateModalOpen(false);
            setFamilyCardNumber("");
            setSearchNik("");
            setSearchResult(null);
        } catch (error: any) {
            messageApi.error(error?.response?.data?.message || "Gagal membuat keluarga");
        }
    };

    const columns = [
        {
            title: 'No. KK',
            dataIndex: 'familyCardNumber',
            key: 'familyCardNumber',
        },
        {
            title: 'Kepala Keluarga',
            dataIndex: ['headOfFamily', 'fullname'],
            key: 'headOfFamily',
        },
        {
            title: 'Jumlah Anggota',
            key: 'membersCount',
            render: (_: any, record: any) => record.members?.length || 0,
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_: any, record: any) => (
                <Button 
                    type="primary" 
                    size="small"
                    onClick={() => navigate(`/admin/kelola-keluarga/${record.id}`)}
                >
                    Detail
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {contextHolder}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manajemen Keluarga</h1>
                    <Breadcrumb
                        items={[
                            { title: "Dashboard" },
                            { title: "Manajemen Keluarga" }
                        ]}
                    />
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 self-start sm:self-auto"
                >
                    Keluarga Baru
                </Button>
            </div>

            <Card className="shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={families}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 500 }}
                />
            </Card>

            <Modal
                title="Buat Keluarga Baru"
                open={isCreateModalOpen}
                onCancel={() => {
                    setIsCreateModalOpen(false);
                    setFamilyCardNumber("");
                    setSearchNik("");
                    setSearchResult(null);
                }}
                onOk={handleCreateFamily}
                confirmLoading={createFamily.isPending}
                okText="Buat Keluarga"
                cancelText="Batal"
            >
                <div className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Kartu Keluarga (No. KK)</label>
                        <Input 
                            value={familyCardNumber}
                            onChange={(e) => setFamilyCardNumber(e.target.value)}
                            placeholder="Masukkan No. KK"
                        />
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cari Calon Kepala Keluarga</label>
                        <div className="flex flex-col xs:flex-row gap-2">
                            <Input
                                value={searchNik}
                                onChange={(e) => setSearchNik(e.target.value)}
                                placeholder="Masukkan NIK Kepala Keluarga"
                            />
                            <Button
                                type="primary"
                                icon={<Search size={16} />}
                                onClick={handleSearchResident}
                                loading={isSearching}
                                className="shrink-0"
                            >
                                Cari
                            </Button>
                        </div>

                        {searchResult && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                                <p className="text-sm text-gray-600">Ditemukan:</p>
                                <p className="font-semibold text-gray-800">{searchResult.fullname}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
