//** Wrapper function for fetch function

import { refreshToken } from "@/lib/auth";
import { getSession } from "@/lib/sessions";

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// * This function automatically get the tokens inside the session before fetch data from protected api */
export const authFetch = async (
  url: string | URL,
  options: FetchOptions = {}
) => {
  const session = await getSession();
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };

  let response = await fetch(url, options);
  //** If access token expired */
  if (response.status === 401) {
    if (!session?.refreshToken) throw new Error("No refresh token found");

    //** Create new access token with refresh token and start fetching */
    const newAccessToken = await refreshToken(session.refreshToken);
    if (newAccessToken) {
      options.headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(url, options);
    }
  }
  return response;
};
