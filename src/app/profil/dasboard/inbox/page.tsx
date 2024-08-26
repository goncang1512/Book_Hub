"use client";
import * as React from "react";

import { BarisChapter, Canvas } from "@/components/fragments/barischapter";
import { useChapter } from "@/lib/utils/useSwr";

export default function Inbox() {
  const { dataChapter, dataChapterLoading } = useChapter.submitted();

  return (
    <div>
      {dataChapterLoading ? (
        <div className="flex w-full h-screen items-center justify-center">
          <span className="loading loading-bars loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto h-screen">
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
    </div>
  );
}
