import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

const onlyDeveloperPage = ["/profil/dasboard/inbox", "/profil/dasboard/toko"];
const authPage = ["/login", "/register"];
const originUrl: string[] = [
  `${process.env.NEXT_PUBLIC_API_URL}`,
  "book-k91lfyxgn-samuderanstgmailcoms-projects.vercel.app",
];

export default function withAuth(middleware: NextMiddleware, requireAuth: string[] = []) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    const origin = req.nextUrl.origin;
    const headersList = headers();

    if (pathname.startsWith("/api") && !pathname.startsWith("/api/job")) {
      const apiKey = headersList.get("x-api-key");

      if (!originUrl.includes(origin)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const response = NextResponse.next();
      response.headers.set("Access-Control-Allow-Origin", origin || "");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      );
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      if (req.method === "OPTIONS") {
        return response;
      }

      if (!pathname.startsWith("/api/auth")) {
        if ((apiKey && apiKey) !== process.env.NEXT_PUBLIC_API_KEY_URL) {
          return NextResponse.json(
            {
              error: "Access denied",
              message:
                "The provided API key is incorrect or expired. Please provide a valid API key.",
              statusCode: 403,
            },
            { status: 403 },
          );
        }
      }

      return response;
    }

    if (pathname.startsWith("/user")) {
      const usernameInUrl = pathname.split("@")[1];
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (token?.username === usernameInUrl) {
        return NextResponse.redirect(new URL("/profil", req.url));
      }
    }

    const startsWithRequireAuth = requireAuth.some((route) => pathname.startsWith(route));
    if (startsWithRequireAuth) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token && !authPage.includes(pathname)) {
        const url = new URL("/login", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));
        return NextResponse.redirect(url);
      }

      if (token) {
        if (authPage.includes(pathname)) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        if (token.role !== "Developer" && onlyDeveloperPage.includes(pathname)) {
          return NextResponse.redirect(new URL("/profil", req.url));
        }

        if (
          token.role !== "Developer" &&
          token.role !== "Author" &&
          pathname.startsWith("/profil/author")
        ) {
          return NextResponse.redirect(new URL("/profil", req.url));
        }
      }
    }

    return middleware(req, next);
  };
}
