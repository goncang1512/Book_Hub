import React, { useEffect, useCallback } from "react";

function useClickOutside(refs: React.RefObject<HTMLElement>[], callback: () => void) {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (refs.every((ref) => ref.current && !ref.current.contains(event.target as Node))) {
        callback();
      }
    },
    [refs, callback],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
}

export default useClickOutside;
