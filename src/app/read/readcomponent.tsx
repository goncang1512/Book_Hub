"use client";
import { useMission } from "@/lib/swr/missionswr";
import instance from "@/lib/utils/fetch";
import { logger } from "@/lib/utils/logger";
import { getSome, useUpdateSeconds } from "@/lib/utils/udpateseconds";
import { useChapter } from "@/lib/utils/useSwr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import parse from "html-react-parser";
import Link from "next/link";
import styles from "@/lib/style.module.css";
import { InputStory } from "@/components/layouts/inputstory";
import InfiniteSwrStory from "@/components/layouts/infiniteSwr";
import AudioPlayer from "@/components/fragments/playaudio";
import Adbanner from "@/components/fragments/adbanner";

interface ReadComponentProps {
  book_id: string;
  chapter: string;
  status: string;
}

const ReadComponent: React.FC<ReadComponentProps> = ({ book_id, chapter, status }) => {
  const router = useRouter();
  const { data: session, status: statusSession }: any = useSession();
  const { bacaBuku, dataFollow, bacaBukuLoading } = useChapter.readBook(
    book_id,
    chapter,
    session?.user?._id,
  );
  const { misiUser } = useMission.getMission(session?.user?._id);

  useEffect(() => {
    const addReaders = async (user_id: string, chapter_id: string) => {
      try {
        await instance.put(`/api/read/${chapter_id}`, { user_id });
      } catch (error) {
        logger.error(`${error}`);
      }
    };

    if (
      bacaBukuLoading === false &&
      status !== "check" &&
      !bacaBuku?.readers.includes(session?.user?._id)
    ) {
      addReaders(session?.user?._id, chapter);
    }
  }, [chapter, session?.user?._id, bacaBukuLoading, status, bacaBuku?.readers]);

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
    statusSession,
    status,
  );

  useEffect(() => {
    if (statusSession === "unauthenticated") return;

    if (misiUser?.length > 0) {
      setNovelMissionCompleted(getSome(misiUser, "66b233b3672bbe53e753aa97", true));
      setCerpenMissionCompleted(getSome(misiUser, "66b233e4672bbe53e753aac3", true));
    }
  }, [statusSession, misiUser]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex">
      <div
        ref={containerRef}
        className={`relative flex flex-col w-full md:mr-[38%] mr-0 border-r h-full`}
      >
        <div className="flex items-center justify-between border-b py-5 pl-2 gap-5 z-20 fixed top-0 md:left-[288px] left-0 bg-white dark:bg-primary-dark md:w-[50.2%] w-full">
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
        {bacaBuku?.audio && <AudioPlayer audioSrc={bacaBuku?.audio?.audioUrl} />}
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
              href={`/read?id=${book_id}&chapter=${bacaBuku?.prevChapter}`}
            >
              prev
            </Link>
          )}
          {bacaBuku?.nextChapter && (
            <Link
              className="p-2 bg-gray-300 rounded-lg"
              href={`/read?id=${book_id}&chapter=${bacaBuku?.nextChapter}`}
            >
              next
            </Link>
          )}
        </div>

        {/* Adds */}
        <div>
          <Adbanner dataAdFormat="auto" dataAdSlot="8419463419" dataFullWidthResponsive={true} />
        </div>

        <div className={`${status === "check" ? "hidden" : "flex"} border-t flex-col`}>
          <InputStory
            idStoryBook={chapter}
            type="chapter"
            urlData={`/api/story/limit/${chapter}`}
          />
          <InfiniteSwrStory
            dataFollow={dataFollow}
            seeBook={false}
            url={`/api/story/limit/${chapter}`}
          />
        </div>
        <div className="py-2 flex items-center justify-center">
          <p className="text-xs text-[#c7c7c7]">© 2024 BookHub from Mogo Studio</p>
        </div>
      </div>
    </div>
  );
};

export default ReadComponent;
