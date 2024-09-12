import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { FaRegComments } from "react-icons/fa6";
import { BiBookReader } from "react-icons/bi";
import { FiBook } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { IconWriter } from "@public/svg/assets";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "@/lib/style.module.css";

import ReadMoreLess from "../elements/readmoreless";
import { Input } from "../elements/input";
import { Button } from "../elements/button";
import Picture from "../elements/image";
import { useResponsiveValue } from "@/lib/utils/extractText";
import { parseDate } from "@/lib/utils/parseTime";

import DropDown from "./hovercard";

import { WhislistContext } from "@/lib/context/whislistcontext";
import { BookContext } from "@/lib/context/bookcontext";
import useClickOutside from "@/lib/utils/clickoutside";
import ModalBox from "../fragments/modalbox";
import { ReportContext } from "@/lib/context/reportcontext";
import { pesanVar } from "@/lib/utils/pesanvariable";

type StatusBook = {
  book_id: string;
  _id: string;
};

const report = [
  "Konten Tidak Pantas",
  "Pelanggaran Hak Cipta",
  "Penggunaan Bahasa yang Kasar atau Tidak Sopan",
  "Gangguan Teknis atau Format",
  "Pelanggaran Kebijakan Situs",
];

function CardBook({
  dataContent,
  ukuran,
  statusBook,
  children,
}: {
  dataContent: any;
  ukuran: string;
  children: React.ReactNode;
  statusBook?: StatusBook[];
}) {
  if (!dataContent) return 0;
  const pathname = usePathname();
  const { data: session }: any = useSession();
  const { updateHalaman, loadingHalaman } = React.useContext(WhislistContext);
  const modalDeleteBookRef = useRef<HTMLDialogElement | null>(null);
  const [dataDelete, setDataDelete] = useState({
    book_id: "",
    user_id: "",
    title: "",
  });

  const { _id, imgBooks, title, sinopsis, writer, terbit, user_id, ISBN, jenis, user } =
    dataContent;

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
  useClickOutside([ref, buttonRef], () => setSeeDetail(false));

  const [halaman, setHalaman] = useState({
    halaman: "",
  });

  useEffect(() => {
    setHalaman({ ...halaman, halaman: dataContent?.halaman });
  }, [dataContent]);

  const height = useResponsiveValue({
    widthBreakpoint: 768,
    mobileValue: "15",
    desktopValue: "20",
  });

  const height25 = useResponsiveValue({
    widthBreakpoint: 768,
    mobileValue: "20",
    desktopValue: "24",
  });

  const [dataReport, setDataReport] = useState<any>(null);
  const { makeReport } = useContext(ReportContext);

  return (
    <div
      className={`flex flex-col ${
        ukuran ? ukuran : "md:w-[49.3%] w-full"
      }  p-3 gap-4 border bg-white shadow-lg rounded-lg duration-500 ease-in-out`}
    >
      <div className="gap-4 flex">
        <div className="md:w-[88px] w-[80px] h-[140px] md:h-[144px] relative">
          <Picture size="bookCard" src={`${imgBooks?.imgUrl}`} variant="bookCard" />
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
              <FiBook size={parseInt(height)} />
              <h1 className="truncate max-md:max-w-24 max-w-[20rem]">{title}</h1>
            </div>
            <div className="flex items-center gap-3 relative">
              <Link aria-label={`comment${_id}`} href={`/content/${_id}`}>
                <FaRegComments size={parseInt(height25)} />
              </Link>
              {children}
              {jenis !== "Review" ? (
                jenis === "Cerpen" ? (
                  statusBook &&
                  statusBook?.map(
                    (status: any) =>
                      status.book_id === _id &&
                      status._id &&
                      status.status === "Rilis" && (
                        <Link
                          key={status._id}
                          aria-label={`rilis${_id}`}
                          href={`/read?id=${_id}&chapter=${status._id}`}
                        >
                          <BiBookReader size={parseInt(height25)} />
                        </Link>
                      ),
                  )
                ) : (
                  <Link aria-label={`cerpen${_id}`} href={`/read/${_id}`}>
                    <BiBookReader size={parseInt(height25)} />
                  </Link>
                )
              ) : (
                ""
              )}

              <DropDown label={_id} size={parseInt(height25)}>
                <div className="flex flex-col w-full md:text-base text-sm">
                  <button
                    aria-label={`${_id}buttonReport`}
                    className="active:text-gray-400 text-start"
                    onClick={() =>
                      setDataReport({
                        boook_id: _id,
                        user_id,
                      })
                    }
                  >
                    Report
                  </button>
                  {dataReport && (
                    <ModalBox dataModal={dataReport} setDataModal={setDataReport} story_id={_id}>
                      <div className="flex flex-col justify-start">
                        {report.map((laporan: string, index: number) => {
                          return (
                            <button
                              key={index}
                              aria-label={`${index}buttonLaporan`}
                              className="active:text-slate-300 text-base text-start"
                              onClick={() => {
                                makeReport(
                                  {
                                    user_id: session?.user?._id,
                                    message: pesanVar.cardBook({
                                      imgUser: imgBooks?.imgUrl,
                                      title,
                                      book_id: _id,
                                      jenis,
                                      username: user?.username,
                                    }),
                                    from: "book",
                                    report: laporan,
                                  },
                                  setDataReport,
                                );
                              }}
                            >
                              {laporan}
                            </button>
                          );
                        })}
                      </div>
                    </ModalBox>
                  )}
                  {session?.user?._id === user_id && (
                    <div className="flex flex-col">
                      <button
                        aria-label={`${_id}buttonDeleteBook`}
                        className="active:text-gray-400 text-start w-auto whitespace-nowrap"
                        onClick={() => {
                          modalDeleteBookRef?.current?.showModal();
                          setDataDelete({
                            user_id: session?.user?._id,
                            book_id: _id,
                            title: title,
                          });
                        }}
                      >
                        Hapus Buku
                      </button>
                      <Link
                        aria-label={`edit${_id}`}
                        className="active:text-gray-400 w-auto whitespace-nowrap"
                        href={`${
                          ISBN === 0 ? `/profil/author/mybook/${_id}` : `/profil/upload/${_id}`
                        }`}
                      >
                        Edit Buku
                      </Link>
                      {jenis === "Cerpen" && (
                        <Link
                          aria-label={`readCerpen${_id}`}
                          className="active:text-gray-400 w-auto whitespace-nowrap"
                          href={`/read/${_id}`}
                        >
                          See Cerpen
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </DropDown>
            </div>
          </div>
          <div className="h-full py-1">
            <ReadMoreLess
              other
              maxLength={pathname === "/profil" || pathname.startsWith("/user") ? 300 : 210}
              mobile={120}
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
              text={sinopsis}
              textFont="text-gray-900 leading-[1.178rem]"
            />
          </div>
          <div>
            <hr className="h-[2px] bg-gray-500 rounded-full mb-1" />
            <div className="flex justify-between text-sm items-center">
              <div className="flex gap-1 items-center text-sm">
                <p className="md:text-sm text-xs text-gray-500 flex gap-2 items-center">
                  <IconWriter size={parseInt(height)} /> Penulis: {writer}
                </p>
              </div>
              <div className="relative flex gap-2">
                <p className="md:flex hidden text-xs text-gray-500 items-center">
                  {parseDate(terbit)}
                </p>
                <button
                  ref={buttonRef}
                  aria-label={`buttonDetailClick${_id}`}
                  className={`${
                    pathname === "/profil/whislist" ? "flex" : "md:hidden flex"
                  } text-sm ${
                    seeDetail ? "rotate-0" : "rotate-90"
                  } duration-200 p-1 ease-linear hover:bg-gray-300 rounded-full`}
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
            <Button disabled={loadingHalaman} label={`buttonBookmark${_id}`} variant="primary">
              {loadingHalaman ? <span className="loading loading-dots loading-md" /> : "Update"}
            </Button>
          </form>
          <p className="md:hidden flex text-xs text-gray-500 items-center">
            Terbit : {parseDate(terbit)}
          </p>
        </div>
      </div>
      <ModalDeleteBook dataDelete={dataDelete} refDialog={modalDeleteBookRef} />
    </div>
  );
}

const AddList = ({
  book,
  pagination,
  keyword,
}: {
  book: any;
  pagination?: { page: number; limit: number };
  keyword?: string;
}) => {
  const { data: session }: any = useSession();
  const { addList, deleteList } = useContext(WhislistContext);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(book?.listBook?.some((w: any) => w.user_id === session?.user?._id));
  }, [book?.listBook]);

  const height25 = useResponsiveValue({
    widthBreakpoint: 768,
    mobileValue: "18",
    desktopValue: keyword === "search" ? "18" : "21",
  });

  return (
    <button
      aria-label={`buttonMark${book._id}`}
      className={`${styles.contMark} text-[30px] flex justify-center items-center relative cursor-pointer select-none`}
      onClick={() => {
        isLiked
          ? deleteList(session?.user?._id, book._id, setIsLiked, pagination, keyword)
          : addList(session?.user?._id, book._id, setIsLiked, pagination, keyword);
      }}
    >
      <svg
        className={`${isLiked ? `${styles.saveReguler}` : ""}`}
        height={`${height25}px`}
        viewBox="0 0 384 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"
          fill={isLiked ? "#facc15 " : "#000000"}
        />
      </svg>
      <svg
        className={`${isLiked ? "" : `${styles.saveSolid}`}`}
        height={`${height25}px`}
        viewBox="0 0 384 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"
          fill={isLiked ? "#facc15" : "#facc15"}
        />
      </svg>
    </button>
  );
};

export const ModalDeleteBook: React.FC<{
  refDialog: any;
  dataDelete: { user_id: string; book_id: string; title: string };
}> = ({ refDialog, dataDelete }) => {
  const [valueDelete, setValueDelete] = useState<string>("");
  const { deletedBook, loadingBook } = React.useContext(BookContext);
  const [msgDltBook, setMsgDltBook] = useState("");

  return (
    <dialog ref={refDialog} className="modal" id="my_modal_2">
      <div className="modal-box relative">
        <button
          aria-label={`${dataDelete.book_id}buttonDialog`}
          className="absolute right-1 top-1 p-2 rounded-full max-md:active:bg-slate-300 md:hover:bg-slate-300 hover:bg-none"
          type="button"
          onClick={() => refDialog?.current?.close()}
        >
          <IoClose size={25} />
        </button>
        <div className="pt-[10px]">
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (dataDelete.title === valueDelete) {
                deletedBook(dataDelete?.book_id, dataDelete?.user_id);
              } else {
                setMsgDltBook("Book name salah coba lagi.");
                setTimeout(() => {
                  setMsgDltBook("");
                }, 3000);
              }
            }}
          >
            <p className={`${!msgDltBook && "hidden"} text-red-500 italic text-md`}>{msgDltBook}</p>
            <p>
              Enter book name <strong>{dataDelete.title}</strong> to continue:
            </p>
            <Input
              container="labelFloat"
              name="titlebook"
              required={true}
              type="text"
              value={valueDelete}
              varLabel="labelFloat"
              variant="labelFloat"
              onChange={(e) => setValueDelete(e.target.value)}
            >
              Title
            </Input>
            <Button
              label={`${dataDelete.book_id}buttonDeleteBook`}
              size="login"
              type="submit"
              variant="login"
            >
              {loadingBook ? (
                <div className="flex items-center justify-center">
                  <span className="loading loading-dots loading-md" />
                </div>
              ) : (
                "Delete Book"
              )}
            </Button>
          </form>
        </div>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button aria-label={`buttonCloseDlt${dataDelete.book_id}`}>close</button>
      </form>
    </dialog>
  );
};

CardBook.List = AddList;

export default CardBook;
