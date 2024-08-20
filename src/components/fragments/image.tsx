import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const image = cva("bg-cover bg-no-repeat bg-center", {
  variants: {
    variant: {
      book: "border rounded-lg shadow-xl",
      bookCard: "rounded-lg object-cover border",
      avatar: "rounded-full border bg-white",
    },
    size: {
      book: "md:w-[144px] md:h-[223.09px] w-[124px] h-[183.09px]",
      bookCard: "md:w-[92px] w-[89px] h-[140px] md:h-[144px]",
      avatar: "md:size-28 size-20",
    },
  },
  defaultVariants: {},
});

export interface DivProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof image> {
  src: string;
}

const Img: React.FC<DivProps> = ({ className, variant, src, size, ...props }) => {
  return (
    <div {...props}>
      <div
        className={`${image({
          variant,
          size,
          className,
        })}`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export default Img;
