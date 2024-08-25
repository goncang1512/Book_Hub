"use client";
import { useSession } from "next-auth/react";
import React from "react";

import CardBook from "@/components/layouts/cardstore";
import { CardBookSkaleton } from "@/components/layouts/skeleton";
import { useList } from "@/lib/utils/useSwr";

export default function Whislist() {
  const { data: session }: any = useSession();
  const { dataUserList, dataUserListLoading, statusBook } = useList.getUser(session?.user?._id);

  if (dataUserList?.length < 0) {
    return <p className="p-5 italic">Tidak Ada Content</p>;
  }

  return (
    <div className="w-full p-4 flex flex-wrap md:flex-row flex-col gap-4 h-full">
      {dataUserListLoading
        ? Array.from({ length: 5 }).map((_, index) => <CardBookSkaleton key={index + 1} />)
        : dataUserList &&
          dataUserList.map((book: any) => {
            return (
              <CardBook key={book._id} dataContent={book} statusBook={statusBook} ukuran="">
                <CardBook.List book={book} />
              </CardBook>
            );
          })}
    </div>
  );
}
