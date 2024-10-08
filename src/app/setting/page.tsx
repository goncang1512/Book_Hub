"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import { useContext } from "react";

import { UserContext } from "@/lib/context/usercontext";
import { GlobalState } from "@/lib/context/globalstate";

export default function Setting() {
  const { data, status }: any = useSession();
  const { deleteAccount } = useContext(UserContext);

  const { isDarkMode, setIsDarkMode } = useContext(GlobalState);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode: boolean) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };
  return (
    <main className="flex bg-latar-light dark:bg-latar-dark">
      <div className="flex flex-col w-full h-screen bg-latar-light dark:bg-latar-dark md:mr-[38%] mr-0 border-r">
        <div
          className={`${
            status === "authenticated" ? "flex" : "hidden"
          } flex-col border-b-4 dark:border-primary-black md:px-8 md:pt-8 pb-2 px-2 pt-2`}
        >
          <h2 className="text-sm text-gray-400">Profile</h2>
          <div className="flex flex-col leading-1">
            <Link className="hidden" href={`/profil/editprofil`}>
              Edit Profil
            </Link>
            <Link href={`/profil/editprofil/password`}>Change Password / Email</Link>
            <Link href={`/profil/editprofil/fotoprofil`}>Change foto profile</Link>
            <Link href={`/profil/editprofil/biografi`}>Biografi</Link>
          </div>
        </div>
        {(data?.user?.role === "Author" || data?.user?.role === "Developer") && (
          <div className="flex flex-col border-b-4 dark:border-primary-black md:px-8 pb-2 px-2 pt-2">
            <h2 className="text-sm text-gray-400">Author</h2>
            <div className="flex flex-col leading-1">
              <Link href={`/profil/author/mybook`}>Add my book</Link>
              <Link href={`/profil/author`}>See my book</Link>
            </div>
          </div>
        )}
        {data?.user?.role === "Developer" && (
          <div className="flex flex-col border-b-4 dark:border-primary-black md:px-8 pb-2 px-2 pt-2">
            <h2 className="text-sm text-gray-400">Dasboard</h2>
            <div className="flex flex-col leading-1">
              <Link href={`/profil/dasboard/users`}>User</Link>
              <Link href={`/profil/dasboard/inbox`}>Inbox</Link>
              <Link href={`/profil/dasboard/toko`}>My Store</Link>
            </div>
          </div>
        )}

        <div className="flex flex-col border-b-4 dark:border-primary-black md:px-8 pb-2 px-2 pt-2">
          <h2 className="text-sm text-gray-400">Other</h2>
          <div className="flex flex-col leading-1">
            <Link href={`/leaderboard`}>Leaderboard</Link>
            <Link
              className={`${status === "authenticated" ? "flex" : "hidden"}`}
              href={`/profil/upload`}
            >
              Add review
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <p>Theme</p>
            <label className="grid cursor-pointer place-items-center">
              <input
                checked={isDarkMode}
                className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
                type="checkbox"
                value="synthwave"
                onChange={toggleDarkMode}
              />
              <svg
                className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              <svg
                className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </label>
          </div>
        </div>
        <div className="flex flex-col border-b-4 dark:border-primary-black md:px-8 pb-2 px-2 pt-2">
          <h2 className="text-sm text-gray-400">Login</h2>
          <div className="flex justify-start flex-col leading-1">
            {status === "authenticated" ? (
              <>
                <button
                  className="text-red-500 text-start"
                  onClick={async () => {
                    await signOut({ callbackUrl: "/login" });
                  }}
                >
                  Log out
                </button>
                <button
                  className="text-red-500 text-start"
                  onClick={() => {
                    const confirm = window.confirm("Apakah Anda yakin ingin menghapus akun?");
                    if (confirm) {
                      deleteAccount(data?.user?._id);
                    }
                  }}
                >
                  Delete Account
                </button>
              </>
            ) : (
              <>
                <Link href={`/login`}>Sign In</Link>
                <Link href={`/register`}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div />
    </main>
  );
}
