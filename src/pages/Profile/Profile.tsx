import { useNavigate } from "react-router";
import {
  Card,
  Avatar,
  Tag,
  Descriptions,
  Button,
  Skeleton,
  Divider,
  Result,
} from "antd";
import { ArrowLeft, Edit, Camera } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";

import { useResident } from "../../hooks/useResident";
import { useState } from "react";
import EditProfileModal from "./Partials/EditModal";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import UpdatePhotoModal from "./Partials/UpdatePhotoProfile";
import { getImageUrl } from "../../utils/imageHelper";

export default function Profile() {
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = useResident();

  const formatCurrency = (val: string) => {
    return parseInt(val).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });
  };

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
            <Button onClick={() => navigate("/")} key="home">
              Kembali ke Home
            </Button>,
          ]}
        />
      </div>
    );
  }

  const profile = response.data;
  const profilePictureUrl = getImageUrl(profile.profilePicture);
  const userDetail = profile.userDetail

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            type="text"
            onClick={() => navigate("/")}
            className="hover:bg-gray-200 text-gray-600 font-medium flex items-center gap-x-2 px-0"
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Beranda</span>
          </Button>
          <Button
            icon={<Edit size={16} />}
            onClick={() => setIsEditModalOpen(true)}
            className="border-[#70B748] text-[#70B748] hover:bg-green-50"
          >
            Edit Profil
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="shadow-sm border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex flex-col items-center py-8 bg-gradient-to-b from-white to-gray-50">
              <div
                className="relative group mb-4 cursor-pointer transition-transform hover:scale-105"
                onClick={() => setIsPhotoModalOpen(true)}
              >
                <Avatar
                  size={128}
                  src={profilePictureUrl}
                  className="bg-gradient-to-br from-[#70B748] to-[#5a9639] text-white shadow-xl text-5xl font-bold border-4 border-white"
                >
                  {profile.fullname.charAt(0).toUpperCase()}
                </Avatar>

                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="text-white w-8 h-8" />
                </div>

                <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md z-10 pointer-events-none">
                  <Tag
                    color={userDetail.gender === "m" ? "blue" : "magenta"}
                    className="m-0 px-2 rounded-full font-bold flex items-center gap-1"
                  >
                    {userDetail.gender === "m" ? (
                      <BsGenderMale />
                    ) : (
                      <BsGenderFemale />
                    )}
                  </Tag>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {profile.fullname}
              </h2>
              <p className="text-gray-500 mb-4 font-medium">{profile.email}</p>

              <Tag
                color="green"
                className="px-4 py-1 rounded-full text-sm border-0 bg-green-100 text-green-700 font-semibold"
              >
                Warga Aktif
              </Tag>
            </div>

            <Divider className="my-0" />

            <div className="grid grid-cols-2 divide-x divide-gray-100 bg-white">
              <div className="p-4 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  No Induk Kependudukan
                </p>
                <p className="font-mono font-medium text-gray-700">
                  {profile.userDetail.nik}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Terdaftar Sejak
                </p>
                <p className="font-medium text-gray-700">
                  {dayjs(profile.userDetail.createdAt)
                    .locale("id")
                    .format("DD MMM YYYY")}
                </p>
              </div>
            </div>
          </Card>

          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#70B748] rounded-full"></div>{" "}
                Informasi Pribadi
              </div>
            }
            className="shadow-sm border-gray-200 rounded-2xl"
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <Descriptions
              column={1}
              layout="horizontal"
              labelStyle={{ width: "180px", color: "#6b7280" }}
              contentStyle={{ fontWeight: 500, color: "#374151" }}
            >
              <Descriptions.Item label="Jenis Kelamin">
                {userDetail.gender === "m" ? "Laki-Laki" : "Perempuan"}
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal Lahir">
                {dayjs(userDetail.birthDate).locale("id").format("DD MMMM YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Nomor Telepon">
                {profile.userDetail.phoneNumber || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status Pernikahan">
                {profile.userDetail.marriageStatus.name}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded-full"></div>{" "}
                Domisili & Pekerjaan
              </div>
            }
            className="shadow-sm border-gray-200 rounded-2xl"
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <Descriptions
              column={1}
              layout="horizontal"
              labelStyle={{ width: "180px", color: "#6b7280" }}
              contentStyle={{ fontWeight: 500, color: "#374151" }}
            >
              <Descriptions.Item label="Wilayah Tinggal">
                RW {String(profile.userDetail.rukunWarga.name).padStart(2, "0")}{" "}
                / RT{" "}
                {String(profile.userDetail.rukunTetangga.name).padStart(2, "0")}
              </Descriptions.Item>
              <Descriptions.Item label="Pendidikan Terakhir">
                {profile.userDetail.education.name}
              </Descriptions.Item>
              <Descriptions.Item label="Pekerjaan">
                {profile.userDetail.profession}
              </Descriptions.Item>
              <Descriptions.Item label="Rentang Pendapatan">
                {formatCurrency(profile.userDetail.salaryRange.minRange)} -{" "}
                {formatCurrency(profile.userDetail.salaryRange.maxRange)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <EditProfileModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={profile}
        />

        <UpdatePhotoModal
          open={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          currentPhotoUrl={profilePictureUrl}
          fullname={profile.fullname}
        />
      </main>
    </div>
  );
}
