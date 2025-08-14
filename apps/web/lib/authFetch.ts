import { FRONTEND_URL } from "@/lib/constants";
import { deleteSession, getSession } from "@/lib/sessions";
import { cookies } from "next/headers";

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// * This function automatically get the tokens inside the session before fetch data from protected api */
export const authFetch = async (
  url: string | URL,
  options: FetchOptions = {}
) => {
  const session = await getSession();
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
    ...(sessionCookie &&
      url.toString().startsWith(FRONTEND_URL) && {
        Cookie: `session=${sessionCookie}`,
      }),
    credentials: "included" as RequestCredentials,
  };

  let response = await fetch(url, options);
  //** If access token expired */
  if (response.status === 401) {
    if (!session?.refreshToken) throw new Error("No refresh token found");

    //** Create new access token with refresh token and start fetching */
    const tokenResponse = await fetch(`${FRONTEND_URL}/api/auth/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessionCookie && { Cookie: `session=${sessionCookie}` }),
      },
      body: JSON.stringify({
        oldRefreshToken: session.refreshToken,
      }),
      credentials: "include",
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to refresh token" + tokenResponse.statusText);
    }

    const { accessToken } = await tokenResponse.json();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    response = await fetch(url, options);
  }
  return response;
};
