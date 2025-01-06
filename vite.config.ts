import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
  root: "src/assets",
  base: "./",
  build: {
    outDir: "../../dist/assets",
    minify: true,
    assetsDir: ".",
    emptyOutDir: true,
  },
  plugins: [ViteMinifyPlugin({})],
});
