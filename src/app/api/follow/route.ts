import { followServices } from "@/lib/services/followservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { user_id, follower_id } = await req.json();

    const result = await followServices.followUser(user_id, follower_id);

    logger.info("Success follow user");
    return NextResponse.json(
      { status: true, statusCode: 201, message: "Success follow user", result },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed follow user: " + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed follow user", error },
      { status: 500 },
    );
  }
};
