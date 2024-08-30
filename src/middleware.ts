import { NextRequest, NextResponse } from "next/server";

import withAuth from "./lib/middleware/withAuth";
import { getToken } from "next-auth/jwt";

export const mainmiddleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const currentPath = req.nextUrl.pathname;

  if (token?.status === "banned") {
    if (currentPath !== "/login") {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      const response = NextResponse.redirect(loginUrl);

      response.cookies.delete("next-auth.session-token");

      return response;
    }
  }

  return NextResponse.next();
};

export default withAuth(mainmiddleware, ["/profil", "/login", "/register"]);
