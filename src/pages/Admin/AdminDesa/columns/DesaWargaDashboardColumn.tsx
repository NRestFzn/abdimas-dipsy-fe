import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface DesaWargaDataRow {
  UserId: string;
  fullname: string;
  nik?: string;
  lastSubmissionDate: string;
}

export const getDesaWargaDashboardColumn = (): ColumnsType<DesaWargaDataRow> => [
  {
    title: 'No',
    key: 'index',
    width: 60,
    align: 'center',
    render: (_, __, index) => index + 1,
  },
  {
    title: 'Nama Lengkap',
    dataIndex: 'fullname',
    key: 'fullname',
    render: (text) => <span className="font-medium text-gray-700">{text}</span>,
  },
  {
    title: 'Kondisi Mental',
    dataIndex: 'isMentalUnStable',
    key: 'isMentalUnStable',
    render: (condition) => {
      let color = "success"
      let label = "Berisiko"

      if (condition) {
        color = "error"
        label = "Berisiko"
      } else {
        color = "success"
        label = "Stabil"
      }

      return (
        <Tag color={color} className="m-0 text-center">
          {label}
        </Tag>
      )
    },
  },
  {
    title: 'Terakhir Submit',
    dataIndex: 'lastSubmissionDate',
    key: 'lastSubmissionDate',
    render: (date) => {
      if (!date) return "-";
      return (
        <div className="flex flex-col text-sm">
          <span className="font-medium">
            {new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
          </span>
          <span className="text-gray-400 text-xs">
            {new Date(date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      );
    },
  },
];