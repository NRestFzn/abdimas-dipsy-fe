import { Button, Card, Modal, Tag } from "antd";
import { Clock, Coffee, FileText, Heart, Info, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface WelcomeHeaderProps {
  fullname: string;
}

export const WelcomeHeader = ({ fullname }: WelcomeHeaderProps) => {
  const currentHour = new Date().getHours();
  let greeting = "Selamat Pagi";
  if (currentHour >= 11 && currentHour < 15) greeting = "Selamat Siang";
  else if (currentHour >= 15 && currentHour < 18) greeting = "Selamat Sore";
  else if (currentHour >= 18) greeting = "Selamat Malam";

  const firstName = fullname?.split(" ")[0] || "Warga";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#70B748] to-[#5a9e36] text-white shadow-lg mb-10 transition-all hover:shadow-xl">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 opacity-20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 opacity-90">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10 shadow-sm">
              {dayjs().locale("id").format("dddd, D MMMM YYYY")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
            {greeting}, {firstName}! 👋
          </h1>

          <p className="text-green-50 max-w-2xl text-sm sm:text-base leading-relaxed opacity-95 font-medium">
            Bagaimana kabarmu hari ini? Yuk, luangkan waktu sejenak untuk mengecek kondisi kesehatan mentalmu. Kami siap mendengarkan.
          </p>
        </div>
      </div>
    </div>
  );
};

interface AttentionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AttentionModal = (props: AttentionModalProps) => {
  const { open, onClose, onConfirm } = props

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-[#70B748]">
          <Info size={24} />
          <span className="text-xl font-bold">Sebelum Memulai...</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Nanti Saja
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="!bg-[#70B748] !hover:bg-[#5a9639]"
          size="large"
          onClick={onConfirm}
        >
          Saya Siap & Lanjut
        </Button>,
      ]}
      centered
      width={500}
    >
      <div className="py-4">
        <p className="text-gray-600 mb-4 text-base">
          Halo! Agar hasil tes ini akurat dan bermanfaat untukmu, mohon perhatikan hal-hal berikut:
        </p>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="bg-blue-50 p-2 rounded-full h-fit text-blue-500">
              <Coffee size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Cari Tempat Tenang</h4>
              <p className="text-sm text-gray-500">Pastikan kamu merasa nyaman dan tidak terburu-buru saat mengisi.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-pink-50 p-2 rounded-full h-fit text-pink-500">
              <Heart size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Jujur pada Diri Sendiri</h4>
              <p className="text-sm text-gray-500">Tidak ada jawaban benar atau salah. Jawablah sesuai dengan apa yang kamu rasakan saat ini.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-yellow-50 p-2 rounded-full h-fit text-yellow-500">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Hasil Bersifat Rahasia</h4>
              <p className="text-sm text-gray-500">Jawabanmu aman dan hanya digunakan untuk keperluan analisa medis.</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

interface QuestionnaireCardProps {
  id: string;
  title: string;
  description: string;
  disabled: boolean;
  availableAt: string | null;
  onStart: (id: string) => void;
  onRefresh: () => void;
}

export const QuestionnaireCard = ({
  id,
  title,
  description,
  onStart,
  disabled,
  availableAt,
  onRefresh,
}: QuestionnaireCardProps) => {
  const [timerString, setTimerString] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (disabled || !availableAt) return;

    const updateTimer = () => {
      const now = dayjs();
      const target = dayjs(availableAt);
      const diff = target.diff(now);

      if (diff <= 0) {
        onRefresh();
        return;
      }

      const dur = dayjs.duration(diff);

      if (dur.asYears() >= 1) {
        setTimerString(`${Math.floor(dur.asYears())} Tahun`);
      } else if (dur.asMonths() >= 1) {
        const daysLeft = Math.floor(dur.asDays() % 30);
        setTimerString(
          `${Math.floor(dur.asMonths())} Bulan ${daysLeft > 0 ? `${daysLeft} Hari` : ""
          }`
        );
      } else if (dur.asWeeks() >= 1) {
        const daysLeft = Math.floor(dur.asDays() % 7);
        setTimerString(
          `${Math.floor(dur.asWeeks())} Minggu ${daysLeft > 0 ? `${daysLeft} Hari` : ""
          }`
        );
      } else if (dur.asDays() >= 1) {
        setTimerString(
          `${Math.floor(dur.asDays())} Hari ${dur.hours() > 0 ? `${dur.hours()} Jam` : ""
          }`
        );
      } else {
        const hours = Math.floor(dur.asHours());
        const minutes = dur.minutes();
        const seconds = dur.seconds();

        const parts = [];
        if (hours > 0) parts.push(`${hours} Jam`);
        if (minutes > 0) parts.push(`${minutes} Menit`);
        parts.push(`${seconds} Detik`);

        setTimerString(parts.join(" "));
      }
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [disabled, availableAt, onRefresh]);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmStart = () => {
    setIsModalOpen(false);
    onStart(id);
  };

  return (
    <>
      <Card
        hoverable
        className={`h-full flex flex-col border-gray-200 transition-all duration-300 group ${disabled ? "hover:border-[#70B748]" : "opacity-80 bg-gray-50"
          }`}
        styles={{
          body: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "24px",
          }
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-lg transition-colors duration-300 ${disabled ? "bg-green-50 group-hover:bg-[#70B748]" : "bg-gray-200"
              }`}
          >
            <FileText
              className={`w-6 h-6 transition-colors ${disabled
                ? "text-[#70B748] group-hover:text-white"
                : "text-gray-500"
                }`}
            />
          </div>

          {disabled ? (
            <Tag color="success" className="mr-0">
              Tersedia
            </Tag>
          ) : (
            <Tag color="warning" className="mr-0">
              Cooldown
            </Tag>
          )}
        </div>

        <div className="flex-1 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
            {description || "Tidak ada deskripsi tersedia."}
          </p>
        </div>

        <Button
          type="primary"
          size="large"
          disabled={!disabled}
          className={`border-none h-10 font-medium !flex items-center justify-center gap-2 ${disabled
            ? "!bg-[#70B748] !hover:bg-[#5a9639]"
            : "!bg-gray-300 !text-gray-600 cursor-not-allowed"
            }`}
          onClick={handleCardClick}
        >
          {disabled ? (
            <div className="flex items-center gap-x-2">
              <PlayCircle size={18} />
              Mulai Mengerjakan
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <Clock size={18} />
              {timerString ? `Tersedia dlm ${timerString}` : "Sedang Cooldown"}
            </div>
          )}
        </Button>
      </Card>
      <AttentionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmStart} />
    </>
  );
};
