import React, { useState, useRef, useEffect } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

export default function DropDown({
  children,
  label,
  size,
}: {
  children: React.ReactNode;
  label: string;
  size?: number;
}) {
  const [showCardContent, setShowCardContent] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (
        buttonRef &&
        !buttonRef.current?.contains(e.target as Node) &&
        containerRef &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        setShowCardContent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  return (
    <div className="relative">
      <div>
        <div
          ref={containerRef}
          className={`${
            showCardContent ? "opacity-100" : "opacity-0 pointer-events-none"
          } hover:opacity-100 absolute md:top-4 top-3 md:right-5 right-4 flex-col bg-white border rounded-lg p-3 w-36 duration-100 z-10`}
          onMouseEnter={() => setShowCardContent(true)}
          onMouseLeave={() => setShowCardContent(false)}
        >
          {children}
        </div>
        <button
          ref={buttonRef}
          aria-label={label}
          className="cursor-pointer relative"
          onMouseEnter={() => setShowCardContent(true)}
          onMouseLeave={() => setShowCardContent(false)}
        >
          <HiDotsHorizontal className="relative" size={size ? size : 25} />
        </button>
      </div>
    </div>
  );
}

export const DropDownKlik = ({ children }: { children: React.ReactNode }) => {
  const [showCardContent, setShowCardContent] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (
        buttonRef &&
        !buttonRef.current?.contains(e.target as Node) &&
        containerRef &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        setShowCardContent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);
  return (
    <div className="relative">
      <div>
        <div
          ref={containerRef}
          className={`${
            showCardContent ? "flex" : "hidden"
          } absolute top-5 right-5 flex-col bg-white border rounded-lg p-3 w-36`}
        >
          {children}
        </div>
        <button
          ref={buttonRef}
          className="cursor-pointer relative flex items-center justify-center"
          onClick={() => setShowCardContent(!showCardContent)}
        >
          <HiDotsHorizontal className="relative" size={25} />
        </button>
      </div>
    </div>
  );
};
