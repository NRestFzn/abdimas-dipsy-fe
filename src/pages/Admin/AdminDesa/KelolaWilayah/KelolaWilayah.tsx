import { Card, Tabs } from "antd";
import RWTab from "./partials/RwTab/RWTab";
import RTTab from "./partials/RTTab/RTTab";
import ResidentTab from "./partials/ResidentTab/ResidentTab";

export default function KelolaWilayah() {
    const items = [
        {
            key: '1',
            label: 'Data RW',
            children: <RWTab />,
        },
        {
            key: '2',
            label: 'Data RT',
            children: <RTTab />,
        },
        {
            key: '3',
            label: 'Data Warga',
            children: <ResidentTab />,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Kelola Wilayah</h1>
                <p className="text-gray-500">Kelola data wilayah (RW/RT) dan kependudukan</p>
            </div>

            <Card className="shadow-sm border-gray-200">
                <Tabs defaultActiveKey="1" items={items} />
            </Card>
        </div>
    );
}