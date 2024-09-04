import cloudinary from "../config/cloudinary";
import { logger } from "../utils/logger";

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
    const result = await cloudinary.uploader.upload(`${audio.audio}`, {
      resource_type: "video", // Specify resource_type as "video" for audio and video files
      folder: "audio",
    });

    return result;
  } catch (error) {
    return logger.info("Failed upload img");
  }
};
