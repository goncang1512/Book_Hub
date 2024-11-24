"use client";
import { useSession } from "next-auth/react";
import React from "react";

import { useMyBook } from "@/lib/utils/useSwr";
import CardBook from "@/components/layouts/cardbook";
import { CardBookSkaleton } from "@/components/layouts/skeleton";

export default function MyBook() {
  const { data: session }: any = useSession();
  const { myBookAut, myBookLoading, statusBook } = useMyBook.mybook(session?.user?._id);

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 p-4">
      {myBookLoading
        ? Array.from({ length: 5 }).map((_, index) => <CardBookSkaleton key={index + 1} />)
        : myBookAut &&
          myBookAut.map((book: any) => (
            <CardBook key={book._id} dataContent={book} statusBook={statusBook} ukuran="">
              <CardBook.List book={book} />
            </CardBook>
          ))}
    </div>
  );
}
