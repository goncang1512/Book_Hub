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
      avatar: "md:size-28 size-20",
    },
  },
  defaultVariants: {},
});

export interface DivProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof image> {
  src: string;
}

const Picture: React.FC<DivProps> = ({ src, className, variant, size }) => {
  return (
    <div
      className={`relative overflow-hidden ${styles.imageContainer} ${image({
        variant,
        size,
        className,
      })}`}
    >
      <Image
        alt="Picture"
        className="object-cover"
        draggable={false}
        height={0}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        src={src && src}
        style={{ width: "100%", height: "100%" }}
        width={0}
      />
    </div>
  );
};

export default Picture;
