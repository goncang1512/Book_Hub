import * as React from "react";
import { useContext } from "react";
import { BsCheckLg } from "react-icons/bs";

import { StoryContext } from "@/lib/context/storycontext";

export const PesanLvlUp = ({
  msgRank,
}: {
  msgRank: {
    experience: number;
    level: number;
    lvlUp: { status: boolean; message: string };
  };
}) => {
  const { setMsgLvlUp, msgLvlUp } = useContext(StoryContext);
  return (
    <dialog className="modal" id="modal_lvlup">
      <div className="modal-box">
        <div className="flex items-center flex-col">
          <h3 className="font-bold text-lg text-green-600 bg-green-300 w-max rounded-full p-2">
            <BsCheckLg size={40} />
          </h3>
          <p className="py-4">{msgRank.lvlUp.message}</p>
        </div>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button
          onClick={() =>
            setMsgLvlUp({
              ...msgLvlUp,
              lvlUp: {
                status: false,
                message: "",
              },
            })
          }
        >
          close
        </button>
      </form>
    </dialog>
  );
};
