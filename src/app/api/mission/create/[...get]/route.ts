import { misiServices } from "@/lib/services/missionservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { get: string[] } }) => {
  try {
    const user_id = params.get[0];

    if (!params.get || params.get.length === 0) {
      throw new Error("No parameters provided");
    }
    const result = await misiServices.getMissionUser(user_id);

    logger.info("Success get mision user");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success get mission user", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get mission user: " + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get mission user", error },
      { status: 500 },
    );
  }
};
