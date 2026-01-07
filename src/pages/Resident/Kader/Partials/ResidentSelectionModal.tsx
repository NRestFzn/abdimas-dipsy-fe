import { Modal, Input, List, Avatar, Spin, Empty, Button } from "antd";
import { Search, User, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { useInfiniteResidents } from "../../../../hooks/useResident";
import { getImageUrl } from "../../../../utils/imageHelper";

interface ResidentSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (resident: any) => void;
}

export const ResidentSelectionModal = ({
    open,
    onClose,
    onSelect,
}: ResidentSelectionModalProps) => {
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch] = useDebounce(searchText, 500);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError
    } = useInfiniteResidents(debouncedSearch);

    const residents = data?.pages?.flatMap((page) => page.data || []) || [];

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (isLoading || isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
    );

    return (
        <Modal
            title="Pilih Warga untuk Disurvei"
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            className="rounded-xl overflow-hidden"
        >
            <div className="mb-4">
                <Input
                    prefix={<Search size={16} className="text-gray-400" />}
                    placeholder="Cari nama atau NIK warga..."
                    className="rounded-lg py-2"
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                />
            </div>

            <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading && residents.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full gap-3">
                        <Spin indicator={<Loader2 className="animate-spin text-[#70B748]" size={32} />} />
                        <span className="text-gray-400 text-sm">Memuat data warga...</span>
                    </div>
                ) : isError ? (
                    <div className="flex justify-center items-center h-full text-red-500 bg-red-50 rounded-lg m-2">
                        Gagal memuat data. Silakan coba lagi.
                    </div>
                ) : residents.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={residents}
                        renderItem={(item: any, index: number) => {
                            const isLast = index === residents.length - 1;
                            const nik = item.userDetail?.nik || "-";

                            return (
                                <div ref={isLast ? lastElementRef : null}>
                                    <List.Item
                                        className="cursor-pointer hover:bg-green-50/50 p-3 rounded-xl transition-all border-b border-gray-50 group mb-1 mx-1"
                                        onClick={() => onSelect(item)}
                                        actions={[
                                            <Button
                                                key="select"
                                                size="small"
                                                type="text"
                                                className="text-[#70B748] font-semibold bg-green-50 hover:bg-green-100 border border-green-100 rounded-lg px-4"
                                            >
                                                Pilih
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    src={getImageUrl(item.profilePicture)}
                                                    icon={<User size={20} />}
                                                    size={48}
                                                    className="bg-gray-100 text-gray-400 border border-gray-200"
                                                />
                                            }
                                            title={
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 text-base group-hover:text-[#70B748] transition-colors">
                                                        {item.fullname}
                                                    </span>
                                                </div>
                                            }
                                            description={
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center gap-1.5 py-0.5 text-gray-500 text-xs ">
                                                        <span className="font-mono">{nik}</span>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                </div>
                            );
                        }}
                    />
                ) : (
                    <Empty description="Warga tidak ditemukan" className="mt-10" />
                )}

                {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                        <Spin size="small" indicator={<Loader2 className="animate-spin text-[#70B748]" />} />
                    </div>
                )}
            </div>
        </Modal>
    );
};