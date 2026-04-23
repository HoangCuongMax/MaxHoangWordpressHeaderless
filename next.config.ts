import type { NextConfig } from "next";

function getImageKitRemotePattern() {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!endpoint) {
    return undefined;
  }

  try {
    const url = new URL(endpoint);

    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname
    };
  } catch {
    return undefined;
  }
}

const imageKitRemotePattern = getImageKitRemotePattern();

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io"
      },
      ...(imageKitRemotePattern ? [imageKitRemotePattern] : [])
    ]
  }
};

export default nextConfig;
