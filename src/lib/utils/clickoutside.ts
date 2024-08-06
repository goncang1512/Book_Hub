/* eslint-disable no-undef */
//  <reference types="node" />
import React, { useEffect, useCallback, useState, useRef, useContext } from "react";
import { MisiContext } from "../context/misicontext";

function useClickOutside(refs: React.RefObject<HTMLElement>[], callback: () => void) {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (refs.every((ref) => ref.current && !ref.current.contains(event.target as Node))) {
        callback();
      }
    },
    [refs, callback],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
}

export default useClickOutside;

export const useInterval = (
  callback: () => void,
  delay: number | null,
): React.MutableRefObject<ReturnType<typeof setInterval> | undefined> => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      intervalRef.current = setInterval(tick, delay);
      return () => clearInterval(intervalRef.current);
    }
  }, [delay]);

  return intervalRef;
};

interface MissionProps {
  misiUser: any[];
  bacaBuku: { jenis: string } | null;
  session: { user: { _id: string } } | null;
}

const getSome = (misiUser: any, mission_id: string, status: boolean) => {
  return misiUser?.some((misi: any) => misi.mission_id === mission_id && misi.status === status);
};

export const useMission = ({ misiUser, bacaBuku, session }: MissionProps) => {
  const { addMisiUser } = useContext(MisiContext);
  const [novelMissionCompleted, setNovelMissionCompleted] = useState(false);
  const [cerpenMissionCompleted, setCerpenMissionCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (misiUser?.length > 0) {
      setNovelMissionCompleted(getSome(misiUser, "66b233b3672bbe53e753aa97", true));
      setCerpenMissionCompleted(getSome(misiUser, "66b233e4672bbe53e753aac3", true));
    }
  }, [misiUser]);

  useEffect(() => {
    if (seconds >= 60) {
      setSeconds(0);
      if (!novelMissionCompleted && bacaBuku?.jenis === "Novel") {
        if (session?.user?._id) {
          addMisiUser(session.user._id, "66b233b3672bbe53e753aa97", "Harian");
        }
        if (getSome(misiUser, "66b233b3672bbe53e753aa97", false)) {
          setNovelMissionCompleted(true);
        }
      } else if (!cerpenMissionCompleted && bacaBuku?.jenis === "Cerpen") {
        if (session?.user?._id) {
          addMisiUser(session.user._id, "66b233e4672bbe53e753aac3", "Harian");
        }
        if (getSome(misiUser, "66b233e4672bbe53e753aac3", false)) {
          setCerpenMissionCompleted(true);
        }
      }
    }
  }, [seconds, novelMissionCompleted, cerpenMissionCompleted, bacaBuku, misiUser, session]);

  return {
    novelMissionCompleted,
    cerpenMissionCompleted,
    seconds,
    setSeconds,
  };
};
