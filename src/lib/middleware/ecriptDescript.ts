import crypto from "crypto";

const algorithm = "aes-256-cbc";

export const encriptTs = (data: string, key: Buffer) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(data, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  const encryptedDataWithIV = Buffer.concat([iv, Buffer.from(encryptedData, "hex")]);
  return encryptedDataWithIV.toString("base64");
};

export const decrypt = (data: string, key: Buffer) => {
  const buffer = Buffer.from(data, "base64");
  const iv = buffer.slice(0, 16);
  const encryptedData = buffer.slice(16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);

  return decryptedData.toString("utf-8");
};
