"use client";

import { Button } from "@/components/ui/button";
import React, { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

const submitButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus();
  return (
    <div>
      <Button type="submit" aria-disabled={pending} className="w-full mt-2">
        {pending ? "Submitting..." : children}
      </Button>
    </div>
  );
};

export default submitButton;
