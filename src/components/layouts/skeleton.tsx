import ReadMoreLess from "../elements/readmoreless";

export const CardBookSkaleton = ({ ukuran }: { ukuran?: string }) => {
  return (
    <div
      className={`flex ${
        ukuran ? ukuran : "md:w-[49.3%] w-full"
      } p-3 gap-4 border bg-white shadow-lg rounded-lg`}
    >
      <div className="skeleton w-[92px] rounded-lg h-[144px] relative" />
      <div className="flex flex-col gap-1 justify-between w-full">
        <div className="skeleton rounded-none flex w-full justify-between items-center h-9">
          <div className="font-semibold flex items-center gap-1" />
          <div className="flex items-center gap-3" />
        </div>
        <div className="h-full py-1 skeleton rounded-none">
          <ReadMoreLess other maxLength={210} text="" textFont="md:text-sm text-xs text-gray-500" />
        </div>
        <div className="w-full h-5 skeleton rounded-none">
          <div className="flex justify-between text-sm items-center" />
        </div>
      </div>
    </div>
  );
};
