/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useResponsiveValue } from "@/lib/utils/extractText";
import React, { useEffect, useRef, useState, MouseEvent, TouchEvent } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function AudioPlayer({ audioSrc }: { audioSrc: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Mencegah aksi default saat mouse down
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault(); // Mencegah aksi default saat mouse move
      const newX = Math.min(
        window.innerWidth - 60, // batas kanan
        Math.max(0, e.clientX - offset.x), // batas kiri
      );
      const newY = Math.min(
        window.innerHeight - 60, // batas bawah
        Math.max(0, e.clientY - offset.y), // batas atas
      );

      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Mencegah aksi default saat mouse up
    setIsDragging(false);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // Mencegah aksi default saat touch start
    setIsDragging(true);
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault(); // Mencegah aksi default saat touch move
      const touch = e.touches[0];
      const newX = Math.min(
        window.innerWidth - 60, // batas kanan
        Math.max(0, touch.clientX - offset.x), // batas kiri
      );
      const newY = Math.min(
        window.innerHeight - 60, // batas bawah
        Math.max(0, touch.clientY - offset.y), // batas atas
      );

      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // Mencegah aksi default saat touch end
    setIsDragging(false);
  };

  return (
    <div
      ref={playerRef}
      className="fixed flex items-center justify-center border rounded-full p-2 bg-[#00b88c] z-50 size-[60px]"
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
