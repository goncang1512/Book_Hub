import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { result } = await req.json();

  return NextResponse.json(
    {
      result: result,
    },
    { status: 201 },
  );
};
