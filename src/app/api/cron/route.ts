import { misiServices } from "@/lib/services/missionservices";
import { logger } from "@/lib/utils/logger";
import { NextResponse } from "next/server";

export const DELETE = async () => {
  try {
    const result = await misiServices.udpateHarian();

    logger.info("Success udpate misi harian");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success update misi harian", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed delete misi user harian");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed delete misi user harian", error },
      { status: 500 },
    );
  }
};
