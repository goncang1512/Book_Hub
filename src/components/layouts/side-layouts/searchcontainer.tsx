import React, { LegacyRef, useContext, useEffect, useRef, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import Link from "next/link";
import { FaRegComments } from "react-icons/fa6";

import CardBook from "../cardbook";

import styles from "@/lib/style.module.css";
import useDebounce from "@/lib/utils/useDebaunce";
import useSWR from "swr";
import { fetcher } from "@/lib/utils/useSwr";
import { GlobalState } from "@/lib/context/globalstate";

const DELAY = 1000;

export default function SearchContainer({
  seeSearch,
  containerSearchRef,
}: {
  seeSearch: boolean;
  setSeeSearch: React.Dispatch<React.SetStateAction<boolean>>;
  containerSearchRef: LegacyRef<HTMLDivElement> | null;
}) {
  const { debounce } = useDebounce();
  const [keyword, setKeyWord] = useState("");
  const [query, setQuery] = useState("");

  const { data, error } = useSWR(
    keyword && seeSearch ? `/api/search?title=${keyword}` : null,
    fetcher,
  );

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setQuery(value);
    debounce(() => setKeyWord(value), DELAY)();
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (seeSearch) {
      inputRef.current?.focus();
    }
  }, [seeSearch]);

  return (
    <div
      ref={containerSearchRef}
      className={`${
        seeSearch ? "md:translate-x-[5.5rem] translate-x-0" : "-translate-x-[100%]"
      } bg-white dark:bg-primary-black border-r shadow-xl h-screen duration-700 w-80 z-40 left-0 fixed p-2`}
    >
      <div className="flex flex-col">
        <div className={`${styles.searchBox} relative`}>
          <input
            ref={inputRef}
            className={`border px-2 py-2 outline-none bg-white dark:bg-primary-dark rounded-md text-black dark:text-white text-[1em] w-full focus:border focus:border-solid focus:border-[#3b82f6] shadow-md`}
            id="search"
            name="search"
            placeholder=""
            type="text"
            value={query}
            onChange={handleSearch}
          />
          <div className="absolute top-0 left-0 duration-200">
            <button
              aria-label="buttonSearch"
              className={`ml-2 text-[1em] left-0 top-[8.4px] absolute ease-[cubic-bezier(0.05, 0.81, 0, 0.93)] duration-200`}
              type="button"
            >
              <MdOutlineSearch size={25} />
            </button>
            <label
              className={`ml-2 text-[1em] left-0 top-[8.4px] absolute ease-[cubic-bezier(0.05, 0.81, 0, 0.93)] duration-200 flex items-center gap-1 cursor-text`}
              htmlFor="search"
            >
              <MdOutlineSearch size={25} />
              <span className="text-gray-500">Search...</span>
            </label>
          </div>
        </div>
      </div>
      <div className={`pt-4 min-h-screen relative overflow-y-hidden`}>
        <div
          className={`${
            error ? "translate-y-0" : "-translate-y-[100px]"
          } alert alert-warning flex absolute transform w-full duration-150 ease-linear`}
          id="alert-pesan-search"
          role="alert"
        >
          <svg
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span>{error?.response?.data?.message}</span>
        </div>
        {data?.result &&
          data?.result.map((book: BookType) => <CardSearch key={book._id} book={book} />)}
      </div>
    </div>
  );
}

type BookType = {
  _id: string;
  title: string;
  imgBooks: {
    public_id: string;
    imgUrl: string;
  };
  writer: string;
  terbit: string;
  sinopsis: string;
  jenis: string;
};

const CardSearch = ({ book }: { book: BookType }) => {
  const { currentPage } = useContext(GlobalState);
  return (
    <div className="border-b py-1 gap-3 w-full flex">
      <Link className="relative" href={`/content/${book?._id}`}>
        <img
          alt=""
          className="w-12 h-[69.6px] rounded-sm object-cover border"
          src={book?.imgBooks?.imgUrl}
        />
        <span
          className={`${book?.jenis === "Review" && "bg-blue-500"} ${
            book?.jenis === "Novel" && "bg-green-500"
          } ${
            book?.jenis === "Cerpen" && "bg-orange-500"
          } text-center absolute bottom-0 left-0 p-[2px] text-white rounded-tr-sm rounded-bl-sm text-[5px] border-b border-l`}
        >
          {book?.jenis}
        </span>
      </Link>
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between">
          <Link className="font-semibold" href={`/content/${book?._id}`}>
            {book?.title}
          </Link>
          <div className="flex gap-2 items-center">
            <Link href={`/content/${book?._id}`}>
              <FaRegComments size={18} />
            </Link>
            <CardBook.List
              book={book}
              keyword="search"
              pagination={{ page: currentPage, limit: 8 }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-400">{book?.writer}</p>
      </div>
    </div>
  );
};
