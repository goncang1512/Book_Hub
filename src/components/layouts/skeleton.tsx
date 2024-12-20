import ReadMoreLess from "../elements/readmoreless";

export const CardBookSkaleton = ({ ukuran }: { ukuran?: string }) => {
  return (
    <div
      className={`flex ${
        ukuran ? ukuran : "w-full"
      } p-3 gap-4 border bg-white dark:bg-primary-black shadow-lg rounded-lg`}
    >
      <div className="skeleton dark:bg-primary-dark w-[92px] rounded-lg h-[144px] relative" />
      <div className="flex flex-col gap-1 justify-between w-full">
        <div className="skeleton dark:bg-primary-dark rounded-none flex w-full justify-between items-center h-9">
          <div className="font-semibold flex items-center gap-1" />
          <div className="flex items-center gap-3" />
        </div>
        <div className="h-full py-1 skeleton dark:bg-primary-dark rounded-none">
          <ReadMoreLess other maxLength={210} text="" textFont="md:text-sm text-xs text-gray-500" />
        </div>
        <div className="w-full h-5 skeleton dark:bg-primary-dark rounded-none">
          <div className="flex justify-between text-sm items-center" />
        </div>
      </div>
    </div>
  );
};

export const MisiCard = () => {
  return (
    <tr className="border-none">
      <td className="flex md:items-center items-star px-2">
        <div className="h-full flex items-center justify-center">
          <div className="rounded-full flex items-center justify-center skeleton dark:bg-primary-dark">
            <p className="size-[51px] flex items-center justify-center rounded-full text-black skeleton dark:bg-primary-dark" />
          </div>
        </div>
      </td>
      <td className="w-full">
        <div className="flex w-full items-start flex-col justify-center gap-1">
          <p className="leading-5 skeleton h-5 w-10 rounded-none" />
          <p className="skeleton dark:bg-primary-dark h-4 w-full rounded-none" />
        </div>
      </td>
      <td className="">
        <div className="flex w-full justify-end W-8">
          <div className="skeleton dark:bg-primary-dark w-8 h-5 flex items-center justify-end rounded-none" />
        </div>
      </td>
    </tr>
  );
};
