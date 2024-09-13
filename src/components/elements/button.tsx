import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("button", {
  variants: {
    variant: {
      default: "",
      primary: `bg-[#0077B6] text-white border-transparent 
        md:hover:bg-[#03045E] max-[640px]:active:bg-[#03045E] rounded-lg`,
      danger: `bg-red-500 text-white border-transparent 
      hover:bg-red-600`,
      secondary: `bg-white text-gray-800 border-gray-400 hover:bg-gray-100`,
      login: "bg-[#0077B6] font-semibold text-white rounded-lg active:bg-[#03045E]",
      detail: "rounded-lg border border-black font-semibold active:bg-slate-100",
      buy: "bg-black text-white rounded-lg active:bg-gray-700",
      posting:
        "bg-[#0077B6] text-white border-transparent md:hover:bg-[#03045E] max-[640px]:active:bg-[#03045E] rounded-full",
      buttonClick:
        "text-[#252525] uppercase rounded-lg border-2 border-[#252525] bg-white shadow-[3px_3px_0_#000] cursor-pointer active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
    },
    size: {
      default: "",
      small: `text-sm py-1 px-2`,
      medium: `text-base py-2 px-4 font-semibold`,
      login: "w-full py-2",
      detail: "w-full py-2",
      buy: "p-2",
      buttonClick: "text-sm w-[50%] px-2 py-1 font-mono",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  type,
  disabled,
  onClick,
  label,
  children,
  ...props
}) => (
  <button
    aria-label={label}
    className={button({ variant, size, className })}
    disabled={disabled}
    type={type}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);
