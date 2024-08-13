import { NextRequest, NextResponse } from "next/server";

import connectMongoDB from "@/lib/config/connectMongoDb";
import { logger } from "@/lib/utils/logger";
import { getLikeContent } from "@/lib/middleware/likechek";
import { storyServices } from "@/lib/services/storyservices";
import { getMyFollower } from "@/lib/middleware/getmyfollower";

export const GET = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
  await connectMongoDB();
  try {
    let result;
    let story;
    let myFollower;
    if (params.id[0] === "mystory") {
      const storys: any = await storyServices.getStoryUser(params.id[1]);
      result = await getLikeContent(storys);
    } else if (params.id[0] === "detailstory") {
      const detailStory = await storyServices.detailStory(params.id[1]);
      result = await getLikeContent(detailStory);
      const storys = await storyServices.getIdBook(params.id[1]);
      story = await getLikeContent(storys);
      if (params.id[2]) {
        myFollower = await getMyFollower(params.id[2]);
      }
    }

    logger.info("Success get story");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get story",
        result,
        story: story && story,
        myFollower: myFollower && myFollower,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get story");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get story", error },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const result = await storyServices.delete(params.id);

    logger.info("Success deleted story");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success deleted story",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed deleted story");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed deleted story",
        error,
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { ception } = await req.json();

    if (!ception) {
      return NextResponse.json(
        {
          status: false,
          statsuCode: 422,
          message: "Tidak ada cerita yang di bagikan",
        },
        { status: 422 },
      );
    }

    const result = await storyServices.update(ception, params.id);

    logger.info("Success updated story");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success updated story",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed updated story");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed updated story",
        error,
      },
      { status: 500 },
    );
  }
};
