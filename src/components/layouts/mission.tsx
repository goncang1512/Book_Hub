import React, { RefObject, useEffect, useRef } from "react";
import { LuMenu } from "react-icons/lu";

interface MissionProps {
  seeMission: boolean;
  setSeeMission: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarRef: RefObject<HTMLDivElement>;
}

export default function Mission({ seeMission, setSeeMission, sidebarRef }: MissionProps) {
  const missionRef = useRef<HTMLDivElement | null>(null);
  const buttonMission = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        missionRef.current &&
        !missionRef.current.contains(e.target as Node) &&
        buttonMission.current &&
        !buttonMission.current.contains(e.target as Node) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSeeMission(false);
      }
    };

    if (seeMission) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [seeMission]);

  return (
    <div
      className={`${
        seeMission ? "opacity-100 visibility-visible" : "opacity-0 visibility-hidden -z-[200]"
      } border-r shadow-xl h-screen duration-150 w-[100%] z-40 left-0 fixed bg-black/30`}
    >
      <div
        ref={missionRef}
        className={`${
          seeMission ? "md:translate-x-[18rem] translate-x-0" : "-translate-x-[100%] bg-transparent"
        } bg-white md:w-[40%] w-[80%] h-screen relative duration-700`}
      >
        <div>Mission</div>
        <button
          ref={buttonMission}
          className={`${seeMission ? "flex" : "hidden"} border-r border-y absolute rounded-r-md -right-[30px] bg-white`}
          onClick={() => setSeeMission(!seeMission)}
        >
          <LuMenu size={30} />
        </button>
      </div>
    </div>
  );
}
