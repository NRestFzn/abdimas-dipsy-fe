import { Button, Card, Modal, Tooltip } from "antd";
import { AlertCircle, Clock, Coffee, FileText, Heart, Info, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { PiFolderStarLight } from "react-icons/pi";

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
  category?: string;
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
  category,
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
      if (dur.asYears() >= 1) setTimerString(`${Math.floor(dur.asYears())} Tahun`);
      else if (dur.asMonths() >= 1) {
        const days = Math.floor(dur.asDays() % 30);
        setTimerString(`${Math.floor(dur.asMonths())} Bulan ${days > 0 ? `${days} Hari` : ""}`);
      } else if (dur.asWeeks() >= 1) {
        const days = Math.floor(dur.asDays() % 7);
        setTimerString(`${Math.floor(dur.asWeeks())} Minggu ${days > 0 ? `${days} Hari` : ""}`);
      } else if (dur.asDays() >= 1) {
        setTimerString(`${Math.floor(dur.asDays())} Hari ${dur.hours() > 0 ? `${dur.hours()} Jam` : ""}`);
      } else {
        const h = Math.floor(dur.asHours());
        const m = dur.minutes();
        const s = dur.seconds();
        const parts = [];
        if (h > 0) parts.push(`${h}j`);
        if (m > 0) parts.push(`${m}m`);
        parts.push(`${s}s`);
        setTimerString(parts.join(" "));
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [disabled, availableAt, onRefresh]);

  const handleCardClick = () => {
    if (disabled) setIsModalOpen(true);
  };

  const handleConfirmStart = () => {
    setIsModalOpen(false);
    onStart(id);
  };

  return (
    <>
      <Card
        hoverable
        className={`h-full flex flex-col border border-gray-200 rounded-2xl transition-all duration-300 group overflow-hidden ${disabled ? "hover:border-[#70B748] hover:shadow-md bg-white" : "bg-gray-50/80"
          }`}
        styles={{
          body: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "20px",
          },
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            <PiFolderStarLight size={14} className="text-blue-500" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {category || "Umum"}
            </span>
          </div>

          {disabled ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold">Tersedia</span>
            </div>
          ) : (
            <Tooltip title="Anda baru saja mengerjakan ini. Harap tunggu waktu cooldown berakhir.">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 cursor-help">
                <AlertCircle size={12} />
                <span className="text-xs font-bold">Cooldown</span>
              </div>
            </Tooltip>
          )}
        </div>

        <div className="flex-1 mb-5">
          <h3
            className={`text-lg font-bold mb-2 line-clamp-2 leading-snug transition-colors ${disabled ? "text-gray-800 group-hover:text-[#70B748]" : "text-gray-500"
              }`}
          >
            {title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
            {description || "Tidak ada deskripsi tersedia untuk kuesioner ini."}
          </p>
        </div>

        <Button
          type="primary"
          size="large"
          disabled={!disabled}
          onClick={handleCardClick}
          className={`!w-full h-11 font-semibold rounded-xl border-none shadow-none transition-all duration-300 !flex !items-center !justify-center gap-2 ${disabled
            ? "bg-[#70B748] hover:!bg-[#5a9639] hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {disabled ? (
            <div className="flex items-center justify-center gap-x-2">
              <PlayCircle size={18} />
              <span>Mulai Mengerjakan</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-x-2">
              <Clock size={18} />
              <span className="text-sm">{timerString || "Menunggu..."}</span>
            </div>
          )}
        </Button>
      </Card>

      <AttentionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStart}
      />
    </>
  );
};
