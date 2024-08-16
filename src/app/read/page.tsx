import * as React from "react";
import ProtectBook from "@/components/fragments/protectbook";
import ReadComponent from "./readcomponent";

import type { Metadata } from "next";
import instance from "@/lib/utils/fetch";

type PropsRead = {
  searchParams: { [key: string]: string };
};

export async function generateMetadata({ searchParams }: PropsRead): Promise<Metadata> {
  const chapter = searchParams?.chapter;

  let res: any;
  try {
    const result = await instance.get(`/api/read/${chapter}`);
    res = result?.data;
  } catch (error) {
    res = "read";
  }

  return {
    title: `(${res?.result?.chapter}) ${res?.result?.judul}`,
    description: `Ini merupakan halaman baca chapter ${res?.result?.chapter} dengan judul  ${res?.result?.judul}`,
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
