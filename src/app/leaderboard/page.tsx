"use client";
import * as React from "react";
import { useContext } from "react";

import Img from "@/components/fragments/image";
import { GlobalState } from "@/lib/context/globalstate";
import { useUsers } from "@/lib/utils/useSwr";

export default function Leaderboard() {
  const { userData, userDataLoading } = useUsers.Leaderboard();
  const { handleRouter } = useContext(GlobalState);

  return (
    <>
      {userDataLoading ? (
        <div className="flex h-screen w-full justify-center items-center">
          <span className="loading loading-bars loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <p className="text-center">No.</p>
                </th>
                <th>User</th>
                <th>Rank</th>
                <th className="md:flex hidden">Experience</th>
              </tr>
            </thead>
            <tbody>
              {userData &&
                userData.map((user: any, index: number) => {
                  const peringkatClass =
                    index + 1 === 1
                      ? "w-[40px] h-[32px]"
                      : index + 1 === 2
                        ? "w-[40px] h-[36px]"
                        : index + 1 === 3
                          ? "w-[30px] h-[32px]"
                          : null;
                  const srcImg =
                    index + 1 === 1
                      ? "/badge/new-number-one.png"
                      : index + 1 === 2
                        ? "/badge/new-number-two.png"
                        : index + 1 === 3
                          ? "/badge/new-number-three.png"
                          : null;
                  return (
                    <tr key={user._id}>
                      <th>
                        <div className="flex items-center justify-center">
                          {index + 1 >= 1 && index + 1 <= 3 ? (
                            <>
                              <Img className={`${peringkatClass}`} src={`${srcImg}`} />
                            </>
                          ) : (
                            `${index + 1}`
                          )}
                        </div>
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <Img
                              className="md:flex hidden cursor-pointer md:size-12 size-8 rounded-full border"
                              src={`${user.imgProfil.imgUrl}`}
                              onClick={() => handleRouter(user?._id)}
                            />
                          </div>
                          <div>
                            <button
                              className="flex items-center gap-2"
                              onClick={() => handleRouter(user?._id)}
                            >
                              <p className="font-bold md:text-base text-sm max-md:truncate max-md:w-[50px] cursor-pointer">
                                {user?.username}
                              </p>
                              <div className="flex items-center">
                                {user?.badge.map((logo: string, index: number) => (
                                  <Img key={index} className="size-4" src={`${logo}`} />
                                ))}
                              </div>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="flex items-center gap-2">
                        <Img className="md:size-16 size-8" src={user.rank.rankNow} />
                        <p className="font-semibold text-center">
                          level <br className="md:hidden flex" /> {user.rank.level}
                        </p>
                      </td>
                      <td className="max-md:hidden">{user.rank.experience}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
