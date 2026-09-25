import { defineConfig } from "vitest/config";
<<<<<<< HEAD
=======
import path from "node:path";
>>>>>>> fa95b3b (Add code by Quan)

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
<<<<<<< HEAD
=======
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
>>>>>>> fa95b3b (Add code by Quan)
});