/* eslint-disable react/self-closing-comp */
"use client";
import * as React from "react";

import CardProduct from "@/components/layouts/cardproduct";
import Img from "@/components/fragments/image";

const product = {
  title: "Teruslah Bodoh Jangan Pintar",
  imgProduct:
    "https://res.cloudinary.com/dykunvz4p/image/upload/v1718373198/cover/p80z9op25ihvv15x3o79.jpg",
  description:
    "Galon air sendiri adalah wadah besar berisi air minum yang digunakan untuk memenuhi kebutuhan konsumsi air di rumah atau kantor. Mengutip laman resmi Aqua, jawaban dari pertanyaan Aqua galon berapa liter adalah 19 liter.",
  price: 22000,
  rating: 2.0,
  ongkir: true,
  size: "size-[8rem]",
};

export default function Orders() {
  return (
    <div className="p-3 flex flex-col gap-2 w-full justify-start">
      <div className="flex flex-wrap gap-2 w-full justify-start">
        {Array.from({ length: 7 }).map((_, index) => (
          <CardProduct
            key={index}
            index={index + 1}
            maxLength={72}
            product={product}
            width="md:w-[24.5%] w-[49.1%]"
          />
        ))}
      </div>
      <div className="flex items-center justify-center h-screen w-full">
        <div className="relative w-max flex flex-col justify-center items-center rounded-full">
          <Img
            className="size-16 rounded-full border-2 border-gray-500"
            src="https://res.cloudinary.com/dykunvz4p/image/upload/v1720535893/profil/qsapnyufmxqqnci1e9vw.jpg"
          />
          <p className="absolute bg-gray-500 text-white size-3 text-[8.5px] rounded-full p-2 text-center flex items-center justify-center text-xs border border-gray-500 bottom-0 translate-y-1/2">
            99
          </p>
        </div>
      </div>
    </div>
  );
}
