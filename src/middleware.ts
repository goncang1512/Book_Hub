import { NextRequest, NextResponse } from "next/server";

import withAuth from "./lib/middleware/withAuth";
import { getToken } from "next-auth/jwt";

export const mainmiddleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token?.status === "banned") {
    const response = NextResponse.redirect(new URL("/login", req.url).toString()); // Menggunakan URL absolut
    response.cookies.set("next-auth.session-token", "", {
      maxAge: -1,
      path: "/",
    });

    return response;
  }

  return NextResponse.next();
};

export default withAuth(mainmiddleware, ["/profil", "/login", "/register"]);
