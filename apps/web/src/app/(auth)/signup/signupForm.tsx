"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { signUp } from "@/lib/actions";
import React, { useActionState } from "react";

const SignUpForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  return (
    <form action={action}>
      <div className="flex flex-col gap-4">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
          />
        </div>
        {state?.error?.name && (
          <p className="text-sm text-red-500">{state.error.name}</p>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
          />
        </div>
        {state?.error?.password && (
          <div>
            <p className="text-sm text-red-500">Password must:</p>
            <ul>
              {state.error.password.map((error) => (
                <li key={error} className="text-sm text-red-500">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
        <SubmitButton>Sign Up</SubmitButton>
      </div>
    </form>
  );
};

export default SignUpForm;
