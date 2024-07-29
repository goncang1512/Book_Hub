import mongoose from "mongoose";

import { logger } from "../utils/logger";

export default async function connectMongoDB() {
  try {
    await mongoose.connect(String(process.env.MONGO_URI), {
      dbName: String(process.env.DATABASE_NAME),
    });
    logger.info("Successful connect to MongoDB");
  } catch (error) {
    logger.error("Failed to connect to MongoDB" + error);
  }
}
