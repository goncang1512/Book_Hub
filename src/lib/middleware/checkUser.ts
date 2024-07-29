import UserModels from "../models/users";

export const checkExistingUser = async (email: string, username: string) => {
  const userByEmail = await UserModels.findOne({ email: email });
  const userByUsername = await UserModels.findOne({ username: username });

  if (userByEmail) {
    return { status: true, message: "Email sudah terdaftar" };
  }

  if (userByUsername) {
    return { status: true, message: "Username sudah terdaftar" };
  }

  return { status: false, message: "Success check user" };
};

const mimeType = ["image/png", "image/jpg", "image/jpeg"];

export const checkFotoProfil = async (imgProfil: any) => {
  if (!mimeType.includes(imgProfil.type)) {
    return { condition: true, message: "Bukan file foto" };
  }

  if (imgProfil.size > 5000000) {
    return { condition: true, message: "Ukuran file foto terlalu besar" };
  }

  return { condition: false, message: "success" };
};

export const checkExistingUserUpdate = async (
  email: string,
  username: string,
  id: string,
): Promise<{ status: boolean; message: string }> => {
  const userByEmail = await UserModels.findOne({ email: email });
  const userByUsername = await UserModels.findOne({ username: username });

  if (userByEmail && userByEmail._id.toString() !== id) {
    return { status: true, message: "Email sudah terdaftar" };
  }

  if (userByUsername && userByUsername._id.toString() !== id) {
    return { status: true, message: "Username sudah terdaftar" };
  }

  return { status: false, message: "Success check user" };
};
