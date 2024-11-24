"use client";
import { useSession } from "next-auth/react";
import React from "react";

import CardBook from "@/components/layouts/cardbook";
import { CardBookSkaleton } from "@/components/layouts/skeleton";
import { useList } from "@/lib/utils/useSwr";

export default function Whislist() {
  const { data: session }: any = useSession();
  const { dataUserList, dataUserListLoading, statusBook } = useList.getUser(session?.user?._id);

  if (dataUserList?.length < 0) {
    return <p className="p-5 italic">Tidak Ada Content</p>;
  }

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 p-4">
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
