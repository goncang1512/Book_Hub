"use client";
import React, { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { SiFireship } from "react-icons/si";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar, A11y } from "swiper/modules";
import Link from "next/link";

import Img from "@/components/fragments/image";
import { CardBookSkaleton } from "@/components/layouts/skeleton";
import { useBooks } from "@/lib/utils/useSwr";
import { CardBook } from "@/components/layouts/cardstore";

export default function Home() {
  const { books, jenisHot, recomendedBook, booksLoading, statusBook } = useBooks.allBook();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentBooks, setCurrentBooks] = useState([]);
  const booksPerPage = 8;
  const totalPages = Math.ceil(books?.length / booksPerPage);

  useEffect(() => {
    if (!booksLoading) {
      const startIndex = (currentPage - 1) * booksPerPage;
      const endIndex = startIndex + booksPerPage;
      setCurrentBooks(books?.slice(startIndex, endIndex));
    }
  }, [currentPage, booksLoading, books]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <main className="w-full flex flex-col">
      <div className="w-full flex items-center md:justify-start justify-center pb-3">
        <h1 className="pt-4 pl-4 text-xl font-bold">Sedang Hangat</h1>
      </div>
      <div className="md:w-[80vw] w-full pl-4 pr-4">
        <Swiper
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
          }}
          grabCursor={true}
          modules={[Scrollbar, A11y]}
          scrollbar={{ draggable: true }}
          slidesPerView={1}
          spaceBetween={10}
          style={{ paddingBottom: "15px" }}
        >
          {booksLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <SwiperSlide key={index}>
                  <CardBookSkaleton key={index + 1} ukuran="w-full" />
                </SwiperSlide>
              ))
            : recomendedBook &&
              recomendedBook.map((book: any) => (
                <SwiperSlide key={book._id}>
                  <CardBook dataContent={book} statusBook={statusBook} ukuran="w-full" />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>

      <div className="w-full flex items-center md:justify-start justify-center">
        <h1 className="pt-4 pl-4 text-xl font-bold">Buku Baru</h1>
      </div>
      <div className="w-full p-4 flex flex-wrap md:flex-row flex-col gap-4 h-full">
        {booksLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <CardBookSkaleton key={index + 1} ukuran="" />
            ))
          : currentBooks &&
            currentBooks.map((book: any) => (
              <CardBook key={book._id} dataContent={book} statusBook={statusBook} ukuran="" />
            ))}
      </div>
      <div
        className={`${
          totalPages === 1 ? "hidden" : "flex"
        } w-full items-center justify-center gap-2 pb-3`}
      >
        <button
          className={`page-button bg-gray-300 size-6 flex items-center justify-center ${
            currentPage === 1 ? "hidden" : ""
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <MdKeyboardDoubleArrowLeft size={20} />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button size-6 ${
              currentPage === index + 1 ? "bg-gray-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`page-button bg-gray-300 size-6 flex items-center justify-center ${
            currentPage === totalPages ? "hidden" : ""
          }`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <MdKeyboardDoubleArrowRight size={20} />
        </button>
      </div>

      {/* Top Trending 3 Jenis Buku */}
      <div className="px-4 pb-4 gap-3 w-full flex items-start justify-center">
        {jenisHot &&
          jenisHot?.map((hot: { type: string; data: any }, index: number) => {
            return (
              <div key={index} className="flex flex-col gap-3">
                <h1 className="font-semibold max-md:text-center">{hot.type}</h1>
                {hot?.data?.map((buku: any, index: number) => {
                  const mybook = statusBook?.filter((status: any) => status.book_id === buku._id);
                  const linkBook =
                    buku.jenis === "Novel"
                      ? `/read/${buku._id}`
                      : buku.jenis === "Cerpen"
                        ? `/read?id=${buku._id}&chapter=${mybook[0]._id}`
                        : buku.jenis === "Review"
                          ? `/content/${buku._id}`
                          : null;
                  return (
                    <div key={index} className="flex md:flex-row flex-col gap-2">
                      <Link className="w-[92px] h-[144px] relative" href={`${linkBook}`}>
                        <Img
                          className="w-full h-[144px] rounded-lg object-cover border"
                          src={`${buku.imgBooks.imgUrl}`}
                        />
                        <span
                          className={`${
                            buku.jenis === "Review" && "bg-blue-500"
                          } ${buku.jenis === "Novel" && "bg-green-500"} ${
                            buku.jenis === "Cerpen" && "bg-orange-500"
                          } text-center absolute bottom-0 left-0 p-1 text-white rounded-tr-lg rounded-bl-lg text-[10px] border-b border-l`}
                        >
                          {buku.jenis}
                        </span>
                      </Link>
                      <div className="flex flex-col">
                        <h2 className="md:max-w-32 max-w-[92px] truncate">{buku.title}</h2>
                        <p className="text-center flex items-center text-sm gap-2">
                          <SiFireship className="text-red-400" size={16} />
                          {buku.sumReaders}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </main>
  );
}
