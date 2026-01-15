import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath, URL } from "node:url"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      include: ["buffer", "process", "stream", "crypto"],
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  resolve: {
    alias: {
      buffer: "buffer",
      stream: "stream-browserify",
      process: "process/browser",
      crypto: "crypto-browserify",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      views: fileURLToPath(new URL("./src/views", import.meta.url)),
      features: fileURLToPath(new URL("./src/features", import.meta.url)),
      lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
      public: fileURLToPath(new URL("./public", import.meta.url)),
      shared: fileURLToPath(new URL("./src/shared", import.meta.url)),
      test: fileURLToPath(new URL("./src/test", import.meta.url)),
    },
  },
  test: {
    environment: "happy-dom",
    setupFiles: "./src/setupTests.tsx",
    globals: true,
    css: true,
    exclude: ["e2e/**", "node_modules/**", "build/**", "dist/**"],
    teardownTimeout: 1000,
    coverage: {
      reporter: ["text", "lcov"],
      exclude: ["e2e/**", "node_modules/**", "build/**", "dist/**"],
    },
  },
})
