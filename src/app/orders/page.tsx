/* eslint-disable react/self-closing-comp */
"use client";
import * as React from "react";

import CardProduct from "@/components/layouts/cardproduct";
import Picture from "@/components/elements/image";
import instance from "@/lib/utils/fetch";
import { uploadAudioCloud } from "@/lib/config/cloudinary";

const product = {
  title: "Teruslah Bodoh Jangan Pintar",
  imgProduct:
    "https://res.cloudinary.com/dykunvz4p/image/upload/v1718373198/cover/p80z9op25ihvv15x3o79.jpg",
  description:
    "Galon air sendiri adalah wadah besar berisi air minum yang digunakan untuk memenuhi kebutuhan konsumsi air di rumah atau kantor. Mengutip laman resmi Aqua, jawaban dari pertanyaan Aqua galon berapa liter adalah 19 liter.",
  price: 22000,
  rating: 2.0,
  ongkir: true,
  size: "size-[8rem]",
};

export default function Orders() {
  const [previewAudio, setPreviewAudio] = React.useState("");
  const [loadingAudio, setLoadingAudio] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const tesAudio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoadingAudio(true);

    try {
      const audio = await uploadAudioCloud(formData);
      const res = await instance.post("/api/read/audio", { result: audio });
      console.log(res);
      setPreviewAudio(res.data.result.secure_url);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error({ error });
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div className="p-3 flex flex-col gap-2 w-full justify-start">
      <div className="flex flex-wrap gap-2 w-full justify-start">
        {Array.from({ length: 7 }).map((_, index) => (
          <CardProduct
            key={index}
            index={index + 1}
            maxLength={72}
            product={product}
            width="md:w-[24.5%] w-[49.1%]"
          />
        ))}
      </div>
      <Picture
        className="rounded-lg object-cover border md:w-[88px] w-[80px] h-[140px] md:h-[144px]"
        src="https://res.cloudinary.com/dykunvz4p/image/upload/v1716989533/cover/pg0mrdha74kzs9329tyb.jpg"
      />

      <form ref={formRef} onSubmit={tesAudio}>
        <input
          name="audio"
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e?.target?.files?.[0];
            if (file) {
              const audioURL = URL.createObjectURL(file);
              setPreviewAudio(audioURL);
            }
          }}
        />
        <button className="bg-blue-500 px-2 py-1 rounded-lg" type="submit">
          {loadingAudio ? "Loading..." : "Submit"}
        </button>
      </form>
      {previewAudio && (
        <audio controls>
          <source src={previewAudio} type="audio/ogg" />
          <source src={previewAudio} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      )}
    </div>
  );
}
