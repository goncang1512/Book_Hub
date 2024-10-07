import * as React from "react";
import ProtectBook from "@/components/fragments/protectbook";
import ReadComponent from "./readcomponent";

import type { Metadata } from "next";

type PropsRead = {
  searchParams: { [key: string]: string };
};

export async function generateMetadata({ searchParams }: PropsRead): Promise<Metadata> {
  const chapter = searchParams?.chapter;
  const book_id = searchParams?.id;

  let data: { judul: string; chapter: string } = {
    judul: "",
    chapter: "",
  };

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/read?id=${book_id}&chapter=${chapter}`,
  );

  const res = await result.json();

  if (res) {
    data = {
      judul: res?.result?.judul,
      chapter: `${res?.result?.chapter} -`,
    };
  } else {
    data = {
      judul: "Read",
      chapter: "BookHub | ",
    };
  }

  return {
    title: `${data?.chapter} ${data?.judul}`,
    description: `Ini merupakan halaman baca chapter ${data?.chapter} dengan judul  ${data?.judul}`,
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
