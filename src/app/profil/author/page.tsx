"use client";
import { useSession } from "next-auth/react";
import React from "react";

import { useMyBook } from "@/lib/utils/useSwr";
import { CardBook } from "@/components/layouts/cardstore";
import { CardBookSkaleton } from "@/components/layouts/skeleton";

export default function MyBook() {
  const { data: session }: any = useSession();
  const { myBookAut, myBookLoading, statusBook } = useMyBook.mybook(session?.user?._id);

  return (
    <div className="w-full p-4 flex flex-wrap md:flex-row flex-col gap-4 h-full">
      {myBookLoading
        ? Array.from({ length: 5 }).map((_, index) => <CardBookSkaleton key={index + 1} />)
        : myBookAut &&
          myBookAut.map((book: any) => (
            <CardBook key={book._id} dataContent={book} statusBook={statusBook} ukuran="" />
          ))}
    </div>
  );
}
