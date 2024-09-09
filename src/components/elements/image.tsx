import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import styles from "@/lib/style.module.css";

const image = cva("bg-cover bg-no-repeat bg-center", {
  variants: {
    variant: {
      book: "border rounded-lg shadow-xl",
      bookCard: "rounded-lg object-cover border",
      avatar: "rounded-full border bg-white",
    },
    size: {
      book: "md:w-[144px] md:h-[223.09px] w-[124px] h-[183.09px]",
      bookCard: "md:w-[88px] w-[80px] h-[140px] md:h-[144px]",
      avatar: "md:w-28 md:h-28 w-20 h-20", // Sesuaikan ukuran Tailwind
    },
  },
  defaultVariants: {},
});

export interface DivProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof image> {
  src: string;
}

const Picture: React.FC<DivProps> = ({ src, className, variant, size }) => {
  if (!src) {
    return null;
  }

  return (
    <div
      className={`relative overflow-hidden ${styles.imageContainer} ${image({
        variant,
        size,
        className,
      })}`}
    >
      <Image
        fill
        alt="Picture"
        className="object-cover w-full h-full"
        draggable={false}
        src={src}
      />
    </div>
  );
};

export default Picture;
