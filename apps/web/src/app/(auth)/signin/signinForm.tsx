"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useActionState } from "react";
import SubmitButton from "@/components/ui/submitButton";
import Link from "next/link";
import { signIn } from "@/lib/auth";

const SignInForm = () => {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form className="w-full" action={action}>
      <div className="flex flex-col gap-4">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
          />
        </div>
        {state?.error?.email && (
          <p className="text-sm text-red-500">{state.error.email}</p>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password"</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
          />
        </div>
        {state?.error?.password && (
          <p className="text-sm text-red-500">{state.error.password}</p>
        )}
        <Link className="text-sm underline" href="#">
          Forgot your password?
        </Link>
        <SubmitButton>Sign In</SubmitButton>
      </div>
    </form>
  );
};

export default SignInForm;
