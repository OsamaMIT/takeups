import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "server/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": "/home/hp-os/Documents/code/takeups/src"
    }
  }
});
