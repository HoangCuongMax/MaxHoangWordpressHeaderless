import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function readEnv(name: string) {
  return process.env[name]?.trim();
}

export async function GET() {
  const publicKey = readEnv("IMAGEKIT_PUBLIC_KEY");
  const privateKey = readEnv("IMAGEKIT_PRIVATE_KEY");

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      {
        error:
          "ImageKit upload credentials are not configured on this deployment."
      },
      {
        status: 500
      }
    );
  }

  return NextResponse.json(
    getUploadAuthParams({
      publicKey,
      privateKey
    })
  );
}
