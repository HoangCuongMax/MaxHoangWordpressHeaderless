import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const pathsToRefresh = [
  "/",
  "/blog",
  "/projects",
  "/services",
  "/tools",
  "/contact"
];

export async function POST() {
  revalidateTag("notion");

  for (const path of pathsToRefresh) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString()
  });
}
