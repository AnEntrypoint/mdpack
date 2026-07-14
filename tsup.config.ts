import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "bin/mdpix.ts"],
  format: ["esm"],
  dts: true,
  outDir: "dist",
  splitting: false,
  sourcemap: false,
  clean: true,
  target: "node18",
});
