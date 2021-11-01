import babel from "rollup-plugin-babel";

export default {
  input: "src/browser/index.ts",
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
      extensions: ["ts"],
    }),
  ],
};
