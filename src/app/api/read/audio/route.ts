import { deletedAudio, uploadAudio } from "@/lib/middleware/uploadImg";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { canvasSrv } from "@/lib/services/canvasservices";

export const POST = async (req: NextRequest) => {
  const { audio, size, type, canvas_id } = await req.json();
  try {
    if (audio.size > 9437184) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: "Ukuran file audio tidak boleh melebihi 3MB",
        },
        { status: 422 },
      );
    }

    if (!canvas_id) {
      return NextResponse.json({
        status: false,
        statusCode: 422,
        message: "Canvas id not invalid",
      });
    }

    const newAudio: any = await uploadAudio({ audio, size, type });

    const result = await canvasSrv.addAudio(canvas_id, {
      public_id: newAudio?.public_id,
      audioUrl: newAudio?.secure_url,
    });

    logger.info("Success upload audio cerpen");
    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: "Success upload audio cerpen",
        result,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed upload audio cerpen: " + error);
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed upload audio cerpen",
        error,
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  const {
    canvas_id,
    audio,
  }: {
    canvas_id: string;
    audio: { size: number; audio: string; type: string };
  } = await req.json();
  try {
    if (audio.size > 9437184) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: "Ukuran file audio tidak boleh melebihi 3MB",
        },
        { status: 422 },
      );
    }

    const canvas = await canvasSrv.getByIdCanvas(canvas_id);

    const newAudio: any = await uploadAudio(audio);
    const result = await canvasSrv.addAudio(canvas_id, {
      public_id: newAudio?.public_id,
      audioUrl: newAudio?.secure_url,
    });

    if (canvas.audio.public_id) {
      await deletedAudio(canvas.audio.public_id);
    }

    logger.info("Success updated audio cerpen");
    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: "Success updated audio cerpen",
        result,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed update audio cerpen" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed update audio cerpen", error },
      { status: 500 },
    );
  }
};
