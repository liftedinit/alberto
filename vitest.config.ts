import { defineConfig, mergeConfig } from "vitest/config"
import viteConfig from "./vite.config"

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: "./src/setupTests.tsx",
      globals: true,
      css: true,
      exclude: ["e2e/**", "node_modules/**", "build/**", "dist/**"],
      coverage: {
        reporter: ["text", "lcov"],
        exclude: ["e2e/**", "node_modules/**", "build/**", "dist/**"],
      },
    },
  }),
)
