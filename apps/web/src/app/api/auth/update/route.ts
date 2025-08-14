import { BACKEND_URL } from "@/lib/constants";
import { updateTokens } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie");
  const sessionCookie = cookieHeader
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("session="))
    ?.split("=")[1];
  if (!sessionCookie) {
    return new Response("Session cookie required", { status: 401 });
  }

  const { oldRefreshToken } = await req.json();
  // const sessionCookie = req.cookies.get("session")?.value;
  console.log("session cookie: ", sessionCookie);

  const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oldRefreshToken}`,
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to refresh token" + response.statusText);
  }

  const { accessToken, refreshToken } = await response.json();

  if (!accessToken || !refreshToken)
    return new Response("Provide Token", { status: 401 });
  await updateTokens({ accessToken, refreshToken });
  return NextResponse.json({ accessToken });
}
