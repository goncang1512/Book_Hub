import { logger } from "../utils/logger";
import cloudinary from "../config/cloudinary";

import { v2 as cloudinarys } from "cloudinary";
import streamifier from "streamifier";

export const uploadImg = async (img: any) => {
  try {
    if (img.oldId !== "profil/ptkdih6zbetqjfddpqhf") {
      await cloudinary.uploader.destroy(img.oldId);
      logger.info("Berhasil hapus img lama");
    }

    const result = await cloudinary.uploader.upload(`${img.img}`, {
      folder: "profil",
      transformation: [{ width: 300, height: 300, crop: "fill" }],
    });

    return result;
  } catch (error) {
    return logger.info("Failed upload img");
  }
};

export const checkExistingFoto = async (img: any) => {
  try {
    if (img !== "profil/ptkdih6zbetqjfddpqhf") {
      await cloudinary.uploader.destroy(img);
      logger.info("Berhasil hapus img lama");
    }
  } catch (error) {
    logger.info("Gagal hapus img lama : " + error);
  }
};

export const uploadCover = async (img: any) => {
  try {
    const result = await cloudinary.uploader.upload(`${img.img}`, {
      folder: "cover",
      transformation: [{ width: 220, height: 319, crop: "fill" }],
    });

    return result;
  } catch (error) {
    return logger.info("Failed upload img");
  }
};

export const updateCover = async (
  oldId: string,
  imgBooks: { size: number; type: string; img: string },
) => {
  try {
    await cloudinary.uploader.destroy(oldId);
    const result = await cloudinary.uploader.upload(`${imgBooks.img}`, {
      folder: "cover",
      transformation: [{ width: 220, height: 319, crop: "fill" }],
    });

    return result;
  } catch (error) {
    return logger.info("Failed upload img");
  }
};

export const uploadAudio = async (audio: any) => {
  try {
    const result = await cloudinary.uploader.upload(`${audio}`, {
      resource_type: "video",
      chunk_size: 6000000,
      folder: "audio",
    });

    return result;
  } catch (error) {
    logger.error("Failed to upload audio: " + error); // Menggunakan logger untuk log error
    throw new Error("Failed to upload audio" + error);
  }
};

export const uploadAudioStream = async (audioBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinarys.uploader.upload_stream(
      {
        resource_type: "video",
        chunk_size: 6000000,
        folder: "audio",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );

    streamifier.createReadStream(audioBuffer).pipe(uploadStream);
  });
};

export const deletedAudio = async (audio_id: string) => {
  try {
    const result = await cloudinary.uploader.destroy(audio_id, { resource_type: "video" });
    logger.info(`Berhasil hapus img lama: ${result}`);
  } catch (error) {
    return logger.error("Failed delted audio cerpen");
  }
};

export const uploadBG = async (
  img: { size: number; background: string; type: string },
  public_id: string,
) => {
  try {
    const result = await cloudinary.uploader.upload(`${img.background}`, {
      folder: "background",
      transformation: [{ width: 800, height: 300, crop: "fill" }],
    });

    if (public_id !== "default_id") {
      await cloudinary.uploader.destroy(public_id);
    }

    return result;
  } catch (error) {
    logger.info("Failed upload img");
    return {
      public_id: "",
      secure_url: "",
    };
  }
};

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

export const audioStream = async (audio: File) => {
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

  return result;
};
