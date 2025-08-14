"use server";

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/sessions";

export const getProfile = async () => {
  // const session = await getSession();
  // const response = await fetch(`${BACKEND_URL}/auth/protected`, {
  //   headers: {
  //     Authorization: `Bearer ${session?.accessToken}`,
  //   },
  // });

  const response = await authFetch(`${BACKEND_URL}/auth/protected`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch profile data.");
  // }

  const result = await response.json();
  return result;
};
