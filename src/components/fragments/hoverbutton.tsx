import React, { useState, createContext, useContext, useRef } from "react";

const HoverCardContext = createContext<any>(null);

const HoverCard = ({ children }: { children: React.ReactNode }) => {
  const [showCardContent, setShowCardContent] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  return (
    <HoverCardContext.Provider
      value={{ showCardContent, setShowCardContent, containerRef, buttonRef }}
    >
      <div className="relative">{children}</div>
    </HoverCardContext.Provider>
  );
};

const HoverCardTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setShowCardContent, buttonRef } = useContext(HoverCardContext);

  return (
    <div
      ref={buttonRef}
      className="cursor-pointer relative"
      onMouseEnter={() => setShowCardContent(true)}
      onMouseLeave={() => setShowCardContent(false)}
    >
      {children}
    </div>
  );
};

const HoverCardContent = ({ children }: { children: React.ReactNode }) => {
  const { showCardContent, setShowCardContent, containerRef } = useContext(HoverCardContext);

  return (
    <div
      ref={containerRef}
      className={`${
        showCardContent ? "opacity-100" : "opacity-0 pointer-events-none"
      } hover:opacity-100 absolute top-4 right-5 flex-col bg-white dark:bg-primary-black border rounded-lg p-3 w-36 duration-100`}
      onMouseEnter={() => setShowCardContent(true)}
      onMouseLeave={() => setShowCardContent(false)}
    >
      {children}
    </div>
  );
};

HoverCard.Trigger = HoverCardTrigger;
HoverCard.Content = HoverCardContent;

export default HoverCard;
