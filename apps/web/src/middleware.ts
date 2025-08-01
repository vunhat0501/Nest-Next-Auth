import { getSession } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPath = ["/signin", "/signup"];
  const isPublicPath = publicPath.includes(path);
  const session = await getSession();

  if (isPublicPath && session) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/signup", "/dashboard", "/profile"],
};
