"use client";
import * as React from "react";

import { BarisChapter, Canvas } from "@/components/fragments/barischapter";
import { useChapter } from "@/lib/utils/useSwr";
import { reportSWR } from "@/lib/swr/reportSwr";
import parse from "html-react-parser";
import Link from "next/link";
import { FaRegTrashAlt } from "react-icons/fa";
import { useContext } from "react";
import { ReportContext } from "@/lib/context/reportcontext";
import ReadMoreLess from "@/components/elements/readmoreless";

export default function Inbox() {
  const [buttonChapter, setButtonChapter] = React.useState(true);

  return (
    <div>
      <div className="flex justify-center items-center gap-3 py-2">
        <button
          className={`${buttonChapter && "text-green-500"}`}
          onClick={() => setButtonChapter(true)}
        >
          Chapter
        </button>
        <button
          className={`${!buttonChapter && "text-green-500"}`}
          onClick={() => setButtonChapter(false)}
        >
          Report
        </button>
      </div>
      <div>{buttonChapter ? <ChapterComponent /> : <ReportComponent />}</div>
    </div>
  );
}

const ChapterComponent = () => {
  const { dataChapter, dataChapterLoading } = useChapter.submitted();

  return (
    <>
      {dataChapterLoading ? (
        <div className="flex w-full h-screen items-center justify-center">
          <span className="loading loading-bars loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto h-screen border-t">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Jenis</th>
                <th>Judul</th>
                <th>Chapter</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dataChapter &&
                dataChapter.map((chapter: Canvas, index: number) => {
                  return <BarisChapter key={index} dataChapter={chapter} index={index} />;
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const ReportComponent = () => {
  const { dataReport } = reportSWR.getAll();
  const { deleteOneReport, deleted } = useContext(ReportContext);

  return (
    <div className="overflow-x-auto h-screen border-t">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>No.</th>
            <th>Report</th>
            <th>Message</th>
            <th>Pelapor</th>
            <th>From</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {dataReport &&
            dataReport?.map((data: any, index: number) => {
              const myMessage = data.from === "story" ? data.message.split("##") : data.message;
              return (
                <tr key={data.cerita}>
                  <th>{index + 1}</th>
                  <td>
                    {data.from === "story" ? (
                      <div>
                        <p>{parse(myMessage[0])}</p>
                        <div className="max-w-[400px]">
                          <ReadMoreLess
                            maxLength={100}
                            mobile={90}
                            other={true}
                            text={myMessage[1]}
                            textFont="text-base"
                          />
                        </div>
                      </div>
                    ) : (
                      parse(data.message)
                    )}
                  </td>
                  <td>{data.report}</td>
                  <td>
                    <div className="flex items-center gap-5">
                      <img
                        alt=""
                        className="rounded-full size-16 border"
                        draggable="false"
                        src={`${data?.user?.imgProfil?.imgUrl}`}
                      />
                      <Link href={`/user/@${data?.user?.username}`}>
                        <p className="font-semibold">{data?.user?.username}</p>
                        <p className="text-sm text-gray-400">{data?.user?.email}</p>
                      </Link>
                    </div>
                  </td>
                  <td>{data.from}</td>
                  <td>
                    {deleted.report_id === data?._id && deleted.status ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <button onClick={() => deleteOneReport(data?._id)}>
                        <FaRegTrashAlt size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
