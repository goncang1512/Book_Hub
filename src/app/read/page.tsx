import * as React from "react";
import ProtectBook from "@/components/fragments/protectbook";
import ReadComponent from "./readcomponent";

import type { Metadata } from "next";

type PropsRead = {
  searchParams: { [key: string]: string };
};

export async function generateMetadata({ searchParams }: PropsRead): Promise<Metadata> {
  const chapter = searchParams?.chapter;

  let res: { judul: string; chapter: string } = {
    judul: "",
    chapter: "",
  };

  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/read/membaca/${chapter}`, {
      method: "GET",
    });

    const data = await result.json();

    console.log(data);
    res = {
      judul: data?.result?.judul,
      chapter: `(${data?.result?.chapter})`,
    };
  } catch (error: any) {
    res = {
      judul: "Read",
      chapter: "BookHub | ",
    };
  }

  return {
    title: `${res?.chapter} ${res?.judul}`,
    description: `Ini merupakan halaman baca chapter ${res?.chapter} dengan judul  ${res?.judul}`,
  };
}

const ReadBook: React.FC<PropsRead> = ({ searchParams }) => {
  const book_id = searchParams?.id;
  const chapter = searchParams?.chapter;
  const status = searchParams?.status;

  return (
    <ProtectBook>
      <ReadComponent book_id={book_id} chapter={chapter} status={status} />
    </ProtectBook>
  );
};

export default ReadBook;
