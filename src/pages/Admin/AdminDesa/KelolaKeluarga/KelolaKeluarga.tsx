import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    Button,
    Card,
    Modal,
    Input,
    message,
    Breadcrumb,
    Select,
    Spin,
    Empty,
} from "antd";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useAdminFamilies, useAdminCreateFamily } from "../../../../hooks/Family/useAdminFamily";
import { residentService } from "../../../../service/Admin/AdminDesa/residentServices";
import type { ResidentData } from "../../../../types/Resident/residentType";

export default function KelolaKeluarga() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [familyCardNumber, setFamilyCardNumber] = useState("");
    const [selectedHeadOfFamilyId, setSelectedHeadOfFamilyId] = useState<string>();
    const [residentSearch, setResidentSearch] = useState("");
    const [debouncedResidentSearch] = useDebounce(residentSearch.trim(), 400);
    
    const { data: families, isLoading } = useAdminFamilies();
    const createFamily = useAdminCreateFamily();

    const { data: headOfFamilyCandidates = [], isFetching: isFetchingResidents } = useQuery({
        queryKey: ["family-head-resident-options", debouncedResidentSearch],
        enabled: isCreateModalOpen,
        queryFn: async () => {
            const params = {
                page: 1,
                pageSize: 20,
                order: '[["fullname", "asc"]]',
            };

            const responses = await Promise.all([
                residentService.getAllResidents({
                    ...params,
                    fullname: debouncedResidentSearch || undefined,
                }),
                ...(debouncedResidentSearch
                    ? [
                        residentService.getAllResidents({
                            ...params,
                            nik: debouncedResidentSearch,
                        }),
                    ]
                    : []),
            ]);

            const residents = new Map<string, ResidentData>();
            responses.forEach((response) => {
                response.data?.forEach((resident) => {
                    residents.set(resident.id, resident);
                });
            });

            const candidates = Array.from(residents.values());

            if (!debouncedResidentSearch) return candidates;

            const loweredSearch = debouncedResidentSearch.toLowerCase();
            return candidates.filter((resident) => {
                const fullname = resident.fullname.toLowerCase();
                const nik = resident.userDetail?.nik || "";

                return fullname.includes(loweredSearch) || nik.includes(debouncedResidentSearch);
            });
        },
    });

    const residentOptions = useMemo(
        () =>
            headOfFamilyCandidates.map((resident) => ({
                value: resident.id,
                label: (
                    <div className="flex flex-col leading-tight">
                        <span className="font-medium text-gray-800">{resident.fullname}</span>
                        <span className="text-xs text-gray-500">
                            NIK {resident.userDetail?.nik || "-"}
                        </span>
                    </div>
                ),
            })),
        [headOfFamilyCandidates]
    );

    const resetCreateFamilyForm = () => {
        setIsCreateModalOpen(false);
        setFamilyCardNumber("");
        setSelectedHeadOfFamilyId(undefined);
        setResidentSearch("");
    };

    const handleCreateFamily = async () => {
        if (!familyCardNumber) {
            messageApi.error("No KK wajib diisi");
            return;
        }

        if (!selectedHeadOfFamilyId) {
            messageApi.error("Kepala keluarga wajib dipilih");
            return;
        }

        try {
            await createFamily.mutateAsync({
                familyCardNumber,
                headOfFamilyId: selectedHeadOfFamilyId
            });
            messageApi.success("Berhasil membuat keluarga baru");
            resetCreateFamilyForm();
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
        <div className="space-y-6 p-4 md:p-6">
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
                onCancel={resetCreateFamilyForm}
                onOk={handleCreateFamily}
                confirmLoading={createFamily.isPending}
                okText="Buat Keluarga"
                cancelText="Batal"
                width={560}
                destroyOnHidden
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
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kepala Keluarga</label>
                        <Select
                            showSearch
                            allowClear
                            value={selectedHeadOfFamilyId}
                            filterOption={false}
                            placeholder="Cari nama atau NIK kepala keluarga"
                            options={residentOptions}
                            loading={isFetchingResidents}
                            onSearch={setResidentSearch}
                            onChange={(value) => setSelectedHeadOfFamilyId(value)}
                            onClear={() => {
                                setSelectedHeadOfFamilyId(undefined);
                                setResidentSearch("");
                            }}
                            notFoundContent={
                                isFetchingResidents ? (
                                    <Spin size="small" />
                                ) : (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                )
                            }
                            className="w-full"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
