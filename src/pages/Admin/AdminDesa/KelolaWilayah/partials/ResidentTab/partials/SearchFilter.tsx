import { Input, Select, Space } from "antd";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchFilterProps {
    onSearch: (term: string, type: "fullname" | "nik") => void;
}

export const SearchFilter = ({ onSearch }: SearchFilterProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState<"fullname" | "nik">("fullname");
    
    const [debouncedTerm] = useDebounce(searchTerm, 500);

    useEffect(() => {
        onSearch(debouncedTerm, searchBy);
    }, [debouncedTerm, searchBy]);

    return (
        <Space.Compact className="flex !w-full md:!w-[400px]">
            <Select
                defaultValue="fullname"
                value={searchBy}
                onChange={(val: "fullname" | "nik") => {
                    setSearchBy(val);
                    setSearchTerm("");
                }}
                style={{ width: '30%' }}
                options={[
                    { label: 'Nama', value: 'fullname' },
                    { label: 'NIK', value: 'nik' },
                ]}
            />
            <Input
                style={{ width: '70%' }}
                placeholder={searchBy === 'nik' ? "Cari NIK..." : "Cari Nama Warga..."}
                prefix={<Search className="text-gray-400" size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
            />
        </Space.Compact>
    );
};