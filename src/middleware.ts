import { NextResponse } from "next/server";

import withAuth from "./lib/middleware/withAuth";

export const mainmiddleware = async () => {
  return NextResponse.next();
};

export default withAuth(mainmiddleware, ["/profil", "/login", "/register"]);
