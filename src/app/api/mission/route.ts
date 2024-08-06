import { misiServices } from "@/lib/services/missionservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { user_id, mission_id, type } = await req.json();
    let result;
    const userMisi = await misiServices.getMisiUser(user_id, mission_id);
    const mission = await misiServices.getMission(mission_id);

    if (userMisi) {
      let statusMisi =
        mission?.max === userMisi?.process + 1 || userMisi.process > mission?.max ? true : false;
      result = await misiServices.updateMisiUser(
        user_id,
        mission_id,
        type,
        userMisi.process,
        statusMisi,
      );
    } else {
      result = await misiServices.addMisiUser(user_id, mission_id, type);
    }

    logger.info("Success finish mission");
    return NextResponse.json(
      { status: true, statusCode: 500, message: "Success finish mission", result },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed finish mission : " + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed finish mission", error },
      { status: 500 },
    );
  }
};
