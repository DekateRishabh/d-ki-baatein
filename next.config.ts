import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zedwpykpdmkmoqpclwxu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
