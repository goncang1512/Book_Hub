import React, { ChangeEventHandler } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import styles from "@/lib/style.module.css";

const input = cva("", {
  variants: {
    variant: {
      float: `border-b px-1 py-2 outline-none bg-white text-black text-[1em] w-full focus:border-b focus:border-solid focus:border-[#3b82f6] bg-white`,
    },
    varLabel: {
      float: `bg-white pointer-events-none text-base left-0 top-[10px] absolute ease-[cubic-bezier(0.05, 0.81, 0, 0.93)] duration-200 text-slate-400`,
    },
    container: {
      float: `${styles.inputADD} relative`,
    },
    size: {
      small: `text-sm py-1 px-2`,
      medium: `text-base py-2 px-4`,
      login: "w-full py-2",
      detail: "w-full py-2",
      buy: "p-2",
    },
  },
});

export interface InputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof input> {
  name: string;
  value: string;
  classLabel?: string;
  classDiv?: string;
  required?: boolean;
  pattern?: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

export const TextArea: React.FC<InputProps> = ({
  name,
  variant,
  container,
  varLabel,
  className,
  classLabel,
  classDiv,
  children,
  onChange,
  value,
  required,
  placeholder,
  ...rest
}) => {
  return (
    <div className={input({ container, className: classDiv })}>
      <textarea
        className={input({ variant, className })}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <label className={input({ varLabel, className: classLabel })} htmlFor={name}>
        {children}
      </label>
    </div>
  );
};
