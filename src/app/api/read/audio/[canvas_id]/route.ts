import { deletedAudio, uploadAudioStream } from "@/lib/middleware/uploadImg";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { canvasSrv } from "@/lib/services/canvasservices";

export const POST = async (req: NextRequest, { params }: { params: { canvas_id: string } }) => {
  const formData = await req.formData();
  const file = formData.get("audio") as File;

  if (!file) {
    return NextResponse.json(
      { status: false, statusCode: 400, message: "File is required." },
      { status: 400 },
    );
  }

  const fileBuffer = await file.arrayBuffer();

  const base64Data = Buffer.from(fileBuffer);
  try {
    if (file.size > 10 * 1024 * 1024) {
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

    const newAudio: any = await uploadAudioStream(base64Data);
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
  const formData = await req.formData();
  const file = formData.get("audio") as File;

  if (!file) {
    return NextResponse.json(
      { status: false, statusCode: 400, message: "File is required." },
      { status: 400 },
    );
  }

  const fileBuffer = await file.arrayBuffer();

  const base64Data = Buffer.from(fileBuffer);

  try {
    if (file.size > 10 * 1024 * 1024) {
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

    const newAudio: any = await uploadAudioStream(base64Data);
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
