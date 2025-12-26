import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Avatar,
  Tag,
  Button,
  Skeleton,
  Divider,
  Descriptions,
  Result,
} from "antd";
import { Mail, Edit, ShieldCheck, ArrowLeft } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { adminMedisService } from "../../../../service/adminMedisService";
import EditAdminProfileModal from "./Partials/EditAdminProfileModal";
import { useNavigate } from "react-router";
import { getImageUrl } from "../../../../utils/imageHelper";
import UpdatePhotoModal from "./Partials/UpdatePhotoProfile";

export default function AdminProfile() {
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-medis", "me"],
    queryFn: adminMedisService.getMe,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Skeleton.Node active style={{ width: "100%", height: 400 }} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton active paragraph={{ rows: 6 }} />
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-screen">
        <Result
          status="error"
          title="Gagal Memuat Profil"
          subTitle="Terjadi kesalahan saat mengambil data profil Anda."
          extra={[
            <Button type="primary" onClick={() => refetch()} key="retry">
              Coba Lagi
            </Button>,
            <Button onClick={() => navigate("/responden")} key="home">
              Kembali ke Home
            </Button>,
          ]}
        />
      </div>
    );
  }

  const data = response?.data;
  const profilePictureUrl = getImageUrl(data.profilePicture);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            type="text"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-200 text-gray-600 font-medium flex items-center gap-x-2 px-0"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </Button>
          <Button
            icon={<Edit size={16} />}
            onClick={() => setIsEditOpen(true)}
            className="border-[#70B748] text-[#70B748] hover:bg-green-50 rounded-lg"
          >
            Edit Profil
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="shadow-sm border-gray-200 rounded-2xl overflow-hidden body-p-0">
            <div className="flex flex-col items-center py-8 bg-gradient-to-b from-white to-gray-50">
              <div
                className="mb-4 cursor-pointer"
                onClick={() => setIsPhotoModalOpen(true)}
              >
                <Avatar
                  size={128}
                  src={profilePictureUrl}
                  className="bg-gradient-to-br from-[#70B748] to-[#5a9639] text-white shadow-xl text-5xl font-bold border-4 border-white"
                >
                  {data.fullname.charAt(0).toUpperCase()}
                </Avatar>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {data.fullname}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 mb-4 font-medium">
                <Mail size={14} />
                {data.email}
              </div>

              <Tag
                color="green"
                className="px-4 py-1 rounded-full text-sm border-0 bg-green-100 text-green-700 font-semibold capitalize"
              >
                {data.role.name}
              </Tag>
            </div>

            <Divider className="my-0" />

            <div className="grid grid-cols-2 divide-x divide-gray-100 bg-white">
              <div className="p-4 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                  Role Akses
                </p>
                <p className="font-medium text-gray-700 capitalize flex items-center justify-center gap-2">
                  <ShieldCheck size={16} className="text-[#70B748]" />
                  {data.role.name}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                  Bergabung Sejak
                </p>
                <p className="font-medium text-gray-700">
                  {dayjs(data.createdAt).locale("id").format("DD MMM YYYY")}
                </p>
              </div>
            </div>
          </Card>

          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#70B748] rounded-full"></div>
                Informasi Detail
              </div>
            }
            className="shadow-sm border-gray-200 rounded-2xl"
            headStyle={{ borderBottom: "1px solid #f0f0f0" }}
          >
            <Descriptions
              column={1}
              layout="horizontal"
              labelStyle={{ width: "180px", color: "#6b7280" }}
              contentStyle={{ fontWeight: 500, color: "#374151" }}
            >
              <Descriptions.Item label="Nama Lengkap">
                {data.fullname}
              </Descriptions.Item>

              <Descriptions.Item label="Email">{data.email}</Descriptions.Item>

              <Descriptions.Item label="Jenis Kelamin">
                {data.gender === "m" ? "Laki-laki" : "Perempuan"}
              </Descriptions.Item>

              <Descriptions.Item label="Tanggal Lahir">
                {dayjs(data.birthDate).locale("id").format("DD MMMM YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <EditAdminProfileModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={data}
        />

        <UpdatePhotoModal
          open={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          currentPhotoUrl={profilePictureUrl}
          fullname={data.fullname}
        />
      </main>
    </div>
  );
}
