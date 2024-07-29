import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaRegComments } from "react-icons/fa6";
import { BiBookReader } from "react-icons/bi";
import { FiBook } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IconWriter } from "@public/svg/assets";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import ReadMoreLess from "../elements/readmoreless";
import { Input } from "../elements/input";
import { Button } from "../elements/button";
import Img from "../fragments/image";

import DropDown from "./hovercard";

import { WhislistContext } from "@/lib/context/whislistcontext";
import { BookContext } from "@/lib/context/bookcontext";

type StatusBook = {
  book_id: string;
  _id: string;
};

export function CardBook({
  dataContent,
  ukuran,
  statusBook,
}: {
  dataContent: any;
  ukuran: string;
  statusBook?: StatusBook[];
}) {
  if (!dataContent) return 0;
  const pathname = usePathname();
  const { data: session }: any = useSession();
  const { deletedBook } = React.useContext(BookContext);
  const { updateHalaman, loadingHalaman } = React.useContext(WhislistContext);

  const { _id, imgBooks, title, sinopsis, writer, terbit, user_id, ISBN, jenis } = dataContent;

  const [seeDetail, setSeeDetail] = useState(false);
  const handleDetailClick = () => {
    if (seeDetail) {
      setSeeDetail(false);
    } else {
      setSeeDetail(true);
    }
  };

  const ref = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClikOutSide = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref?.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setSeeDetail(false);
      }
    };

    document.addEventListener("mousedown", handleClikOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClikOutSide);
    };
  }, [ref, buttonRef]);

  const [halaman, setHalaman] = useState({
    halaman: "",
  });

  useEffect(() => {
    setHalaman({ ...halaman, halaman: dataContent?.halaman });
  }, [dataContent]);

  return (
    <div
      className={`flex flex-col ${
        ukuran ? ukuran : "md:w-[49.3%] w-full"
      }  p-3 gap-4 border bg-white shadow-lg rounded-lg duration-500 ease-in-out`}
    >
      <div className="gap-4 flex">
        <div className="w-[92px] h-[144px] relative">
          <Img size="bookCard" src={`${imgBooks?.imgUrl}`} variant="bookCard" />
          <span
            className={`${jenis === "Review" && "bg-blue-500"} ${
              jenis === "Novel" && "bg-green-500"
            } ${
              jenis === "Cerpen" && "bg-orange-500"
            } text-center absolute bottom-0 left-0 p-1 text-white rounded-tr-lg rounded-bl-lg text-[10px] border-b border-l`}
          >
            {jenis}
          </span>
        </div>
        <div className="flex flex-col justify-between w-full">
          <div className="flex w-full justify-between items-center">
            <div className="font-semibold flex items-center gap-1 md:text-base text-sm text-clip overflow-hidden">
              <FiBook size={20} />
              <h1 className="max-md:truncate max-md:w-24 leading-none">{title}</h1>
            </div>
            <div className="flex items-center gap-3 relative">
              <Link href={`/content/${_id}`}>
                <FaRegComments size={25} />
              </Link>
              <AddList book={dataContent} size={20} />
              {jenis !== "Review" ? (
                jenis === "Cerpen" ? (
                  statusBook &&
                  statusBook?.map(
                    (status: any) =>
                      status.book_id === _id &&
                      status._id &&
                      status.status === "Rilis" && (
                        <Link key={status._id} href={`/read?id=${_id}&chapter=${status._id}`}>
                          <BiBookReader size={25} />
                        </Link>
                      ),
                  )
                ) : (
                  <Link href={`/read/${_id}`}>
                    <BiBookReader size={25} />
                  </Link>
                )
              ) : (
                ""
              )}

              {session?.user?._id === user_id && (
                <DropDown>
                  <div className="flex flex-col z-[100]">
                    <button
                      className="active:text-gray-400 text-start"
                      onClick={() => deletedBook(_id, session?.user?._id)}
                    >
                      Hapus Buku
                    </button>
                    <Link
                      className="active:text-gray-400"
                      href={`${
                        ISBN === 0 ? `/profil/author/mybook/${_id}` : `/profil/upload/${_id}`
                      }`}
                    >
                      Edit Buku
                    </Link>
                    {jenis === "Cerpen" &&
                      statusBook &&
                      statusBook
                        .filter((item: any) => item.book_id === _id && item._id)
                        .map((item: any) => {
                          if (item.status === "Rilis") {
                            return (
                              <Link
                                key={item._id}
                                className="active:text-gray-400"
                                href={`/profil/author/texteditor?id=${item.book_id}&c=${item._id}`}
                              >
                                Edit Cerpen
                              </Link>
                            );
                          } else if (item.status === "Draft") {
                            return (
                              <Link
                                key={item._id}
                                className="active:text-gray-400"
                                href={`/profil/author/texteditor?id=${item.book_id}&c=${item._id}`}
                              >
                                Edit Draft
                              </Link>
                            );
                          } else if (item.status !== "Submitted") {
                            return (
                              <Link
                                key={item._id}
                                className="active:text-gray-400"
                                href={`/profil/author/texteditor/${item.book_id}`}
                              >
                                Tambah Cerpen
                              </Link>
                            );
                          }
                          return null;
                        })}
                  </div>
                </DropDown>
              )}
            </div>
          </div>
          <div className="h-full py-1">
            <ReadMoreLess
              other
              maxLength={210}
              mobile={150}
              text={sinopsis}
              textFont="md:text-sm text-xs text-gray-500"
            />
          </div>
          <div>
            <hr className="h-[2px] bg-gray-500 rounded-full mb-1" />
            <div className="flex justify-between text-sm items-center">
              <div className="flex gap-1 items-center text-sm">
                <p className="text-sm text-gray-500 flex gap-2 items-center">
                  <IconWriter size={20} /> Penulis: {writer}
                </p>
              </div>
              <div className="relative flex gap-2">
                <p className="md:flex hidden text-xs text-gray-500 items-center">{terbit}</p>
                <button
                  ref={buttonRef}
                  className={`${
                    pathname === "/profil/whislist" ? "flex" : "md:hidden flex"
                  } text-sm ${
                    seeDetail ? "rotate-0" : "rotate-90"
                  } duration-200 ease-linear hover:bg-gray-300 rounded-full`}
                  onClick={() => handleDetailClick()}
                >
                  <IoIosArrowDown size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* See Detail Book */}
      <div
        className={`${
          seeDetail ? "h-full" : "h-[0px] overflow-hidden -mt-4"
        } duration-100 ease-in-out container-detail`}
      >
        <div ref={ref} className="w-full flex flex-col gap-3 h-full pt-4">
          <form
            className={`${pathname === `/profil/whislist` ? "flex" : "hidden"} items-center gap-2`}
            onSubmit={(e) => {
              e.preventDefault();
              updateHalaman(_id, halaman, user_id);
            }}
          >
            <Input
              classDiv="w-full"
              className="bg-red-500"
              container="float"
              name="halaman"
              type="number"
              value={String(halaman.halaman)}
              varLabel="float"
              variant="float"
              onChange={(e) => setHalaman({ ...halaman, halaman: e.target.value })}
            >
              Bookmark
            </Input>
            <Button disabled={loadingHalaman} variant="primary">
              {loadingHalaman ? <span className="loading loading-dots loading-md" /> : "Update"}
            </Button>
          </form>
          <p className="md:hidden flex text-xs text-gray-500 items-center">Terbit : {terbit}</p>
        </div>
      </div>
    </div>
  );
}

export const AddList = ({ book, size }: { book: any; size: number }) => {
  const { data: session }: any = useSession();
  const { addList, deleteList } = useContext(WhislistContext);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddList = async () => {
    setIsLiked(true);
    await addList(session?.user?._id, book._id);
  };

  const handleDeleteList = async () => {
    setIsLiked(false);
    await deleteList(session?.user?._id, book._id);
  };

  return (
    <>
      {isLiked || book?.listBook?.some((w: any) => w.user_id === session?.user?._id) ? (
        <button className="text-red-500 active:scale-110" onClick={handleDeleteList}>
          <FaHeart size={size} />
        </button>
      ) : (
        <button onClick={handleAddList}>
          <FaRegHeart size={size} />
        </button>
      )}
    </>
  );
};
