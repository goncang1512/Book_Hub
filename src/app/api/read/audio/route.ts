import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/config/cloudinary";

const streamToBuffer = (stream: ReadableStream): Promise<Buffer> => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  return new Promise((resolve, reject) => {
    function read() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            resolve(Buffer.concat(chunks));
          } else {
            chunks.push(value);
            read();
          }
        })
        .catch(reject);
    }
    read();
  });
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const audio = formData.get("audio");

  if (!audio || !(audio instanceof Blob)) {
    return NextResponse.json(
      { error: "No audio file provided or invalid file format" },
      { status: 400 },
    );
  }

  const audioBuffer = await streamToBuffer(audio.stream());

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "video", folder: "audio" }, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(audioBuffer);
  });

  return NextResponse.json(
    {
      result: result,
    },
    { status: 201 },
  );
};
