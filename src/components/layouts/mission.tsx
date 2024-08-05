import React, { useEffect, useState } from "react";
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
        <div>Mission</div>
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
    e.preventDefault(); // Prevent default behavior for both mouse and touch events
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (dragging) {
      e.preventDefault(); // Prevent default behavior for both mouse and touch events
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

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDragMove);
      document.addEventListener("touchend", handleDragEnd);
    } else {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [dragging]);

  return (
    <button
      ref={buttonMission}
      className={` ${dragging ? "cursor-grabbing" : "cursor-grab"} ${className}`}
      style={{ top: `${position.top}px` }}
      onClick={() => setSeeMission(!seeMission)}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <LuMenu size={30} />
    </button>
  );
};
