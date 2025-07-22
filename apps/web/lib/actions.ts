"use server";

import { FormState, SignupFormSchema } from "@/lib/type";
import { redirect } from "next/navigation";

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  //** Validate field input */
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });
  if (response.ok) {
    redirect("/signin");
  } else {
    message: response.status === 409
      ? "User already exists"
      : "An error occurred during signup";
  }
}
