import * as React from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FaRegStarHalfStroke, FaStar, FaRegStar } from "react-icons/fa6";

import ReadMoreLess from "@/components/elements/readmoreless";
import { Button } from "@/components/elements/button";

type ProductProps = {
  title: string;
  imgProduct: string;
  description: string;
  price: number;
  rating: number;
  ongkir: boolean;
};

export default function CardProduct({
  product,
  index,
  width,
  maxLength,
}: {
  product: ProductProps;
  index: number;
  width: string;
  maxLength?: number;
}) {
  if (!product) return 0;

  const { title, imgProduct, description, price, rating } = product;

  const parseNumber = (angka: number) => {
    var reverse = angka.toString().split("").reverse().join(""),
      ribuan: any = reverse.match(/\d{1,3}/g);
    ribuan = ribuan?.join(".").split("").reverse().join("");
    return ribuan;
  };

  return (
    <div className={`${width} flex flex-col shadow-lg border rounded-lg`}>
      <div className="relative">
        <img alt="" className="w-full object-cover h-64 rounded-t-lg border-b" src={imgProduct} />
        {index % 2 === 0 && (
          <span
            className="flex items-center gap-2 absolute top-2 left-0 px-3 py-2 rounded-r-lg text-white text-sm"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            <LiaShippingFastSolid size={20} /> Free shipping
          </span>
        )}
      </div>
      <div className="flex flex-col p-3 rounded-b-lg gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-md font-semibold">{title}</h1>
          <ReadMoreLess
            maxLength={maxLength ? maxLength : 80}
            other={false}
            text={`${description}`}
            textFont="text-sm text-gray-900"
          />
          <div className="w-full flex justify-between items-center">
            <p>Rp{parseNumber(price)}</p>
            <div className="flex items-center gap-1 text-yellow-500">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < Math.floor(rating) ? (
                    <FaStar />
                  ) : index === Math.floor(rating) && rating % 1 !== 0 ? (
                    <FaRegStarHalfStroke />
                  ) : (
                    <FaRegStar />
                  )}
                </span>
              ))}
              <span className="text-black text-sm">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Button
            label={`buttonProductdetail${index}`}
            size="detail"
            type="button"
            variant="detail"
          >
            Detail
          </Button>
          <Button label={`buttonProduct${index}`} size="buy" type="button" variant="buy">
            <MdOutlineShoppingCart size={25} />
          </Button>
        </div>
      </div>
    </div>
  );
}
