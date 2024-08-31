/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { SetStateAction, useEffect, useRef } from "react";
import { RiCloseLine } from "react-icons/ri";

export default function ModalBox({
  dataModal,
  setDataModal,
  children,
}: {
  dataModal: any;
  setDataModal: React.Dispatch<SetStateAction<any | null>>;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    if (dataModal) {
      containerRef?.current?.showModal();
    } else {
      containerRef?.current?.close();
    }
  }, [dataModal]);

  return (
    <dialog ref={containerRef} className="modal" onClick={() => setDataModal(null)}>
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-screen-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end pt-1 pr-1">
          <button
            className="rounded-full hover:bg-slate-300 text-black hover:text-red-500"
            onClick={() => setDataModal(null)}
          >
            <RiCloseLine size={25} />
          </button>
        </div>
        <div className="px-5 pb-5">{children}</div>
      </div>
    </dialog>
  );
}
