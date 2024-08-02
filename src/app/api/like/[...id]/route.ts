import { NextRequest, NextResponse } from "next/server";

import { likeServices } from "@/lib/services/likeservices";
import { logger } from "@/lib/utils/logger";
import { userSevices } from "@/lib/services/userservices";

export const GET = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
  try {
    let result;
    if (params.id[0] === "content") {
      result = await likeServices.likeContent(params.id[1]);
    } else {
      result = await likeServices.getLikeUser(params.id[0]);
    }

    logger.info("Success get like user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get like user",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get like user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed get like user",
        error,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
  try {
    const result = await likeServices.dislike(params.id[0], params.id[1]);
    const user = await userSevices.getUser(params.id[2]);

    logger.info("Success deleted like user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success deleted like user",
        result,
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed deleted like user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed deleted like user",
        error,
      },
      { status: 500 },
    );
  }
};
