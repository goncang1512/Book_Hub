import { misiServices } from "@/lib/services/missionservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { judul, detail, link, type, max } = await req.json();
    const result = await misiServices.makeMission(judul, detail, link, type, max);

    logger.info("Success create mission");
    return NextResponse.json(
      { status: true, statusCode: 201, message: "Success create mission", result },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed create mission");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed create mission", error },
      { status: 500 },
    );
  }
};
