import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MisiContext } from "@/lib/context/misicontext";

export const getSome = (misiUser: any, mission_id: string, status: boolean) => {
  return misiUser?.some((misi: any) => misi.mission_id === mission_id && misi.status === status);
};

export const useUpdateSeconds = (
  novelMissionCompleted: boolean,
  cerpenMissionCompleted: boolean,
  session: any,
  bacaBuku: any,
  misiUser: any,
  setNovelMissionCompleted: Dispatch<SetStateAction<boolean>>,
  setCerpenMissionCompleted: Dispatch<SetStateAction<boolean>>,
  statusSession: string,
  status: string,
) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addMisiUser } = useContext(MisiContext);

  const updateSeconds = useCallback(() => {
    setSeconds((prev) => {
      const newSeconds = prev + 1;
      const key = bacaBuku?.jenis === "Novel" ? "novelSeconds" : "cerpenSeconds";
      sessionStorage.setItem(key, newSeconds.toString());
      return newSeconds;
    });
  }, [bacaBuku?.jenis]);

  useEffect(() => {
    if (statusSession === "unauthenticated" || status === "check") return;

    const key = bacaBuku?.jenis === "Novel" ? "novelSeconds" : "cerpenSeconds";
    const savedSeconds = sessionStorage.getItem(key);
    if (savedSeconds) {
      setSeconds(parseInt(savedSeconds, 10));
    } else {
      setSeconds(0);
    }

    if (
      (bacaBuku?.jenis === "Novel" && !novelMissionCompleted) ||
      (bacaBuku?.jenis === "Cerpen" && !cerpenMissionCompleted)
    ) {
      intervalRef.current = setInterval(updateSeconds, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    statusSession,
    status,
    novelMissionCompleted,
    cerpenMissionCompleted,
    updateSeconds,
    bacaBuku,
  ]);

  useEffect(() => {
    if (statusSession === "unauthenticated" || status === "check") return;

    if (seconds >= 60) {
      setSeconds(0);
      const key = bacaBuku?.jenis === "Novel" ? "novelSeconds" : "cerpenSeconds";
      sessionStorage.setItem(key, "0");

      const missionId =
        bacaBuku?.jenis === "Novel"
          ? "66b233b3672bbe53e753aa97"
          : bacaBuku?.jenis === "Cerpen"
            ? "66b233e4672bbe53e753aac3"
            : null;

      if (missionId) {
        if (bacaBuku?.jenis === "Novel" && !novelMissionCompleted) {
          addMisiUser(session?.user?._id, missionId, "Harian");
          if (getSome(misiUser, missionId, true)) {
            setNovelMissionCompleted(true);
          }
        } else if (bacaBuku?.jenis === "Cerpen" && !cerpenMissionCompleted) {
          addMisiUser(session?.user?._id, missionId, "Harian");
          if (getSome(misiUser, missionId, true)) {
            setCerpenMissionCompleted(true);
          }
        }
      }
    }
  }, [
    statusSession,
    status,
    seconds,
    novelMissionCompleted,
    cerpenMissionCompleted,
    bacaBuku,
    misiUser,
    addMisiUser,
    session?.user?._id,
    setNovelMissionCompleted,
    setCerpenMissionCompleted,
  ]);

  useEffect(() => {
    if (statusSession === "unauthenticated" || status === "check") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && intervalRef.current) {
        clearInterval(intervalRef.current);
      } else if (document.visibilityState === "visible") {
        if (
          (bacaBuku?.jenis === "Novel" && !novelMissionCompleted) ||
          (bacaBuku?.jenis === "Cerpen" && !cerpenMissionCompleted)
        ) {
          intervalRef.current = setInterval(updateSeconds, 1000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    statusSession,
    status,
    novelMissionCompleted,
    cerpenMissionCompleted,
    updateSeconds,
    bacaBuku,
  ]);

  useEffect(() => {
    if (statusSession === "unauthenticated" || status === "check") return;

    if (novelMissionCompleted || cerpenMissionCompleted) {
      setSeconds(0);
      const key = bacaBuku?.jenis === "Novel" ? "novelSeconds" : "cerpenSeconds";
      sessionStorage.setItem(key, "0");
    }
  }, [statusSession, status, novelMissionCompleted, cerpenMissionCompleted]);

  return { seconds, setSeconds };
};
