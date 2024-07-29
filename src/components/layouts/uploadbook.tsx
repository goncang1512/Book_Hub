import * as React from "react";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";

import { Input } from "../elements/input";
import { Button } from "../elements/button";

type DataBook = {
  genre: string[];
};

export const UploadGenre = ({
  setDataBook,
  dataBook,
}: {
  setDataBook: React.Dispatch<any>;
  dataBook: DataBook;
}) => {
  const [genre, setGenre] = useState<string>("");

  const addGenre = () => {
    if (genre.trim() !== "") {
      setDataBook((prevState: any) => ({
        ...prevState,
        genre: [...prevState.genre, genre],
      }));
      setGenre("");
    }
  };

  const deletedGenre = (name: string) => {
    setDataBook((prevState: any) => ({
      ...prevState,
      genre: prevState.genre.filter((genre: string) => genre !== name),
    }));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between gap-2 w-full">
        <Input
          classDiv="w-full"
          classLabel="text-gray-500"
          container="labelFloat"
          name="genre"
          type="text"
          value={genre}
          varLabel="labelFloat"
          variant="labelFloat"
          onChange={(e) => setGenre(e.target.value)}
        >
          Genre
        </Input>
        <Button type="button" onClick={addGenre}>
          Add
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap md:w-72 w-full">
        {dataBook &&
          dataBook.genre.map((genre: any, index: number) => {
            return (
              <div key={index} className="flex items-center border gap-1 w-max px-1 rounded-sm">
                <p className="text-sm">{genre}</p>
                <button
                  className="hover:bg-gray-300 rounded-full"
                  type="button"
                  onClick={() => deletedGenre(genre)}
                >
                  <IoIosClose size={18} />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};
