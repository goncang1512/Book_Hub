"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import parse from "html-react-parser";
import { useSession } from "next-auth/react";

import styles from "@/lib/style.module.css";
import ProtectBook from "@/components/fragments/protectbook";
import { useChapter } from "@/lib/utils/useSwr";
import instance from "@/lib/utils/fetch";

export default function ReadBook() {
  const router = useRouter();
  const { data: session }: any = useSession();
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");
  const chapter: any = searchParams.get("chapter");
  const status: any = searchParams.get("status");

  const { bacaBuku, bacaBukuLoading } = useChapter.readBook(id && id, chapter && chapter);

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
