import React, { RefObject, useEffect, useRef } from "react";
import { LuMenu } from "react-icons/lu";

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
