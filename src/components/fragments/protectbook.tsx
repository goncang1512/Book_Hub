import React, { useEffect } from "react";

export default function ProtectBook({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const handlePrintScreen = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        document.body.style.filter = "blur(10px)";
        setTimeout(() => {
          window.alert("Screenshots are disabled on this page. Please click OK to continue.");
          document.body.style.filter = "none";
        }, 1);
        e.preventDefault();
      }
    };

    const handlePrintScreenKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        document.body.style.filter = "blur(10px)";
        setTimeout(() => {
          window.alert("Screenshots are disabled on this page. Please click OK to continue.");
          document.body.style.filter = "none";
        }, 1);
      }
    };

    const handleDevTools = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        setTimeout(() => {
          window.alert("Developer tools are disabled on this page.");
        }, 1);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = "blur(10px)";
      } else {
        document.body.style.filter = "none";
      }
    };

    const addEventListeners = () => {
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handlePrintScreen);
      document.addEventListener("keyup", handlePrintScreenKeyUp);
      document.addEventListener("keydown", handleDevTools);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    };

    const removeEventListeners = () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handlePrintScreen);
      document.removeEventListener("keyup", handlePrintScreenKeyUp);
      document.removeEventListener("keydown", handleDevTools);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    addEventListeners();
    return () => {
      removeEventListeners();
    };
  }, []);

  return <div>{children}</div>;
}
