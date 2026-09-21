import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["192.168.*.*", "*.ngrok-free.app", "*.ngrok.io"],
};

export default nextConfig;
