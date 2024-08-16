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

  await fetch(
    `https://book-hub-git-master-samuderanstgmailcoms-projects.vercel.app/api/read?id=${book_id}&chapter=${chapter}`,
  )
    .then(async (res) => {
      const hasil = await res.json();
      data = {
        judul: hasil?.result?.judul,
        chapter: `(${hasil?.result?.chapter})`,
      };
    })
    .catch(() => {
      data = {
        judul: "Read",
        chapter: "BookHub | ",
      };
    });

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
