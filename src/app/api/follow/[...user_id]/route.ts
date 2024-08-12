import UserModels from "@/lib/models/users";
import { followServices } from "@/lib/services/followservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { user_id: string[] } }) => {
  try {
    const user_id = params.user_id[0];
    const result = await UserModels.findOne(
      { _id: user_id },
      "_id username email imgProfil rank role createdAt badge",
    );

    const getMengikuti = await followServices.getMengikuti(result._id);
    const diikuti = await followServices.getDiikuti(result._id);
    const userWithFollower = { ...result.toObject(), follower: getMengikuti, myFollower: diikuti };

    logger.info("Success get follower user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get follower user",
        result: userWithFollower,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get follower user: " + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get follower user", error },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { user_id: string[] } }) => {
  try {
    const user_id = params.user_id[0];
    const follower_id = params.user_id[1];

    const result = await followServices.unfollowUser(user_id, follower_id);

    logger.info("Success unfollow user");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success unfollow user", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed unfollow user: " + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed unfollow user", error },
      { status: 500 },
    );
  }
};
