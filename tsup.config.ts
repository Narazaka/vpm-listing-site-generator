import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/(bin|lib)/**/!(*.d|*.test).ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  bundle: false,
  esbuildPlugins: [],
  target: "node16",
});
