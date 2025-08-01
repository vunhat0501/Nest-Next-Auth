import { getSession } from "@/lib/sessions";
import Link from "next/link";
import React from "react";

const SignInButton = async () => {
  const session = await getSession();
  return (
    //** If session is not exists = user isn't authenticated render sign in/sign up
    // * else show user name and sign out */
    <div className="flex items-center gap-4 ml-auto">
      {!session || !session.user ? (
        <>
          <Link href={"/signin"}>Sign In</Link>
          <Link href={"/signup"}>Sign Up</Link>
        </>
      ) : (
        <>
          <p>{session.user.name}</p>
          <Link href={"/api/auth/signout"}>Sign Out</Link>
        </>
      )}
    </div>
  );
};

export default SignInButton;
