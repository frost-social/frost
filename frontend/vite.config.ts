import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import reactSwc from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite(),
    command === "serve"
      ? reactSwc() // 開発時はSWCプラグインを使用
      : react({
          // ビルド時は標準のReactプラグイン+React Compilerを使用
          babel: {
            plugins: ["babel-plugin-react-compiler"],
          },
        }),
  ],
  server: {
    host: true,
  },
}));
