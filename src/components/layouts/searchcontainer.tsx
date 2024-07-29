import React, { LegacyRef, useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import Link from "next/link";
import { FaRegComments } from "react-icons/fa6";

import { AddList } from "./cardstore";

import styles from "@/lib/style.module.css";
import instance from "@/lib/utils/fetch";
import useDebounce from "@/lib/utils/useDebaunce";

const DELAY = 1000;

export default function SearchContainer({
  seeSearch,
  setSeeSearch,
  containerSearchRef,
}: {
  seeSearch: boolean;
  setSeeSearch: React.Dispatch<React.SetStateAction<boolean>>;
  containerSearchRef: LegacyRef<HTMLDivElement> | null;
}) {
  const { debounce } = useDebounce();
  const [data, setData] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [notFound, setNotFound] = useState({
    status: false,
    message: "",
  });

  const searchBook = async () => {
    try {
      const res = await instance.get(`/api/search?title=${data}`);
      setDataSearch(res.data.result);
    } catch (error: any) {
      if (error.response) {
        setNotFound({
          status: true,
          message: error.response.data.message,
        });
        setTimeout(() => {
          setNotFound({
            status: false,
            message: "",
          });
        }, 5000);
      } else {
        console.log(error);
      }
    }
  };

  const debouncedSearch = debounce(searchBook, DELAY);
  useEffect(() => {
    if (seeSearch) {
      debouncedSearch();
    }
  }, [data]);

  return (
    <div
      ref={containerSearchRef}
      className={`${
        seeSearch ? "md:translate-x-[18rem] translate-x-0" : "-translate-x-[100%]"
      } bg-white border-r shadow-xl h-screen duration-700 w-80 z-40 left-0 fixed p-2`}
    >
      <div className="flex flex-col">
        <div className={`${styles.searchBox} relative`}>
          <input
            className={`border px-2 py-2 outline-none bg-white rounded-md text-black text-[1em] w-full focus:border focus:border-solid focus:border-[#3b82f6] shadow-md`}
            id="search"
            name="search"
            placeholder=""
            type="text"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
            }}
          />
          <div className="absolute top-0 left-0 duration-200">
            <button
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
      <div className="pt-4">
        {notFound.status ? (
          <p className="text-red-500 text-center italic text-sm">{notFound.message}</p>
        ) : (
          dataSearch &&
          dataSearch.map((book: BookType) => <CardSearch key={book._id} book={book} />)
        )}
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
};

const CardSearch = ({ book }: { book: BookType }) => {
  return (
    <div className="border-b py-1 gap-3 w-full flex">
      <Link href={`/content/${book?._id}`}>
        <img
          alt=""
          className="w-12 h-[69.6px] rounded-sm object-cover"
          src={book?.imgBooks?.imgUrl}
        />
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
            <AddList book={book} size={16} />
          </div>
        </div>
        <p className="text-sm text-gray-400">{book?.writer}</p>
      </div>
    </div>
  );
};
