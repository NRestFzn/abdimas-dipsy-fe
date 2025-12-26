import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    Button,
    Input,
    Select,
    Card,
    message
} from "antd";
import { Plus, Search } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { adminDesaService } from "../../../../../service/adminDesaService";
import { getResidentColumns, type ResidentData } from "../columns/ResidentColumn";
import CreateResidentModal from "./CreateResidentModal";
import EditResidentModal from "./UpdateResidentModal";

export default function ResidentTab() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchName, setSearchName] = useState("");
    const [debouncedSearch] = useDebounce(searchName, 500);

    const [filterRW, setFilterRW] = useState<string | null>(null);
    const [filterRT, setFilterRT] = useState<string | null>(null);

    const { data: rwList } = useQuery({
        queryKey: ["rw-list"],
        queryFn: () => adminDesaService.getAllRW({order: "[['createdAt', 'desc']]"}),
        staleTime: 1000 * 60 * 5
    });

    const { data: rtListFilter } = useQuery({
        queryKey: ["rt-list-filter", filterRW],
        queryFn: () => filterRW ? adminDesaService.getRT({order: "[['createdAt', 'desc']]"}, filterRW) : null,
        enabled: !!filterRW,
        staleTime: 1000 * 60 * 5
    });

    useEffect(() => {
        if (rwList?.data && !filterRW) {
            const defaultRW = rwList.data.find((rw: any) => rw.name == 1 || rw.name === "1");

            if (defaultRW) {
                setFilterRW(defaultRW.id);
            }
        }
    }, [rwList]);

    useEffect(() => {
        if (rtListFilter?.data?.rukunTetangga && !filterRT) {
            const defaultRT = rtListFilter.data.rukunTetangga.find((rt: any) => rt.name == 1 || rt.name === "1");

            if (defaultRT) {
                setFilterRT(defaultRT.id);
            }
        }
    }, [rtListFilter]);


    const { data: residentsData, isLoading } = useQuery({
        queryKey: ["residents", pagination.current, pagination.pageSize, debouncedSearch, filterRW, filterRT],
        queryFn: () => adminDesaService.getAllResidents({
            page: pagination.current,
            pageSize: pagination.pageSize,
            fullname: debouncedSearch,
            RukunWargaId: filterRW,
            RukunTetanggaId: filterRT,
            order: '[["createdAt", "desc"]]'
        }),
        placeholderData: (previousData) => previousData,
        enabled: !!filterRW
    });

    const deleteMutation = useMutation({
        mutationFn: adminDesaService.deleteResident,
        onSuccess: () => {
            message.success("Warga berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["residents"] });
        },
        onError: () => {
            message.error("Gagal menghapus warga");
        }
    });

    const handleEdit = (id: string) => {
        setSelectedResidentId(id);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const columns = getResidentColumns({
        pagination,
        onViewDetail: (id) => {
            navigate(`/admin/kelola-wilayah/preview-warga/residentId=${id}`);
        },
        onEdit: handleEdit,
        onDelete: handleDelete
    });

    return (
        <div className="space-y-4">
            <Card size="small" className="bg-gray-50 border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
                    <div className="flex flex-col md:flex-row gap-3 w-full">
                        <Input
                            placeholder="Cari Nama Warga..."
                            prefix={<Search className="text-gray-400" size={16} />}
                            className="w-full md:w-64"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            allowClear
                        />

                        <Select
                            placeholder="Filter RW"
                            className="w-full md:w-40"
                            allowClear
                            value={filterRW}
                            onChange={(val) => {
                                setFilterRW(val);
                                setFilterRT(null);
                            }}
                            options={rwList?.data?.map((rw: any) => ({ label: `RW ${rw.name}`, value: rw.id }))}
                            loading={!rwList}
                        />

                        <Select
                            placeholder="Filter RT"
                            className="w-full md:w-40"
                            allowClear
                            disabled={!filterRW}
                            value={filterRT}
                            onChange={setFilterRT}
                            options={rtListFilter?.data?.rukunTetangga?.map((rt: any) => ({ label: `RT ${rt.name}`, value: rt.id }))}
                            loading={!rtListFilter && !!filterRW}
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        // disabled={rtListFilter?.data?.rukunTetangga?.length === 0}
                        className="!bg-[#70B748] !hover:bg-[#5a9639]"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Tambah Warga
                    </Button>
                </div>
            </Card>

            <Table<ResidentData>
                columns={columns}
                dataSource={(residentsData?.data || []) as ResidentData[]}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: residentsData?.total || residentsData?.data?.length || 0,
                    showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Warga`,
                    onChange: (page, size) => setPagination({ current: page, pageSize: size })
                }}
                scroll={{ x: 1000 }}
            />

            <CreateResidentModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
            />

            <EditResidentModal
                open={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedResidentId(null);
                }}
                residentId={selectedResidentId}
            />
        </div>
    );
}