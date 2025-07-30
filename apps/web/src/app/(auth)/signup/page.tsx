import SignUpForm from "@/src/app/(auth)/signup/signupForm";
import Link from "next/link";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col justify-center items-center ">
      <h1 className="text-center text-2xl font-bold mb-4">Sign Up Page</h1>
      <SignUpForm />
      <div className="flex justify-between text-sm mt-1.5">
        <p>Already have an account?</p>
        <Link className="underline ml-1" href={"/signin"}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
