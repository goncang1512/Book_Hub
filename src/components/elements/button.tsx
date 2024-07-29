import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("button", {
  variants: {
    variant: {
      primary: `bg-[#00b88c] text-white border-transparent 
        md:hover:bg-[#1AA886] max-[640px]:active:bg-[#1AA886] rounded-lg`,
      danger: `bg-red-500 text-white border-transparent 
      hover:bg-red-600`,
      secondary: `bg-white text-gray-800 border-gray-400 hover:bg-gray-100`,
      login: "bg-[#00b88c] font-semibold text-white rounded-lg active:bg-[#1AA886]",
      detail: "rounded-lg border border-black font-semibold active:bg-slate-100",
      buy: "bg-black text-white rounded-lg active:bg-gray-700",
      posting:
        "bg-[#00b88c] text-white border-transparent md:hover:bg-[#1AA886] max-[640px]:active:bg-[#1AA886] rounded-full",
    },
    size: {
      small: `text-sm py-1 px-2`,
      medium: `text-base py-2 px-4 font-semibold`,
      login: "w-full py-2",
      detail: "w-full py-2",
      buy: "p-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  type,
  disabled,
  onClick,
  ...props
}) => (
  <button
    className={button({ variant, size, className })}
    disabled={disabled}
    type={type}
    onClick={onClick}
    {...props}
  />
);
