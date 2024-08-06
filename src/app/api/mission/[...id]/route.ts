import { misiServices } from "@/lib/services/missionservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const result = await misiServices.getMisiUserId(params.id[0]);

    logger.info("Success get mission user");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success get mission user", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get mission user");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get mission user", error },
      { status: 500 },
    );
  }
};
