import SignInForm from "@/src/app/(auth)/signin/signinForm";
import Link from "next/link";
import React from "react";

const SignInPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col justify-center items-center ">
      <h1 className="text-center text-2xl font-bold mb-4">Sign In Page</h1>
      <SignInForm />
      <div className="flex flex-col gap-4"></div>
      <div className="flex justify-between text-sm mt-1.5">
        <p>Don't have an account?</p>
        <Link className="underline ml-1" href={"/signup"}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;
