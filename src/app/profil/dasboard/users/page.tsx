"use client";
import React, { useContext } from "react";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

import BarisTable, { dataUserType } from "@/components/fragments/baristable";
import { useUsers } from "@/lib/utils/useSwr";
import { DasboardContext } from "@/lib/context/dasboardcontext";

export default function UserDasboard() {
  const { userData, userDataLoading } = useUsers.Leaderboard();
  const { searchUser, keyword, setKeyWord, dataUser, msgSearchUser } = useContext(DasboardContext);

  if (userDataLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <span className="loading loading-bars loading-lg" />
      </div>
    );
  }

  const checkUser = dataUser || userData;
  return (
    <div className="h-screen overflow-hidden relative">
      <div
        className={`${
          msgSearchUser.status ? "bottom-2" : "-bottom-[100px]"
        } alert alert-error absolute  w-[30%] duration-150 right-2 z-40`}
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
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span>{msgSearchUser.message}</span>
      </div>
      <div className="w-full py-2 flex items-center justify-center">
        <form
          className="w-[40%]"
          onSubmit={(e) => {
            e.preventDefault();
            searchUser(keyword);
          }}
        >
          <div className="w-full flex items-center border border-black rounded-full px-4 py-2">
            <input
              className="outline-none w-full"
              placeholder="Telusuri..."
              type="text"
              value={keyword}
              onChange={(e) => setKeyWord(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <button
                className={`${keyword !== "" ? "flex" : "hidden"}`}
                type="button"
                onClick={() => {
                  setKeyWord("");
                }}
              >
                <IoMdClose size={25} />
              </button>
              <button type="submit">
                <IoMdSearch size={25} />
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="overflow-x-auto h-screen">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Email</th>
              <th>Rank</th>
              <th>Badge</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {checkUser &&
              checkUser.map((user: dataUserType, index: number) => {
                return <BarisTable key={index} dataUser={user} index={index} />;
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
