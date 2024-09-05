import { deletedAudio, uploadAudio } from "@/lib/middleware/uploadImg";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { canvasSrv } from "@/lib/services/canvasservices";

const maxSize = 3 * 1024 * 1024;

export const POST = async (req: NextRequest, { params }: { params: { canvas_id: string } }) => {
  const { audio, size, type } = await req.json();
  try {
    if (size > maxSize) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: "Ukuran file audio tidak boleh melebihi 3MB",
        },
        { status: 422 },
      );
    }

    if (!params.canvas_id) {
      return NextResponse.json({
        status: false,
        statusCode: 422,
        message: "Canvas id not invalid",
      });
    }

    const newAudio: any = await uploadAudio({ audio, size, type });

    const result = await canvasSrv.addAudio(params.canvas_id, {
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

export const PATCH = async (req: NextRequest, { params }: { params: { canvas_id: string } }) => {
  const {
    audio,
  }: {
    audio: { size: number; audio: string; type: string };
  } = await req.json();

  try {
    if (audio.size > maxSize) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: "Ukuran file audio tidak boleh melebihi 3MB",
        },
        { status: 422 },
      );
    }

    const canvas = await canvasSrv.getByIdCanvas(params.canvas_id);

    const newAudio: any = await uploadAudio(audio);
    const result = await canvasSrv.addAudio(params.canvas_id, {
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
