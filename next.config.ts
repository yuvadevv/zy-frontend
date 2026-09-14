import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_PORT ? `.next-${process.env.NEXT_PORT}` : '.next',
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
