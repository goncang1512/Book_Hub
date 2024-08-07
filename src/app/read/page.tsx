"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaArrowLeft } from "react-icons/fa6";
import parse from "html-react-parser";
import { useSession } from "next-auth/react";

import styles from "@/lib/style.module.css";
import ProtectBook from "@/components/fragments/protectbook";
import { useChapter } from "@/lib/utils/useSwr";
import instance from "@/lib/utils/fetch";
import { MisiContext } from "@/lib/context/misicontext";
import { useMission } from "@/lib/swr/missionswr";
import { logger } from "@/lib/utils/logger";

const getSome = (misiUser: any, mission_id: string, status: boolean) => {
  return misiUser?.some((misi: any) => misi.mission_id === mission_id && misi.status === status);
};

const useUpdateSeconds = (
  novelMissionCompleted: boolean,
  cerpenMissionCompleted: boolean,
  session: any,
  bacaBuku: any,
  misiUser: any,
  setNovelMissionCompleted: Dispatch<SetStateAction<boolean>>,
  setCerpenMissionCompleted: Dispatch<SetStateAction<boolean>>,
) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addMisiUser } = useContext(MisiContext);

  const updateSeconds = useCallback(() => {
    setSeconds((prev) => {
      const newSeconds = prev + 1;
      sessionStorage.setItem("seconds", newSeconds.toString());
      return newSeconds;
    });
  }, []);

  useEffect(() => {
    const savedSeconds = sessionStorage.getItem("seconds");
    if (savedSeconds) {
      setSeconds(parseInt(savedSeconds, 10));
    } else {
      setSeconds(0);
    }

    if (!novelMissionCompleted || !cerpenMissionCompleted) {
      intervalRef.current = setInterval(updateSeconds, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [novelMissionCompleted, cerpenMissionCompleted, updateSeconds]);

  useEffect(() => {
    if (seconds >= 60) {
      setSeconds(0);
      sessionStorage.setItem("seconds", "0");
      const missionId =
        bacaBuku?.jenis === "Novel"
          ? "66b233b3672bbe53e753aa97"
          : bacaBuku?.jenis === "Cerpen"
            ? "66b233e4672bbe53e753aac3"
            : null;
      if (missionId) {
        addMisiUser(session?.user?._id, missionId, "Harian");
        if (bacaBuku?.jenis === "Novel") {
          setNovelMissionCompleted(getSome(misiUser, missionId, false));
        } else {
          setCerpenMissionCompleted(getSome(misiUser, missionId, false));
        }
      }
    }
  }, [seconds, novelMissionCompleted, cerpenMissionCompleted, bacaBuku, misiUser]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && intervalRef.current) {
        clearInterval(intervalRef.current);
      } else if (document.visibilityState === "visible") {
        if (!novelMissionCompleted || !cerpenMissionCompleted) {
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
  }, [novelMissionCompleted, cerpenMissionCompleted, updateSeconds]);

  useEffect(() => {
    if (novelMissionCompleted || cerpenMissionCompleted) {
      setSeconds(0);
      sessionStorage.setItem("seconds", "0");
    }
  }, [novelMissionCompleted, cerpenMissionCompleted]);

  return { seconds, setSeconds };
};

export default function ReadBook() {
  const router = useRouter();
  const { data: session }: any = useSession();
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");
  const chapter: any = searchParams.get("chapter");
  const status: any = searchParams.get("status");

  const { bacaBuku, bacaBukuLoading } = useChapter.readBook(id && id, chapter && chapter);
  const { misiUser } = useMission.getMission(session?.user?._id);

  useEffect(() => {
    const addReaders = async (user_id: string, chapter_id: string) => {
      try {
        await instance.put(`/api/read/${chapter_id}`, { user_id });
      } catch (error) {
        logger.error(`${error}`);
      }
    };

    if (bacaBukuLoading === false && status !== "check") {
      addReaders(session?.user?._id, chapter);
    }
  }, [chapter, session?.user?._id, bacaBukuLoading, status]);

  const [novelMissionCompleted, setNovelMissionCompleted] = useState<boolean>(false);
  const [cerpenMissionCompleted, setCerpenMissionCompleted] = useState<boolean>(false);

  useUpdateSeconds(
    novelMissionCompleted,
    cerpenMissionCompleted,
    session,
    bacaBuku,
    misiUser,
    setNovelMissionCompleted,
    setCerpenMissionCompleted,
  );

  useEffect(() => {
    if (misiUser?.length > 0) {
      setNovelMissionCompleted(getSome(misiUser, "66b233b3672bbe53e753aa97", true));
      setCerpenMissionCompleted(getSome(misiUser, "66b233e4672bbe53e753aac3", true));
    }
  }, [misiUser]);

  return (
    <ProtectBook>
      <div className="flex">
        <div className={`relative flex flex-col w-full md:mr-[38%] mr-0 border-r h-full`}>
          <div className="flex items-center justify-between border-b py-5 pl-2 gap-5 z-20 fixed top-0 md:left-[288px] left-0 bg-white md:w-[50.2%] w-full">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()}>
                <FaArrowLeft size={25} />
              </button>
              <h1 className="text-xl font-bold">Back</h1>
            </div>
            <p className="pr-5">
              Chapter <span className="font-bold">{bacaBuku?.chapter}</span>
            </p>
          </div>

          <div className="p-3 pt-20">
            {bacaBukuLoading ? (
              <div className="h-screen w-full flex items-center justify-center">
                <span className="loading loading-bars loading-lg" />
              </div>
            ) : (
              <>
                <div className={`${styles.noSelect}`}>{parse(`${bacaBuku?.story}`)}</div>
              </>
            )}
          </div>

          {/* Prev and Next Button */}
          <div
            className={`flex items-center pb-2 ${
              !bacaBuku?.prevChapter ? "justify-end" : "justify-between"
            } px-4`}
          >
            {bacaBuku?.prevChapter && (
              <Link
                className="p-2 bg-gray-300 rounded-lg"
                href={`/read?id=${id}&chapter=${bacaBuku?.prevChapter}`}
              >
                prev
              </Link>
            )}
            {bacaBuku?.nextChapter && (
              <Link
                className="p-2 bg-gray-300 rounded-lg"
                href={`/read?id=${id}&chapter=${bacaBuku?.nextChapter}`}
              >
                next
              </Link>
            )}
          </div>
        </div>
      </div>
    </ProtectBook>
  );
}
