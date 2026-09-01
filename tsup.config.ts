import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/lib/core/index.ts",
    "pdf/index": "src/lib/core/pdf/index.ts",
    "image/index": "src/lib/core/image/index.ts",
  },
  tsconfig: "tsconfig.lib.json",
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  target: "es2020",
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".cjs",
    };
  },
});
