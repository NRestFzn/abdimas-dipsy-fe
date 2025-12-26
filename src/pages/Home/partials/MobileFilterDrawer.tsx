import { Drawer, Select, DatePicker, Button } from "antd";
import { X } from "lucide-react";

const { RangePicker } = DatePicker;

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  questionnaires: any[];
  selectedQuizFilter: string;
  setSelectedQuizFilter: (value: string) => void;
  setDateRange: (dates: [string, string] | null) => void;
  onReset: () => void;
}

export const MobileFilterDrawer = ({
  open,
  onClose,
  questionnaires,
  selectedQuizFilter,
  setSelectedQuizFilter,
  setDateRange,
  onReset,
}: MobileFilterDrawerProps) => {
  return (
    <Drawer
      title="Filter Riwayat"
      placement="bottom"
      onClose={onClose}
      open={open}
      height="auto"
      className="rounded-t-2xl"
      styles={{ body: { paddingBottom: 40 } }}
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Berdasarkan Kuesioner
          </label>
          <Select
            value={selectedQuizFilter}
            className="w-full"
            size="large"
            onChange={setSelectedQuizFilter}
            options={[
              { value: "all", label: "Semua Kuesioner" },
              ...(questionnaires || []).map((q) => ({
                value: q.id,
                label: q.title,
              })),
            ]}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Rentang Tanggal
          </label>
          <RangePicker
            className="w-full"
            size="large"
            onChange={(dates, dateStrings) => {
              if (dates) {
                setDateRange(dateStrings as [string, string]);
              } else {
                setDateRange(null);
              }
            }}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Button 
            block 
            size="large" 
            onClick={() => {
              onReset();
              onClose();
            }} 
            icon={<X size={16} />}
          >
            Reset
          </Button>
          <Button
            type="primary"
            block
            size="large"
            onClick={onClose}
            className="bg-[#70B748] hover:bg-[#5a9e36] border-none"
          >
            Terapkan Filter
          </Button>
        </div>
      </div>
    </Drawer>
  );
};