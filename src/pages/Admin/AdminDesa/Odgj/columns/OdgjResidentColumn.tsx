import {Button, Dropdown, Tag, type MenuProps} from 'antd';
import type {HookAPI} from 'antd/es/modal/useModal';
import type {ColumnsType} from 'antd/es/table';
import {CalendarDays, Edit, MoreVertical, Trash2} from 'lucide-react';
import type {OdgjResidentData} from '../../../../../types/odgjResidentType';
import {
  formatDate,
  getDisplayScheduleStatus,
  getPrimarySchedule,
  scheduleStatusColor,
  scheduleStatusLabel,
} from '../odgjUtils';

interface OdgjResidentColumnProps {
  pagination: {current: number; pageSize: number};
  modal: HookAPI;
  onManageSchedules: (record: OdgjResidentData) => void;
  onOpenCalendar: (record: OdgjResidentData) => void;
  onEdit: (record: OdgjResidentData) => void;
  onDelete: (record: OdgjResidentData) => void;
}

export const getOdgjResidentColumns = ({
  pagination,
  modal,
  onManageSchedules,
  onOpenCalendar,
  onEdit,
  onDelete,
}: OdgjResidentColumnProps): ColumnsType<OdgjResidentData> => [
  {
    title: 'No',
    key: 'index',
    width: 70,
    align: 'center',
    render: (_, __, index) =>
      (pagination.current - 1) * pagination.pageSize + index + 1,
  },
  {
    title: 'Nama Warga',
    key: 'fullname',
    render: (_, record) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">
          {record.resident?.fullname || '-'}
        </span>
        <span className="text-xs text-gray-500">
          NIK {record.resident?.userDetail?.nik || '-'}
        </span>
      </div>
    ),
  },
  {
    title: 'Wilayah',
    key: 'area',
    width: 160,
    render: (_, record) => (
      <Tag color="blue">
        RW {record.resident?.userDetail?.rukunWarga?.name || '-'} / RT{' '}
        {record.resident?.userDetail?.rukunTetangga?.name || '-'}
      </Tag>
    ),
  },
  {
    title: 'Jadwal Terdekat',
    key: 'primarySchedule',
    width: 170,
    render: (_, record) => {
      const schedule = getPrimarySchedule(record.schedules);
      return schedule ? formatDate(schedule.examinationDate) : '-';
    },
  },
  {
    title: 'Status',
    key: 'status',
    width: 130,
    render: (_, record) => {
      const schedule = getPrimarySchedule(record.schedules);
      if (!schedule) return <Tag>Belum Ada</Tag>;

      const status = getDisplayScheduleStatus(schedule);
      return (
        <Tag color={scheduleStatusColor[status]}>
          {scheduleStatusLabel[status]}
        </Tag>
      );
    },
  },
  {
    title: 'Jumlah Jadwal',
    key: 'scheduleCount',
    width: 140,
    align: 'center',
    render: (_, record) => record.schedules?.length || 0,
  },
  {
    title: 'Catatan',
    dataIndex: 'notes',
    key: 'notes',
    render: (notes?: string | null) => notes || '-',
  },
  {
    title: 'Aksi',
    key: 'action',
    align: 'center',
    width: 100,
    render: (_, record) => {
      const items: MenuProps['items'] = [
        {
          key: 'schedules',
          label: 'Kelola Jadwal',
          icon: <CalendarDays size={16} />,
          onClick: () => onManageSchedules(record),
        },
        {
          key: 'calendar',
          label: 'Lihat Kalender',
          icon: <CalendarDays size={16} />,
          onClick: () => onOpenCalendar(record),
        },
        {
          key: 'edit',
          label: 'Ubah Catatan',
          icon: <Edit size={16} />,
          onClick: () => onEdit(record),
        },
        {
          type: 'divider',
        },
        {
          key: 'delete',
          label: 'Hapus',
          icon: <Trash2 size={16} />,
          danger: true,
          onClick: () => {
            modal.confirm({
              title: 'Hapus warga ODGJ?',
              content: `Data ${record.resident?.fullname || 'warga'} dan seluruh jadwal pemeriksaannya akan dihapus.`,
              okText: 'Hapus',
              okType: 'danger',
              cancelText: 'Batal',
              onOk: () => onDelete(record),
            });
          },
        },
      ];

      return (
        <Dropdown menu={{items}} trigger={['click']} placement="bottomRight">
          <Button type="text" icon={<MoreVertical size={18} />} />
        </Dropdown>
      );
    },
  },
];
