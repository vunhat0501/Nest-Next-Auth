"use server";

import { BACKEND_URL, FRONTEND_URL } from "@/lib/constants";
import { createSession, updateToken } from "@/lib/sessions";
import { FormState, SignInFormSchema, SignupFormSchema } from "@/lib/type";
import { getFieldError } from "@/lib/z-error-utils";
import { redirect } from "next/navigation";
import z from "zod";
// import { signIn as authjsSignIn } from "@/auth";
// import { AuthError } from "next-auth";
// import { InvalidEmailPasswordError } from "@/lib/errors";

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  //** Validate field input */
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const fieldErrors = getFieldError(validatedFields.error);
    // console.log(fieldErrors);
    return {
      error: fieldErrors,
      // error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
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
    return {
      message:
        response.status === 409
          ? "User already exists"
          : "An error occurred during signup",
    };
  }
}

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  //** Validate field input with zod */
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  //** If validation fails, return error messages */
  // * This will be used to show error messages in the UI */
  if (!validatedFields.success) {
    const fieldErrors = getFieldError(validatedFields.error);
    // console.log(fieldErrors);
    return {
      error: fieldErrors,
      // error: validatedFields.error.flatten().fieldErrors,
    };
  }

  //** Getting user data from backend */
  const response = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedFields.data),
  });

  //** If getting user data, redirect to home page */
  // * If not, show error message */
  if (response.ok) {
    const result = await response.json();
    await createSession({
      user: {
        id: result.id,
        name: result.name,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    redirect("/");
  } else {
    return {
      message:
        response.status === 401
          ? "Invalid email or password"
          : "Something when wrong during sign in. Please try again later.",
    };
  }
}

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      //** Use headers if refreshToken set as fromAuthHeaderAsBearerToken in backend config */
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const { accessToken, refreshToken } = await response.json();
    //** Update session with new tokens */
    // await updateToken({ accessToken, refreshToken });
    const updateRes = await fetch(`${FRONTEND_URL}/api/auth/update`, {
      method: "POST",
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });
    if (!updateRes.ok) throw new Error("Failed to update session");

    return accessToken;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
};

//**? This is signin function using authjs. might be useful in the future
// ? when the version become official and fix the custom error throwing */
// export async function signIn(
//   state: FormState,
//   formData: FormData
// ): Promise<FormState> {
//   const validationFields = SignInFormSchema.safeParse({
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   //** Validate field input to and show error in state */
//   if (!validationFields.success) {
//     return {
//       error: validationFields.error.flatten().fieldErrors,
//     };
//   }

//   //** Sign in with authjs */
//   try {
//     await authjsSignIn("credentials", {
//       email: validationFields.data.email,
//       password: validationFields.data.password,
//       redirectTo: "/",
//     });
//   } catch (error) {
//     // console.error("Sign in error:", error);
//     // console.log("Sign in error:", JSON.stringify(error));

//     //** Inside a Server Action (or a function called by a Server Action),
//     // * Next.js doesn't let the function complete normally and return a value.
//     // * Instead, it throws an internal error with a specific digest
//     // * Next.js's way of signalling to its own framework to redirect */
//     if (
//       typeof (error as any).digest === "string" &&
//       (error as any).digest.startsWith("NEXT_REDIRECT;")
//     ) {
//       throw error;
//     }

//     //** handle error returning from authjs */
//     let errorMessage = "An unexpected error occurred during sign in.";
//     if (error instanceof InvalidEmailPasswordError) {
//       errorMessage = InvalidEmailPasswordError.type;
//     }
//     return { message: errorMessage };
//   }
// }
