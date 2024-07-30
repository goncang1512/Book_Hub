"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import { useContext } from "react";

import { UserContext } from "@/lib/context/usercontext";

export default function Setting() {
  const { data, status }: any = useSession();
  const { deleteAccount } = useContext(UserContext);
  return (
    <main className="flex">
      <div className="flex flex-col w-full h-screen bg-white md:mr-[38%] mr-0 border-r">
        <div
          className={`${
            status === "authenticated" ? "flex" : "hidden"
          } flex-col border-b-4 md:px-8 md:pt-8 pb-2 px-2 pt-2`}
        >
          <h2 className="text-sm text-gray-400">Profil</h2>
          <div className="flex flex-col leading-1">
            <Link className="hidden" href={`/profil/editprofil`}>
              Edit Profil
            </Link>
            <Link href={`/profil/editprofil/password`}>Ganti Password</Link>
            <Link className="hidden" href={`/profil/editprofil/email`}>
              Ganti Email
            </Link>
            <Link href={`/profil/editprofil/fotoprofil`}>Ganti Foto Profil</Link>
            <Link href={`/profil/editprofil/biografi`}>Biografi</Link>
          </div>
        </div>
        {(data?.user?.role === "Author" || data?.user?.role === "Developer") && (
          <div className="flex flex-col border-b-4 md:px-8 pb-2 px-2 pt-2">
            <h2 className="text-sm text-gray-400">Author</h2>
            <div className="flex flex-col leading-1">
              <Link href={`/profil/author/mybook`}>Tambahkan Buku</Link>
              <Link href={`/profil/author`}>Lihat buku saya</Link>
            </div>
          </div>
        )}
        {data?.user?.role === "Developer" && (
          <div className="flex flex-col border-b-4 md:px-8 pb-2 px-2 pt-2">
            <h2 className="text-sm text-gray-400">Dasboard</h2>
            <div className="flex flex-col leading-1">
              <Link href={`/profil/dasboard/users`}>User</Link>
              <Link href={`/profil/dasboard/inbox`}>Inbox</Link>
              <Link href={`/profil/dasboard/toko`}>My Store</Link>
            </div>
          </div>
        )}

        <div className="flex flex-col border-b-4 md:px-8 pb-2 px-2 pt-2">
          <h2 className="text-sm text-gray-400">Lainnya</h2>
          <div className="flex flex-col leading-1">
            <Link href={`/leaderboard`}>Leaderboard</Link>
            <Link
              className={`${status === "authenticated" ? "flex" : "hidden"}`}
              href={`/profil/upload`}
            >
              Tambahkan Review
            </Link>
          </div>
        </div>
        <div className="flex flex-col border-b-4 md:px-8 pb-2 px-2 pt-2">
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
