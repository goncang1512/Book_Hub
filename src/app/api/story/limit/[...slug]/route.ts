import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";
import { getBalasan, getLikeContent } from "@/lib/middleware/likechek";
import StoryModels from "@/lib/models/storyModel";

export const GET = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  await connectMongoDB();
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "7";

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let totalItems;
    if (params.slug[0] === "user") {
      totalItems = await StoryModels.find({ user_id: params.slug[1] });
    } else {
      totalItems = await StoryModels.find({ book_id: params.slug[0] });
    }

    const totalPages = Math.ceil(totalItems.length / parseInt(limit));

    let result;
    if (params.slug[0] === "user") {
      result = await StoryModels.find({ user_id: params.slug[1] })
        .populate("user", "_id username email imgProfil role badge rank")
        .populate("book")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    } else {
      result = await StoryModels.find({ book_id: params.slug[0] })
        .populate("user", "_id username email imgProfil role badge rank")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    const storyWithLike = await getLikeContent(result);
    const hasil = await getBalasan(storyWithLike);

    logger.info("Success get detail book by id");
    return NextResponse.json(
      { status: true, data: hasil, totalPages, page: Number(page) },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Gagal ambil buku" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get book" },
      { status: 500 },
    );
  }
};
