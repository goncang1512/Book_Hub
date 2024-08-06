"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import parse from "html-react-parser";
import { useSession } from "next-auth/react";

import styles from "@/lib/style.module.css";
import ProtectBook from "@/components/fragments/protectbook";
import { useChapter } from "@/lib/utils/useSwr";
import instance from "@/lib/utils/fetch";
import { MisiContext } from "@/lib/context/misicontext";
import { useMission } from "@/lib/swr/missionswr";

const getSome = (misiUser: any, mission_id: string, status: boolean) => {
  return misiUser?.some((misi: any) => misi.mission_id === mission_id && misi.status === status);
};

export default function ReadBook() {
  const router = useRouter();
  const { data: session }: any = useSession();
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");
  const chapter: any = searchParams.get("chapter");
  const status: any = searchParams.get("status");

  const { bacaBuku, bacaBukuLoading } = useChapter.readBook(id && id, chapter && chapter);
  const { addMisiUser } = useContext(MisiContext);
  const { misiUser } = useMission.getMission(session?.user?._id);

  useEffect(() => {
    const addReaders = async (user_id: string, chapter_id: string) => {
      try {
        await instance.put(`/api/read/${chapter_id}`, { user_id });
      } catch (error) {
        console.log(error);
      }
    };

    if (bacaBukuLoading === false && status !== "check") {
      addReaders(session?.user?._id, chapter);
    }
  }, [chapter, session?.user?._id, bacaBukuLoading, status]);

  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [novelMissionCompleted, setNovelMissionCompleted] = useState<boolean>(false);
  const [cerpenMissionCompleted, setCerpenMissionCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (misiUser?.length > 0) {
      setNovelMissionCompleted(getSome(misiUser, "66b233b3672bbe53e753aa97", true));
      setCerpenMissionCompleted(getSome(misiUser, "66b233e4672bbe53e753aac3", true));
    }
  }, [misiUser]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setSeconds(0);

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [id, chapter]);

  useEffect(() => {
    if (seconds >= 60) {
      setSeconds(0);
      if (!novelMissionCompleted && bacaBuku?.jenis === "Novel") {
        addMisiUser(session?.user?._id, "66b233b3672bbe53e753aa97", "Harian");
        if (getSome(misiUser, "66b233b3672bbe53e753aa97", false)) {
          setNovelMissionCompleted(true);
        }
      } else if (!cerpenMissionCompleted && bacaBuku?.jenis === "Cerpen") {
        addMisiUser(session?.user?._id, "66b233e4672bbe53e753aac3", "Harian");
        if (getSome(misiUser, "66b233e4672bbe53e753aac3", false)) {
          setCerpenMissionCompleted(true);
        }
      } else if (novelMissionCompleted && cerpenMissionCompleted) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }
  }, [seconds, novelMissionCompleted, cerpenMissionCompleted, bacaBuku, misiUser]);

  console.log(seconds);

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
