import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  distDir: process.env.STYBAY_TEST_BUILD
    ? ".next-waitlist-test"
    : ".next",
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default config;