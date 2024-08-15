"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/elements/button";
import instance from "@/lib/utils/fetch";
import { Input } from "@/components/elements/input";
import { TimeDow } from "@/lib/utils/parseTime";

export default function Toko() {
  const [bisaSeason, setBisaSeason] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  }>(TimeDow());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = TimeDow();
      setTimeLeft(newTimeLeft);

      if (Object.keys(newTimeLeft).length === 0) {
        setBisaSeason(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen p-5 overflow-hidden relative w-full flex items-center justify-center flex-col gap-3">
      <h1 className="font-bold text-xl">Count Down New Season</h1>
      {timeLeft.days !== undefined ? (
        <div className="flex items-center gap-1">
          <p>
            {timeLeft.days} hari - {timeLeft.hours} jam - {timeLeft.minutes} menit-{" "}
            {timeLeft.seconds} detik
          </p>
        </div>
      ) : (
        <p>Waktunya season</p>
      )}

      {bisaSeason && (
        <Button
          className=""
          label="buttonNewSeason"
          variant="primary"
          onClick={() => {
            const modal = document.getElementById("modal_new_season") as HTMLDialogElement;
            modal.showModal();
          }}
        >
          New Season
        </Button>
      )}

      <ModalNewSeason setBisaSeason={setBisaSeason} />
    </div>
  );
}

const ModalNewSeason = ({
  setBisaSeason,
}: {
  setBisaSeason: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: session }: any = useSession();
  const [loadingNewSession, setLoadingNewSession] = useState(false);
  const [msgSeason, setMsgSeason] = useState(false);
  const [psdSeason, setPsdSeason] = useState("");

  const newSeason = async (password: string) => {
    if (password !== "samudera1512") {
      setMsgSeason(true);
      setTimeout(() => {
        setMsgSeason(false);
      }, 3000);
      return false;
    }
    try {
      setLoadingNewSession(true);
      await instance.patch(
        "/api/user",
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      );
      setLoadingNewSession(false);
      setBisaSeason(false);
      const modal = document.getElementById("modal_new_season") as HTMLDialogElement;
      modal.close();
    } catch (error) {
      setLoadingNewSession(false);
      setMsgSeason(true);
      setTimeout(() => {
        setMsgSeason(false);
      }, 3000);
    }
  };

  return (
    <dialog className="modal" id="modal_new_season">
      <div className="modal-box flex flex-col">
        <form
          className="flex flex-col gap-5 relative"
          onSubmit={(e) => {
            e.preventDefault();
            newSeason(psdSeason);
          }}
        >
          <div
            className={`${
              msgSeason ? "top-0" : "absolute -top-[100px]"
            } alert alert-error duration-150 z-40`}
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
            <span>Gagal untuk masuk ke season baru</span>
          </div>
          <Input
            container="labelFloat"
            name="psdSeason"
            type="password"
            value={psdSeason}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setPsdSeason(e.target.value)}
          >
            Password new season
          </Input>
          <Button label="buttonPasswordSeason" type="submit" variant="primary">
            {loadingNewSession ? "Loading..." : "New Season"}
          </Button>
        </form>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button>close</button>
      </form>
    </dialog>
  );
};
