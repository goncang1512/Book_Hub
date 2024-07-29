import { useRef } from "react";

const useDebounce = () => {
  const debounceTimeout = useRef<any>(null);
  const debounce = (func: Function, delay: number) => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        func();
      }, delay);
    };
  };

  return { debounce };
};

export default useDebounce;
