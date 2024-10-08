import React from "react";
import Link from "next/link";

import ReadMoreLess from "../elements/readmoreless";
import Picture from "../elements/image";
import { parseDate } from "@/lib/utils/parseTime";

type BookType = {
  _id: string;
  title: string;
  user_id: string;
  writer: string;
  sinopsis: string;
  terbit: Date;
  ISBN: number;
  genre: string[];
  jenis: string;
  imgBooks: {
    public_id: string;
    imgUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
  user: {
    username: string;
    _id: string;
  };
};

type StatusType = { _id: string; book_id: string; status: string };

export function ProfilBooksDekstop({
  dataBook,
  statusBook,
}: {
  dataBook: BookType;
  statusBook: StatusType[];
}) {
  const { _id, title, writer, sinopsis, terbit, genre, imgBooks, ISBN, jenis, user } = dataBook;

  return (
    <div className="bg-white dark:bg-primary-dark w-[32.1%] h-screen fixed top-0 right-0 md:flex hidden flex-col p-5 border-l">
      <div className="h-screen overflow-auto scroll-smooth">
        <div className="w-full flex justify-center">
          {jenis !== "Review" && statusBook[0]?._id ? (
            <Link
              href={
                jenis === "Cerpen"
                  ? `/read?id=${_id}&chapter=${statusBook[0]?._id}`
                  : `/read/${_id}`
              }
            >
              <Picture
                className="w-[144px] h-[223.09px] object-cover rounded-lg"
                src={imgBooks.imgUrl}
              />
            </Link>
          ) : (
            <Picture
              className="w-[144px] h-[223.09px] object-cover rounded-lg"
              src={imgBooks.imgUrl}
            />
          )}
        </div>
        <div className="text-sm w-full pt-5 flex flex-col gap-2">
          <table className="w-full">
            <tbody>
              <BarisTable name="Judul">{title}</BarisTable>
              <BarisTable name="Penulis">
                {jenis !== "Review" ? (
                  <Link
                    aria-label={`buttonseeWriter${_id}`}
                    className="text-blue-500"
                    href={`/user/@${user?.username}`}
                  >
                    {writer}
                  </Link>
                ) : (
                  writer
                )}
              </BarisTable>
              <BarisTable name="Terbit">{parseDate(terbit)}</BarisTable>
              {ISBN !== 0 && <BarisTable name="ISBN">{ISBN}</BarisTable>}
              <BarisTable name="Genre">
                {genre &&
                  genre.map((teks: string, index: number) =>
                    index + 1 === genre.length ? teks : `${teks}, `,
                  )}
              </BarisTable>
              <BarisTable name="Jenis">{jenis}</BarisTable>
              <BarisTable name="Sinopsis">
                <ReadMoreLess other maxLength={210} text={sinopsis} textFont="text-base" />
              </BarisTable>
            </tbody>
          </table>
        </div>
      </div>
      {jenis !== "Review" && (
        <div className=" w-full flex items-center justify-center py-2">
          <Link
            className="bg-white dark:bg-primary-dark border shadow-xl px-2 py-2 rounded-sm active:bg-slate-400 font-semibold"
            href={
              jenis === "Cerpen" ? `/read?id=${_id}&chapter=${statusBook[0]?._id}` : `/read/${_id}`
            }
          >
            Read Now
          </Link>
        </div>
      )}
    </div>
  );
}

export const BooksProfileMobile = ({
  dataBook,
  statusBook,
}: {
  dataBook: BookType;
  statusBook: StatusType[];
}) => {
  const { _id, title, writer, sinopsis, terbit, imgBooks, genre, jenis, user } = dataBook;

  return (
    <div className="md:hidden flex w-full bg-bluemary border-none gap-2 px-5 py-2 ">
      {jenis !== "Review" && statusBook[0]?._id ? (
        <Link
          href={
            jenis === "Cerpen" ? `/read?id=${_id}&chapter=${statusBook[0]?._id}` : `/read/${_id}`
          }
        >
          <Picture
            className="w-[144px] h-[223.09px] border -mb-28 rounded-lg shadow-xl"
            src={imgBooks.imgUrl}
          />
        </Link>
      ) : (
        <Picture
          className="w-[144px] h-[223.09px] border -mb-28 rounded-lg shadow-xl"
          src={imgBooks.imgUrl}
        />
      )}
      <div className="flex flex-col w-full">
        <table className="md:text-base text-sm text-white" style={{ width: "71%" }}>
          <tbody>
            <tr>
              <td className="text-start align-top">Judul</td>
              <td className="px-1 align-top">:</td>
              <td>{title}</td>
            </tr>
            <tr>
              <td className="text-start align-top">Penulis</td>
              <td className="px-1 align-top">:</td>
              <td>
                {jenis !== "Review" ? (
                  <Link
                    aria-label={`handlerouterWriter${_id}`}
                    className="text-[#CAF0F8]"
                    href={`/user/@${user?.username}`}
                  >
                    {writer}
                  </Link>
                ) : (
                  writer
                )}
              </td>
            </tr>
            <tr>
              <td className="text-start align-top">Terbit</td>
              <td className="px-1 align-top">:</td>
              <td>{parseDate(terbit)}</td>
            </tr>
            <tr>
              <td className="text-start align-top">Genre</td>
              <td className="px-1 align-top">:</td>
              <td>
                {genre &&
                  genre.map((teks: string, index: number) =>
                    index + 1 === genre.length ? teks : `${teks}, `,
                  )}
              </td>
            </tr>
            <tr>
              <td className="text-start align-top">Jenis</td>
              <td className="px-1 align-top">:</td>
              <td>{jenis}</td>
            </tr>
            <tr>
              <td className="text-start align-top">Sinopsis</td>
              <td className="px-1 align-top">:</td>
              <td>
                <ReadMoreLess
                  other
                  maxLength={200}
                  mobile={90}
                  text={sinopsis}
                  textFont="md:text-base text-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {jenis !== "Review" && (
          <div className=" w-full flex items-center justify-center py-2">
            <Link
              className="bg-white dark:bg-primary-black px-2 rounded-sm active:bg-slate-400"
              href={
                jenis === "Cerpen"
                  ? `/read?id=${_id}&chapter=${statusBook[0]?._id}`
                  : `/read/${_id}`
              }
            >
              Read Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const BarisTable = ({
  children,
  name,
  className,
  classTD,
}: {
  children: React.ReactNode;
  name: string;
  className?: string;
  classTD?: string;
}) => {
  return (
    <tr className={`flex w-full md:text-base text-sm ${className}`}>
      <td className="md:w-[88px] w-[83px] font-semibold">{name}</td>
      <td className={`${classTD} flex w-1 px-1`}>:</td>
      <td className="flex items-start md:w-full w-20 break-words">{children}</td>
    </tr>
  );
};
