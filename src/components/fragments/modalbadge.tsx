import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

import Img from "./image";

import { UserContext } from "@/lib/context/usercontext";

export const ModalBadge = ({ dataUser }: { dataUser: any }) => {
  const [badgeUser, setBadgeUser] = useState<string[]>([]);
  const { patchBadge, ldlPatchBadge } = useContext(UserContext);
  const [lastSelectedBadge, setLastSelectedBadge] = useState<string | null>(null);

  useEffect(() => {
    setBadgeUser(dataUser?.badge || []);
  }, [dataUser?.badge]);

  const addBadgeAtPosition = (badges: string[], badge: string, position: number) => {
    if (!badges.includes(badge)) {
      let newBadges = [...badges];
      if (position >= newBadges.length) {
        newBadges.push(badge);
      } else {
        newBadges.splice(position, 0, badge);
      }
      return newBadges;
    }
    return badges;
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBadge = event.target.value;
    setLastSelectedBadge(selectedBadge);

    setBadgeUser((prevBadges) => {
      switch (selectedBadge) {
        case "/badge/verify.png":
          return addBadgeAtPosition(prevBadges, selectedBadge, 0);
        case "/badge/pena.png":
          return addBadgeAtPosition(prevBadges, selectedBadge, 1);
        case "/badge/readers.png":
          return addBadgeAtPosition(prevBadges, selectedBadge, 2);
        default:
          return addBadgeAtPosition(prevBadges, selectedBadge, prevBadges.length);
      }
    });
  };

  return (
    <dialog className="modal" id="modal_badge">
      <div className="modal-box flex flex-col gap-5">
        <div className={`relative w-full justify-end flex gap-5`}>
          <select
            className={`flex select select-bordered w-full`}
            value={lastSelectedBadge || ""}
            onChange={handleSelectChange}
          >
            <option disabled value="">
              Choose a Badge
            </option>
            <option value="/badge/verify.png">Verify</option>
            <option value="/badge/pena.png">Pena</option>
            <option value="/badge/readers.png">Readers</option>
          </select>
          {ldlPatchBadge ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <button
              aria-label="buttonUpdateBadge"
              onClick={() => patchBadge(dataUser?._id, badgeUser)}
            >
              <FaRegEdit size={20} />
            </button>
          )}
        </div>

        {/* Badge */}
        <div className="flex flex-wrap gap-3">
          {badgeUser.map((logo: string, index: number) => {
            return (
              <div key={index} className="flex items-center border gap-1 w-max px-1 rounded-sm">
                <Img key={index} className="size-6" src={`${logo}`} />
                <button
                  aria-label={`buttonBadge${logo}`}
                  className="hover:bg-gray-300 rounded-full"
                  type="button"
                  onClick={() => {
                    setBadgeUser((prevBadge: string[]) =>
                      prevBadge.filter((lencana: string) => lencana !== logo),
                    );
                  }}
                >
                  <IoIosClose size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button
          aria-label="buttonCloseModalBadge"
          onClick={() => {
            const modal = document.getElementById("modal_badge") as HTMLDialogElement;
            modal.close();
          }}
        >
          close
        </button>
      </form>
    </dialog>
  );
};
