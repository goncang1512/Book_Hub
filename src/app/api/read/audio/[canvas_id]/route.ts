import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { canvasSrv } from "@/lib/services/canvasservices";
import supabase from "@/lib/config/supabase";

export const POST = async (req: NextRequest, { params }: { params: { canvas_id: string } }) => {
  const { public_id, secure_url } = await req.json();

  try {
    if (!params.canvas_id) {
      return NextResponse.json({
        status: false,
        statusCode: 422,
        message: "Canvas id not invalid",
      });
    }

    const result = await canvasSrv.addAudio(params.canvas_id, {
      public_id: public_id,
      audioUrl: secure_url,
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
  const { public_id, secure_url } = await req.json();

  try {
    const canvas = await canvasSrv.getByIdCanvas(params.canvas_id);

    const result = await canvasSrv.addAudio(params.canvas_id, {
      public_id: public_id,
      audioUrl: secure_url,
    });

    if (canvas.audio.public_id) {
      const { data: fileExists } = await supabase.storage
        .from("bookarcade-audio")
        .list("", { search: canvas.audio.public_id });

      if (fileExists && fileExists.length > 0) {
        const { error } = await supabase.storage
          .from("bookarcade-audio")
          .remove([canvas.audio.public_id]);

        if (error) {
          throw error;
        }
      }
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
