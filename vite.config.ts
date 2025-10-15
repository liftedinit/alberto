import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath, URL } from "node:url"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://qa.liftedinit.tech",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true,
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
  resolve: {
    alias: {
      stream: "stream-browserify",
      process: "process/browser",
      "readable-stream": "readable-stream",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      views: fileURLToPath(new URL("./src/views", import.meta.url)),
      features: fileURLToPath(new URL("./src/features", import.meta.url)),
      lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
      public: fileURLToPath(new URL("./public", import.meta.url)),
      shared: fileURLToPath(new URL("./src/shared", import.meta.url)),
      test: fileURLToPath(new URL("./src/test", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["buffer", "process", "stream-browserify", "readable-stream"],
  },
})
