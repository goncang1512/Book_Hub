import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const timeAgo = (tanggal: Date) => {
  if (!tanggal) return "Invalid date";
  const date = new Date(tanggal);
  const timeAgo = formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: false,
    locale: id,
  });

  let formattedTimeAgo = timeAgo
    .replace("sekitar", "") // Hapus kata "sekitar"
    .replace("yang", "") // Hapus kata "yang"
    .replace("jam", "j") // Ganti "jam" dengan "j"
    .replace("menit", "m") // Ganti "menit" dengan "m"
    .replace("hari", "h") // Ganti "hari" dengan "h"
    .replace("detik", "s") // Ganti "detik" dengan "s"
    .replace("lalu", "") // Hapus kata "lalu"
    .trim(); // Trim whitespace

  if (formattedTimeAgo === "kurang dari 1 m") {
    const secondsAgo = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    formattedTimeAgo = `${secondsAgo} s`;
  } else if (formattedTimeAgo.includes("tahun")) {
    const yearsAgo = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 3600 * 24 * 365));
    formattedTimeAgo = `${yearsAgo} y`;
  }
  return formattedTimeAgo;
};

export function formatDate(timestamp: Date, tipe: boolean) {
  const dateObject = new Date(timestamp);

  if (isNaN(dateObject.getTime())) return;
  let options: any = {
    month: "long",
    year: "numeric",
  };

  if (tipe) {
    options.day = "numeric";
  }

  const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(dateObject);
  return formattedDate;
}

export const TimeDow = (): {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
} => {
  // TAHUN BULAN TANGGAL
  const tahun = process.env.NEXT_PUBLIC_THN_SEASON;
  const tanggal = process.env.NEXT_PUBLIC_TGL_SEASON;
  const bulan = process.env.NEXT_PUBLIC_BLN_SEASON;
  const startDate: Date = new Date(Number(tahun), Number(bulan), Number(tanggal));
  const targetDate: Date = new Date(startDate);
  targetDate.setMonth(targetDate.getMonth() + 3);

  const now: Date = new Date();
  const difference: number = targetDate.getTime() - now.getTime();

  let timeLeft: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  } = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};
