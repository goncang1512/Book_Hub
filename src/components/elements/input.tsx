import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FiEye, FiEyeOff } from "react-icons/fi";

import styles from "@/lib/style.module.css";

const input = cva("", {
  variants: {
    variant: {
      float: `border-b px-1 py-2 outline-none bg-white text-black text-[1em] w-full focus:border-b focus:border-solid focus:border-[#3b82f6] bg-white`,
      labelFloat: `border px-[20px] py-[10px] outline-none bg-white rounded-md text-black text-[1em] w-full focus:border focus:border-solid focus:border-[#3b82f6]`,
    },
    varLabel: {
      float: `bg-transparent pointer-events-none text-base left-0 top-[10px] absolute ease-[cubic-bezier(0.05, 0.81, 0, 0.93)] duration-200 text-slate-400`,
      labelFloat: `bg-white ml-3 pointer-events-none text-base left-0 top-[10px] absolute ease-[cubic-bezier(0.05, 0.81, 0, 0.93)] duration-200 text-gray-400`,
    },
    container: {
      float: `${styles.inputADD} relative`,
      labelFloat: `${styles.inputBox} relative`,
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
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof input> {
  name: string;
  type: string;
  value: string | number;
  classLabel?: string;
  classDiv?: string;
  required?: boolean;
  pattern?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly?: boolean;
}

export const Input: React.FC<InputProps> = ({
  name,
  type,
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
  pattern,
  readonly,
}) => {
  const [seePassword, setSeePassword] = useState(false);
  return (
    <>
      {type === "password" ? (
        <div className={input({ container, className: classDiv })}>
          <input
            className={input({ variant, className })}
            id={name}
            name={name}
            pattern={pattern}
            placeholder=""
            readOnly={readonly}
            required={required}
            type={seePassword ? "text" : "password"}
            value={value}
            onChange={onChange}
          />
          <label className={input({ varLabel, className: classLabel })} htmlFor={name}>
            {children}
          </label>
          <button
            className="absolute right-2 top-3 cursor-pointer"
            onClick={() => setSeePassword(!seePassword)}
          >
            {seePassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>
      ) : (
        <div className={input({ container, className: classDiv })}>
          <input
            className={input({ variant, className })}
            id={name}
            name={name}
            pattern={pattern}
            placeholder=""
            readOnly={readonly}
            required={required}
            type={type}
            value={value}
            onChange={onChange}
          />
          <label className={input({ varLabel, className: classLabel })} htmlFor={name}>
            {children}
          </label>
        </div>
      )}
    </>
  );
};
