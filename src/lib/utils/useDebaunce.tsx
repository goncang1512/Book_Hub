import { useRef } from "react";

const useDebounce = () => {
  const debounceTimeout = useRef<any>(null);

  const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  return { debounce };
};

export default useDebounce;
