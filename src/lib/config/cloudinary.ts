"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.CLOUD_KEY}`,
  api_secret: `${process.env.CLOUD_KEY_SECRET}`,
});

export async function uploadAudioCloud(formData: FormData) {
  const file = formData.get("audio") as File;
  const buffer: Buffer = Buffer.from(await file.arrayBuffer());
  try {
    const base64Image: string = `data:${file.type};base64,${buffer.toString("base64")}`;
    const response = await cloudinary.uploader.upload(base64Image, {
      resource_type: "video",
      public_id: "my_video",
    });
    return response;
  } catch (error: any) {
    console.error(error);
  }
}
