"use client";
import React, { useContext, useEffect, useState } from "react";
import { BiBookAdd } from "react-icons/bi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useChapter } from "@/lib/utils/useSwr";
import ReadMoreLess from "@/components/elements/readmoreless";
import { DropDownKlik } from "@/components/layouts/hovercard";
import { CanvasContext } from "@/lib/context/canvascontext";
import Img from "@/components/fragments/image";
import { parseDate } from "@/lib/utils/parseTime";

export default function Read({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session }: any = useSession();

  const { detailChapter, draftChapter, submitChapter, detailChapterLoading } =
    useChapter.detailBook(params.id);
  const [seeDraft, setSeeDraft] = useState({
    rilis: true,
    draft: false,
    submit: false,
  });

  useEffect(() => {
    if (detailChapter?.jenis === "Cerpen" && session?.user?._id !== detailChapter?.user_id) {
      router.back();
    }
  }, [detailChapter?.jenis]);

  const [reversedChapters, setReversedChapters] = useState(false);
  const sortedChapters = reversedChapters
    ? detailChapter?.canvas
    : detailChapter?.canvas?.slice().reverse();

  const sortDraft = reversedChapters ? draftChapter : draftChapter?.slice().reverse();

  const sortSubmit = reversedChapters ? submitChapter : submitChapter?.slice().reverse();

  return (
    <section className="flex">
      <div
        className={`relative flex flex-col w-full md:mr-[38%] mr-0 border-r ${
          detailChapter?.canvas.length > 9 ? "h-full" : "h-screen"
        }`}
      >
        {/* Add Chapter */}
        {session?.user?._id === detailChapter?.user_id &&
          detailChapter?.jenis === "Cerpen" &&
          detailChapter?.canvas?.length < 1 &&
          draftChapter?.length < 1 &&
          submitChapter?.length < 1 && (
            <div className="fixed bottom-3 md:right-[31.5%] right-[2%] md:mb-0 mb-11 border rounded-full p-2 bg-green-500 z-30">
              <Link href={`/profil/author/texteditor/${detailChapter?._id}`}>
                <BiBookAdd size={30} />
              </Link>
            </div>
          )}

        {/* Akhir Add Chapter */}

        {detailChapterLoading ? (
          <div className="h-screen w-full flex items-center justify-center">
            <span className="loading loading-bars loading-lg" />
          </div>
        ) : (
          <>
            {/* Header Detail Book */}
            <div className="flex items-start p-3 border-b gap-6">
              <Link href={`/content/${detailChapter?._id}`}>
                <Img size="book" src={`${detailChapter?.imgBooks?.imgUrl}`} variant="book" />
              </Link>
              <div>
                <table className="md:text-base text-sm">
                  <thead />
                  <tbody>
                    <tr>
                      <th className="text-start align-top">Judul</th>
                      <td className="px-1 align-top">:</td>
                      <td>{detailChapter?.title}</td>
                    </tr>
                    <tr>
                      <th className="text-start align-top">Penulis</th>
                      <td className="px-1 align-top">:</td>
                      <td>{detailChapter?.writer}</td>
                    </tr>
                    <tr>
                      <th className="text-start align-top">Terbit</th>
                      <td className="px-1 align-top">:</td>
                      <td>{detailChapter?.terbit && parseDate(detailChapter?.terbit)}</td>
                    </tr>
                    <tr>
                      <th className="text-start align-top">Genre</th>
                      <td className="px-1 align-top">:</td>
                      <td>
                        {detailChapter?.genre.map((genre: string, index: number) =>
                          index === detailChapter.genre.length - 1 ? genre : `${genre}, `,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-start align-top">Jenis</th>
                      <td className="px-1 align-top">:</td>
                      <td>{detailChapter?.jenis}</td>
                    </tr>
                    <tr>
                      <th className="text-start align-top">Sinopsis</th>
                      <td className="px-1 align-top">:</td>
                      <td>
                        <ReadMoreLess
                          other
                          maxLength={200}
                          mobile={100}
                          text={detailChapter?.sinopsis}
                          textFont="md:text-base text-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Akhir Header Detail Book */}

            <div className="border-b flex w-full items-center justify-between pr-3">
              <div className="p-4 flex items-center justify-between w-full">
                <p className="text-sm">Up ke {sortedChapters?.length} episode</p>
                <div />
              </div>
              <div className="flex items-center gap-1">
                <button
                  className={`transform duration-100 ease-linear text-xs ${
                    reversedChapters ? "text-[#00b88c]" : ""
                  }`}
                  onClick={() => setReversedChapters(true)}
                >
                  Naik
                </button>
                <p className="text-sm">|</p>
                <button
                  className={`transform duration-100 ease-linear text-xs ${
                    reversedChapters ? "" : "text-[#00b88c]"
                  }`}
                  onClick={() => setReversedChapters(false)}
                >
                  Turun
                </button>
              </div>
            </div>

            {session?.user?._id === detailChapter?.user_id &&
              (sortDraft?.length > 0 || sortSubmit?.length > 0) && (
                <div className="border-b flex w-full justify-around py-2">
                  <button
                    className={`${seeDraft.rilis && "text-[#00b88c]"}`}
                    onClick={() =>
                      setSeeDraft({
                        ...seeDraft,
                        rilis: true,
                        draft: false,
                        submit: false,
                      })
                    }
                  >
                    Rilis
                  </button>
                  <button
                    className={`${seeDraft.draft && "text-[#00b88c]"}`}
                    onClick={() =>
                      setSeeDraft({
                        ...seeDraft,
                        rilis: false,
                        draft: true,
                        submit: false,
                      })
                    }
                  >
                    Draft
                  </button>
                  <button
                    className={`${seeDraft.submit && "text-[#00b88c]"}`}
                    onClick={() =>
                      setSeeDraft({
                        ...seeDraft,
                        rilis: false,
                        draft: false,
                        submit: true,
                      })
                    }
                  >
                    Submit
                  </button>
                </div>
              )}

            {/* Chapter Book */}
            {/* Chapter Submit */}
            {seeDraft.submit &&
              sortSubmit &&
              sortSubmit.map((chapter: any) => (
                <ChapterKlik
                  key={chapter._id}
                  chapter={chapter}
                  detailChapter={detailChapter}
                  params={params}
                />
              ))}
            {/* Chapter Draft */}
            {seeDraft.draft &&
              sortDraft &&
              sortDraft.map((chapter: any) => (
                <ChapterKlik
                  key={chapter._id}
                  chapter={chapter}
                  detailChapter={detailChapter}
                  params={params}
                />
              ))}
            {/* Chapter Rilis */}
            {seeDraft.rilis &&
              sortedChapters &&
              sortedChapters.map((chapter: any) => (
                <ChapterKlik
                  key={chapter._id}
                  chapter={chapter}
                  detailChapter={detailChapter}
                  params={params}
                />
              ))}
            {/* AkhirChapter Book */}
          </>
        )}
      </div>
      <div />
    </section>
  );
}

type ChapterDetail = {
  _id: string;
  book_id: string;
  readers: string[];
  chapter: number;
  judul: string;
  status: string;
};

type DetailChapter = {
  user_id: string;
};

const ChapterKlik = ({
  chapter,
  detailChapter,
  params,
}: {
  chapter: ChapterDetail;
  detailChapter: DetailChapter;
  params: { id: string };
}) => {
  const { data: session }: any = useSession();
  const { ldlDeleteCanvas, deletedCanvas } = useContext(CanvasContext);

  return (
    <div key={chapter._id} className="border-b flex w-full items-center justify-between pr-3">
      <Link
        className="p-4 flex items-center justify-between w-full"
        href={`/read?id=${chapter.book_id}&chapter=${chapter?._id}${
          chapter.status === "Draft" || chapter.status === "Submitted" ? "&status=check" : ""
        }`}
      >
        <p className={`${chapter?.readers?.includes(session?.user?._id) && "text-[#00b88c]"}`}>
          {chapter?.chapter}
        </p>
        <div>
          <h1
            className={`${
              chapter?.readers?.includes(session?.user?._id) && "text-[#00b88c]"
            } font-semibold`}
          >
            {chapter.judul}
          </h1>
        </div>
      </Link>
      {session?.user?._id === detailChapter?.user_id && chapter.status !== "Submitted" && (
        <DropDownKlik>
          <div className="z-50">
            <Link
              className="active:text-gray-400"
              href={`/profil/author/texteditor?id=${params.id}&c=${chapter?._id}`}
            >
              Edit Chapter
            </Link>
            <button
              disabled={ldlDeleteCanvas}
              onClick={() => {
                deletedCanvas(chapter._id, params.id);
              }}
            >
              {ldlDeleteCanvas ? "Loading" : "Hapus"}
            </button>
          </div>
        </DropDownKlik>
      )}
    </div>
  );
};
