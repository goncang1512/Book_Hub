import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function DetailStory({ children }: { children: React.ReactNode }) {
  const [seeDetail, setSeeDetail] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClikOutSide = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref?.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setSeeDetail(false);
      }
    };

    document.addEventListener("mousedown", handleClikOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClikOutSide);
    };
  }, [ref, buttonRef]);

  return (
    <div className={`md:hidden flex flex-col`}>
      <div className="flex items-center justify-end">
        <button
          ref={buttonRef}
          aria-label="buttonDetailStory"
          className={`${seeDetail ? "-rotate-90" : ""} pb-2 duration-150`}
          onClick={() => setSeeDetail(!seeDetail)}
        >
          <IoIosArrowBack size={15} />
        </button>
      </div>
      <div
        ref={ref}
        className={`${
          seeDetail ? "h-full" : "h-[0px] overflow-hidden md:hidden flex -mt-4"
        } duration-100 ease-in-out container-detail`}
      >
        {children}
      </div>
    </div>
  );
}
