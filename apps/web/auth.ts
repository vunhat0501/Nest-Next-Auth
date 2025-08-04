import { BACKEND_URL } from "@/lib/constants";
import { InvalidEmailPasswordError } from "@/lib/errors";
import { SignInFormSchema } from "@/lib/type";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        //** validate input with zod */
        const parsedCredentials = SignInFormSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error("Invalid credentials");
          // return {
          //   error: parsedCredentials.error.flatten().fieldErrors,
          // };
        }

        //** Fetch user from backend */
        const { email, password } = parsedCredentials.data;
        const response = await fetch(`${BACKEND_URL}/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        //** handle response */
        if (!response.ok) {
          const errorData = await response.json();

          //** customized error to show different error for UI */
          // * because authjs always throw errors under the name CallbackRouteError */
          if (response.status === 401) {
            throw new InvalidEmailPasswordError();
          } else {
            throw new Error(
              errorData.message || `Backend error: ${response.status}`
            );
          }
        } else {
          const user = await response.json();
          console.log({ user });
          return user;
        }
      },
    }),
  ],
});
