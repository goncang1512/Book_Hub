/* eslint-disable react/self-closing-comp */
"use client";
import * as React from "react";

import CardProduct from "@/components/layouts/cardproduct";

const product = {
  title: "Teruslah Bodoh Jangan Pintar",
  imgProduct:
    "http://res.cloudinary.com/dykunvz4p/image/upload/v1715438917/cover/andxd6a2khjmklvin60s.jpg",
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
    </div>
  );
}
