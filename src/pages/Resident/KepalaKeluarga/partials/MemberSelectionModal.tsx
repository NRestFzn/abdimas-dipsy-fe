import { Modal, Card, Button } from "antd";

interface Member {
    id: string;
    user: {
        id: string;
        fullname: string;
        email: string;
    };
}

interface Props {
    open: boolean;
    members: Member[];
    onSelect: (user: Member["user"]) => void;
    onCancel: () => void;
}

export default function MemberSelectionModal({ open, members, onSelect, onCancel }: Props) {
    return (
        <Modal
            title="Pilih Anggota Keluarga"
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <div className="flex flex-col gap-3 mt-4">
                {members.map((member) => (
                    <Card
                        key={member.id}
                        hoverable
                        className="cursor-pointer border border-gray-200"
                        onClick={() => onSelect(member.user)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold">{member.user?.fullname}</div>
                                <div className="text-xs text-gray-500">{member.user?.email}</div>
                            </div>
                            <Button type="primary" size="small" className="bg-amber-500 hover:bg-amber-600">
                                Pilih
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </Modal>
    );
}
