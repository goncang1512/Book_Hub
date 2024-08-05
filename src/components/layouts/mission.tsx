import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";

const misiUser = [
  {
    _id: "sdfas9dfja0sdf9as0d9fu0sd9fm",
    judul: "Baca Novel",
    detail: "Baca novel selama 5 menit.",
    link: "/read/sdfas9dfja0sdf9as0d9fu0sdsd9",
    proses: 1,
    max: 5,
  },
  {
    _id: "sdfas9dfjad9ef9as0d9fu0sdse9",
    judul: "Baca Cerpen",
    detail: "Baca cerpen selama 3 menit.",
    link: "/read/sdfas9dfja0sdf9as0d9fu0sde32",
    proses: 2,
    max: 3,
  },
  {
    _id: "sdfas9a9d9d9ef9as0d9fu0sdf9s",
    judul: "Berikan Ulasan",
    detail: "Berikan ulasan sebanyak 5 di buku mana saja.",
    link: "/read/sdfas9dfja0sdf9as0d9fu0sd3ed",
    proses: 3,
    max: 5,
  },
  {
    _id: "sdfas9a9d9dd9u9as0d9fu0sdfjd",
    judul: "Berikan Respon",
    detail: "Berikan respon kepada ulasan user sebanyak 5 kali.",
    link: "/read/sdfas9dfja0sdf9as0d9fu0sdsde",
    proses: 3,
    max: 5,
  },
];

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

  return (
    <div
      className={`${
        seeMission
          ? `${displayClass} opacity-100 visibility-visible`
          : `${displayClass} opacity-0 visibility-hidden -z-[200]`
      } border-r shadow-xl h-screen duration-150 w-[100%] z-40 left-0 fixed bg-black/30`}
    >
      <div
        ref={missionRef}
        className={`${
          seeMission ? "md:translate-x-[18rem] translate-x-0" : "-translate-x-[100%] bg-transparent"
        } bg-white md:w-[40%] w-[80%] h-screen relative duration-700`}
      >
        <div className="p-5 flex flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="table table-base">
              <tbody>
                {misiUser.map((misi: any) => {
                  return (
                    <tr key={misi._id} className="border-none">
                      <td className="flex md:items-center items-star px-0">
                        <div className="h-full">
                          <div className="size-14 bg-black/5 rounded-full flex items-center justify-center">
                            {`${misi.proses}/${misi.max}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-0">
                        <div className="flex items-start flex-col justify-center leading-[8px]">
                          <h2 className="font-semibold leading-5">{misi.judul}</h2>
                          <p className="md:text-sm text-xs leading-[10px]">{misi.detail}</p>
                        </div>
                      </td>
                      <td>
                        <Link
                          className="bg-black border border-yellow-600 text-yellow-400 w-8 h-5 flex items-center justify-center"
                          href={misi.link}
                        >
                          <MdKeyboardArrowRight size={20} />
                        </Link>
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
          className={`${seeMission ? "opacity-100 visibility-visible" : "opacity-0 visibility-hidden"}  bg-white border-r border-y rounded-r-md top-[23.5px] -right-[30px] fixed duration-150`}
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
