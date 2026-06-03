import { useState } from "react";
import { App, Button, Empty, Modal, Table } from "antd";
import { Plus } from "lucide-react";
import { useDeleteOdgjSchedule } from "../../../../../hooks/Admin/AdminDesa/useOdgjResident";
import type {
  OdgjResidentData,
  OdgjScheduleData,
} from "../../../../../types/odgjResidentType";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import { getOdgjScheduleColumns } from "../columns/OdgjScheduleColumn";
import ScheduleFormModal from "./ScheduleFormModal";

interface ScheduleManagerModalProps {
  open: boolean;
  odgjResident: OdgjResidentData | null;
  onCancel: () => void;
}

export default function ScheduleManagerModal({
  open,
  odgjResident,
  onCancel,
}: ScheduleManagerModalProps) {
  const { message, modal } = App.useApp();
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<OdgjScheduleData | null>(null);
  const deleteSchedule = useDeleteOdgjSchedule();

  const handleDeleteSchedule = async (schedule: OdgjScheduleData) => {
    if (!odgjResident) return;

    try {
      await deleteSchedule.mutateAsync({
        odgjResidentId: odgjResident.id,
        scheduleId: schedule.id,
      });
      message.success("Jadwal pemeriksaan berhasil dihapus");
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const columns = getOdgjScheduleColumns({
    modal,
    onEdit: (schedule) => {
      setEditingSchedule(schedule);
      setScheduleFormOpen(true);
    },
    onDelete: handleDeleteSchedule,
  });

  return (
    <>
      <Modal
        title={`Kelola Jadwal ${odgjResident?.resident?.fullname || ""}`}
        open={open}
        onCancel={onCancel}
        footer={null}
        width={820}
        centered
      >
        <div className="mb-4 flex justify-end">
          <Button
            type="primary"
            icon={<Plus size={16} />}
            className="!bg-[#70B748]"
            onClick={() => {
              setEditingSchedule(null);
              setScheduleFormOpen(true);
            }}
          >
            Tambah Jadwal
          </Button>
        </div>

        <Table<OdgjScheduleData>
          columns={columns}
          dataSource={odgjResident?.schedules || []}
          rowKey="id"
          pagination={false}
          loading={deleteSchedule.isPending}
          scroll={{ x: 650 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Belum ada jadwal pemeriksaan"
              />
            ),
          }}
        />
      </Modal>

      <ScheduleFormModal
        open={scheduleFormOpen}
        odgjResident={odgjResident}
        editingSchedule={editingSchedule}
        onCancel={() => {
          setScheduleFormOpen(false);
          setEditingSchedule(null);
        }}
      />
    </>
  );
}
