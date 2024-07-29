import { NextResponse } from "next/server";

import withAuth from "./lib/middleware/withAuth";

export const mainmiddleware = async () => {
  const res = NextResponse.next();
  return res;
};

export default withAuth(mainmiddleware, ["/profil", "/login", "/register"]);
