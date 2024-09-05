/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState, MouseEvent, TouchEvent } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { useResponsiveValue } from "@/lib/utils/extractText";

export default function AudioPlayer({ audioSrc }: { audioSrc: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startDragTime, setStartDragTime] = useState<number>(0);

  const nilai = useResponsiveValue({
    widthBreakpoint: 768,
    mobileValue: "120",
    desktopValue: "80",
  });

  useEffect(() => {
    setPosition({
      x: window.innerWidth - 83,
      y: window.innerHeight - Number(nilai),
    });
  }, [nilai]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    if (audio) {
      audio.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault();
      const newX = Math.min(window.innerWidth - 60, Math.max(0, e.clientX - offset.x));
      const newY = Math.min(window.innerHeight - 60, Math.max(0, e.clientY - offset.y));
      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStartDragTime(Date.now());
    setIsDragging(true);
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      const newX = Math.min(window.innerWidth - 60, Math.max(0, touch.clientX - offset.x));
      const newY = Math.min(window.innerHeight - 60, Math.max(0, touch.clientY - offset.y));
      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    // Check if the touch was a tap (not a drag)
    if (Date.now() - startDragTime < 300) {
      handlePlayPause();
    }
  };

  return (
    <div
      ref={playerRef}
      className="fixed flex items-center justify-center border rounded-full p-2 bg-[#00b88c] z-50 size-[60px] ease-linear"
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    >
      <button onClick={handlePlayPause}>
        {isPlaying ? <FaPause size={25} /> : <FaPlay size={25} />}
      </button>

      <audio ref={audioRef} className="max-md:w-48">
        <source src={audioSrc} type="audio/mpeg" />
        <track kind="metadata" srcLang="en" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
