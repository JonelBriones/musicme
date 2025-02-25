import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
console.log("middleware");
export async function middleware(req: NextRequest, res: NextResponse) {
  console.log("running");
  const url = req.nextUrl.clone();
  url.pathname = "/login";

  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  console.log("token", token);
  const { pathname } = req.nextUrl;

  if (pathname.includes("/api/auth") || token) {
    console.log("token is null?", token == null);
    console.log("is logged in");
    return NextResponse.next();
  }

  if (!token && pathname !== url.pathname) {
    console.log("redirect to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/:path*"],
};
