import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  allowedDevOrigins: ["127.0.0.1"],
  ...(process.env.NODE_ENV === "development"
    ? {
        async rewrites() {
          return [
            {
              source: "/room/:roomCode",
              destination: "/room"
            }
          ];
        }
      }
    : {})
};

export default nextConfig;
