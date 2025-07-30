//** https://github.com/nextauthjs/next-auth/discussions/8999#discussioncomment-8250545 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}

export class InvalidEmailPasswordError extends AuthError {
  static type = "Email or Password is invalid";
}
