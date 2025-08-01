"use server";

import { deleteSession } from "@/lib/sessions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await deleteSession();

  revalidatePath("/");
  return NextResponse.redirect(new URL("/", req.nextUrl));
}
