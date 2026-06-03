import { useMemo, useState } from "react";
import { App, Breadcrumb, Button, Input, Pagination, Table } from "antd";
import { CalendarDays, Plus, Search } from "lucide-react";
import { useDeleteOdgjResident, useOdgjResidents } from "../../../../hooks/Admin/AdminDesa/useOdgjResident";
import type { OdgjResidentData } from "../../../../types/odgjResidentType";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getOdgjResidentColumns } from "./columns/OdgjResidentColumn";
import OdgjFormModal from "./partials/OdgjFormModal";
import ScheduleCalendarModal from "./partials/ScheduleCalendarModal";
import ScheduleManagerModal from "./partials/ScheduleManagerModal";

export default function OdgjManagement() {
  const { message, modal } = App.useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [scheduleManagerOpen, setScheduleManagerOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [editingData, setEditingData] = useState<OdgjResidentData | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<OdgjResidentData | null>(
    null
  );
  const [calendarFocusRecord, setCalendarFocusRecord] =
    useState<OdgjResidentData | null>(null);
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const deleteMutation = useDeleteOdgjResident();

  const tableQuery = useOdgjResidents({
    page: pagination.current,
    pageSize: pagination.pageSize,
    fullname: activeSearch || undefined,
    order: '[["createdAt", "desc"]]',
  });

  const calendarQuery = useOdgjResidents({
    page: 1,
    pageSize: 500,
    order: '[["createdAt", "desc"]]',
  });

  const dataSource = tableQuery.data?.data || [];
  const totalData = tableQuery.data?.meta?.pagination.total || 0;
  const activeSelectedRecord = useMemo(() => {
    if (!selectedRecord) return null;
    return dataSource.find((record) => record.id === selectedRecord.id) || selectedRecord;
  }, [dataSource, selectedRecord]);
  const calendarRecords = useMemo(() => {
    const records = calendarQuery.data?.data || [];

    if (
      calendarFocusRecord &&
      !records.some((record) => record.id === calendarFocusRecord.id)
    ) {
      return [calendarFocusRecord, ...records];
    }

    return records;
  }, [calendarFocusRecord, calendarQuery.data?.data]);

  const handleSearch = () => {
    setActiveSearch(searchText.trim());
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleDelete = async (record: OdgjResidentData) => {
    try {
      await deleteMutation.mutateAsync(record.id);
      message.success("Data warga ODGJ berhasil dihapus");
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const columns = getOdgjResidentColumns({
    pagination,
    modal,
    onManageSchedules: (record) => {
      setSelectedRecord(record);
      setScheduleManagerOpen(true);
    },
    onOpenCalendar: (record) => {
      setCalendarFocusRecord(record);
      setCalendarOpen(true);
    },
    onEdit: (record) => {
      setEditingData(record);
      setFormOpen(true);
    },
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Pengelolaan Warga ODGJ
          </h1>
          <Breadcrumb
            items={[{ title: "Dashboard" }, { title: "Warga ODGJ" }]}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            icon={<CalendarDays size={16} />}
            onClick={() => {
              setCalendarFocusRecord(null);
              setCalendarOpen(true);
            }}
          >
            Kalender Pemeriksaan
          </Button>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            className="!bg-[#70B748]"
            onClick={() => {
              setEditingData(null);
              setFormOpen(true);
            }}
          >
            Tambah Warga ODGJ
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            allowClear
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              if (!event.target.value) {
                setActiveSearch("");
                setPagination((prev) => ({ ...prev, current: 1 }));
              }
            }}
            onPressEnter={handleSearch}
            placeholder="Cari nama warga"
            className="w-full md:max-w-sm"
            prefix={<Search size={16} className="text-gray-400" />}
          />
          <Button onClick={handleSearch}>Cari</Button>
        </div>

        <Table<OdgjResidentData>
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={
            tableQuery.isLoading ||
            tableQuery.isFetching ||
            deleteMutation.isPending
          }
          pagination={false}
          scroll={{ x: 1000 }}
        />

        <div className="flex justify-end py-4">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={totalData}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} dari ${total} warga ODGJ`
            }
            onChange={(page, pageSize) =>
              setPagination({ current: page, pageSize })
            }
            showSizeChanger
          />
        </div>
      </div>

      <OdgjFormModal
        open={formOpen}
        editingData={editingData}
        onCancel={() => {
          setFormOpen(false);
          setEditingData(null);
        }}
      />

      <ScheduleManagerModal
        open={scheduleManagerOpen}
        odgjResident={activeSelectedRecord}
        onCancel={() => {
          setScheduleManagerOpen(false);
          setSelectedRecord(null);
        }}
      />

      <ScheduleCalendarModal
        open={calendarOpen}
        records={calendarRecords}
        focusRecord={calendarFocusRecord}
        loading={calendarQuery.isLoading || calendarQuery.isFetching}
        onClose={() => {
          setCalendarOpen(false);
          setCalendarFocusRecord(null);
        }}
      />
    </div>
  );
}
