import { Button, Dropdown, Tag, type MenuProps } from "antd";
import type { HookAPI } from "antd/es/modal/useModal";
import type { ColumnsType } from "antd/es/table";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import type { OdgjScheduleData } from "../../../../../types/odgjResidentType";
import {
  formatDate,
  getDisplayScheduleStatus,
  scheduleStatusColor,
  scheduleStatusLabel,
} from "../odgjUtils";

interface OdgjScheduleColumnProps {
  modal: HookAPI;
  onEdit: (record: OdgjScheduleData) => void;
  onDelete: (record: OdgjScheduleData) => void;
}

export const getOdgjScheduleColumns = ({
  modal,
  onEdit,
  onDelete,
}: OdgjScheduleColumnProps): ColumnsType<OdgjScheduleData> => [
  {
    title: "Tanggal Pemeriksaan",
    dataIndex: "examinationDate",
    key: "examinationDate",
    render: (date: string) => (
      <span className="font-medium text-gray-800">{formatDate(date)}</span>
    ),
  },
  {
    title: "Status",
    key: "status",
    width: 130,
    render: (_, record) => {
      const status = getDisplayScheduleStatus(record);
      return (
        <Tag color={scheduleStatusColor[status]}>
          {scheduleStatusLabel[status]}
        </Tag>
      );
    },
  },
  {
    title: "Catatan",
    dataIndex: "notes",
    key: "notes",
    render: (notes?: string | null) => notes || "-",
  },
  {
    title: "Aksi",
    key: "action",
    align: "center",
    width: 90,
    render: (_, record) => {
      const items: MenuProps["items"] = [
        {
          key: "edit",
          label: "Edit",
          icon: <Edit size={16} />,
          onClick: () => onEdit(record),
        },
        {
          key: "delete",
          label: "Hapus",
          icon: <Trash2 size={16} />,
          danger: true,
          onClick: () => {
            modal.confirm({
              title: "Hapus jadwal pemeriksaan?",
              content: `Jadwal tanggal ${formatDate(record.examinationDate)} akan dihapus.`,
              okText: "Hapus",
              okType: "danger",
              cancelText: "Batal",
              onOk: () => onDelete(record),
            });
          },
        },
      ];

      return (
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <Button type="text" icon={<MoreVertical size={18} />} />
        </Dropdown>
      );
    },
  },
];
