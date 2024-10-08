import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { MisiCard } from "../skeleton";
import { MisiContext } from "@/lib/context/misicontext";
import { GlobalState } from "@/lib/context/globalstate";

interface MissionProps {
  seeMission: boolean;
  setSeeMission: React.Dispatch<React.SetStateAction<boolean>>;
  missionRef: React.LegacyRef<HTMLDivElement> | null;
  buttonMission: React.LegacyRef<HTMLButtonElement> | null;
}

export default function Mission({
  seeMission,
  setSeeMission,
  buttonMission,
  missionRef,
}: MissionProps) {
  const [displayClass, setDisplayClass] = useState("hidden");
  const { data: session }: any = useSession();
  const { claimMisi, msgPoint } = useContext(MisiContext);
  const { missionUser, ldgMisiNotif } = useContext(GlobalState);

  useEffect(() => {
    if (seeMission) {
      const timer = setTimeout(() => {
        setDisplayClass("flex");
      }, 150);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayClass("hidden");
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [seeMission]);

  const { isDarkMode } = useContext(GlobalState);

  return (
    <div
      className={`${
        seeMission
          ? `${displayClass} opacity-100 visibility-visible`
          : `${displayClass} opacity-0 visibility-hidden -z-[100]`
      } border-r shadow-xl h-screen duration-150 w-[100%] z-40 left-0 fixed bg-black/30`}
    >
      <div
        ref={missionRef}
        className={`${
          seeMission ? "md:translate-x-[18rem] translate-x-0" : "-translate-x-[100%] bg-transparent"
        } bg-white dark:bg-primary-black dark:border-r md:w-[40%] w-[80%] h-screen relative duration-700`}
      >
        <div className="p-5 flex flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="table table-base">
              <tbody>
                {ldgMisiNotif
                  ? Array.from({ length: 4 }).map((_, index) => <MisiCard key={index} />)
                  : missionUser?.map((misi: any) => {
                      const hasil =
                        misi.misiUser &&
                        misi.misiUser.find((misi: any) => misi.user_id === session?.user?._id);
                      const processValue = hasil?.process !== undefined ? hasil.process : 0;
                      const maxValue = misi.max !== undefined ? misi.max : 1;
                      const percentage = (processValue / maxValue) * 100;
                      return (
                        <tr key={misi._id} className="border-none">
                          <td className="flex md:items-center items-star px-0">
                            <div className="h-full flex items-center justify-center">
                              <div
                                className={`size-14 bg-yellow-600 rounded-full flex items-center justify-center`}
                                style={{
                                  background: `conic-gradient(
                                  #facc15  ${percentage * 3.6}deg, 
                                  ${isDarkMode ? "#171717" : "#fff"} ${percentage * 3.6}deg
                                )`,
                                }}
                              >
                                <div className="bg-white dark:bg-primary-dark size-[51px] rounded-full flex items-center justify-center">
                                  <p className="bg-black/10 size-[51px] flex items-center justify-center rounded-full text-black dark:text-white p-[1px]">{`${hasil?.process ? hasil?.process : 0}/${misi.max}`}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="pr-0 pl-2">
                            <div className="flex items-start flex-col justify-center leading-[8px]">
                              <h2 className="font-semibold leading-5">{misi.judul}</h2>
                              <p className="md:text-sm text-xs leading-[10px]">{misi.detail}</p>
                            </div>
                          </td>
                          <td>
                            {hasil?.status ? (
                              hasil?.claim ? (
                                <button disabled className="text-yellow-500">
                                  <FaCheck size={20} />
                                </button>
                              ) : (
                                <div className="relative bg-red-500 w-max">
                                  <button
                                    aria-label={`buttonClaim${misi?._id}`}
                                    className="bg-yellow-400 border border-yellow-400 text-black w-8 h-5 flex items-center justify-center"
                                    onClick={() => claimMisi(hasil?._id, misi.point)}
                                  >
                                    <FaCheck size={15} />
                                  </button>
                                  <span
                                    className={`${
                                      msgPoint.status &&
                                      "-translate-y-5 opacity-0 transition-opacity duration-1000"
                                    } absolute -top-1 right-[7px] text-sm text-red-500 italic`}
                                  >
                                    {msgPoint.status &&
                                      msgPoint.misi_id === misi._id &&
                                      `+${msgPoint.msg}`}
                                  </span>
                                </div>
                              )
                            ) : (
                              <Link
                                aria-label={`misiLink${misi?._id}`}
                                className="bg-black border border-yellow-600 text-yellow-400 w-8 h-5 flex items-center justify-center"
                                href={misi.link}
                              >
                                <MdKeyboardArrowRight size={20} />
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
        <ButtonMission
          buttonMission={buttonMission}
          className={`${seeMission ? "opacity-100 visibility-visible" : "opacity-0 visibility-hidden"}  bg-white dark:bg-primary-black border-r border-y rounded-r-md top-[23.5px] -right-[30px] fixed duration-150`}
          seeMission={seeMission}
          setSeeMission={setSeeMission}
        />
      </div>
    </div>
  );
}

export const ButtonMission = ({
  seeMission,
  setSeeMission,
  buttonMission,
  className,
}: {
  seeMission: boolean;
  setSeeMission: React.Dispatch<React.SetStateAction<boolean>>;
  buttonMission?: React.LegacyRef<HTMLButtonElement> | null;
  className: string;
}) => {
  const [position, setPosition] = useState({ top: 23.5 });
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (dragging) {
      e.preventDefault();
      const screenHeight = window.innerHeight;
      const buttonHeight = 30;
      let clientY;

      if (e instanceof TouchEvent) {
        clientY = e.touches[0].clientY;
      } else {
        clientY = e.clientY;
      }

      const newTop = clientY - buttonHeight / 2;
      const boundedTop = Math.min(Math.max(newTop, 0), screenHeight - buttonHeight);
      setPosition({
        top: boundedTop,
      });
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const addListeners = () => {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDragMove, { passive: false });
      document.addEventListener("touchend", handleDragEnd);
      document.addEventListener("touchstart", handleTouchStart, { passive: false });
    };

    const removeListeners = () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
      document.removeEventListener("touchstart", handleTouchStart);
    };

    if (dragging) {
      addListeners();
    } else {
      removeListeners();
    }

    return () => {
      removeListeners();
    };
  }, [dragging]);

  return (
    <button
      ref={buttonMission}
      aria-label="buttonMission"
      className={`${dragging ? "cursor-grabbing" : "cursor-grab"} ${className}`}
      style={{ top: `${position.top}px`, touchAction: "none" }}
      onClick={() => setSeeMission(!seeMission)}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <LuMenu size={30} />
    </button>
  );
};
