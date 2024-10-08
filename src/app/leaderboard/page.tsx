"use client";
import * as React from "react";

import Picture from "@/components/elements/image";
import { useUsers } from "@/lib/utils/useSwr";
import Link from "next/link";

export default function Leaderboard() {
  const { userData, userDataLoading } = useUsers.Leaderboard();

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
            <thead className="text-black dark:text-white">
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
                          : `${index}`;
                  const srcImg =
                    index + 1 === 1
                      ? "/badge/new-number-one.png"
                      : index + 1 === 2
                        ? "/badge/new-number-two.png"
                        : index + 1 === 3
                          ? "/badge/new-number-three.png"
                          : `${index}`;
                  return (
                    <tr key={user._id}>
                      <th>
                        <div className="flex items-center justify-center">
                          {index + 1 >= 1 && index + 1 <= 3 ? (
                            <>
                              <Picture className={`${peringkatClass}`} src={srcImg} />
                            </>
                          ) : (
                            `${index + 1}`
                          )}
                        </div>
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <Link href={`/user/@${user?.username}`}>
                              <Picture
                                className="md:flex hidden cursor-pointer md:size-12 size-8 rounded-full border"
                                src={user.imgProfil.imgUrl}
                              />
                            </Link>
                          </div>
                          <div>
                            <Link
                              aria-labelledby={`buttonRouter${user?.username}`}
                              className="flex items-center gap-2"
                              href={`/user/@${user?.username}`}
                            >
                              <p className="font-bold md:text-base text-sm max-md:truncate max-md:w-[50px] cursor-pointer">
                                {user?.username}
                              </p>
                              <div className="flex items-center">
                                {user?.badge.map((logo: string, index: number) => (
                                  <Picture key={index} className="size-4" src={logo} />
                                ))}
                              </div>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="flex items-center gap-2">
                        <Picture className="md:size-16 size-8" src={user.rank.rankNow} />
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
