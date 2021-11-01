import path from "path";
// import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
// import { terser } from "rollup-plugin-terser";
// import clear from "rollup-plugin-clear";
import cleanup from "rollup-plugin-cleanup";
import size from "rollup-plugin-sizes";
import { visualizer } from "rollup-plugin-visualizer";
// import strip from "@rollup/plugin-strip";

export default {
  input: "./src/browser/index.ts",
  output: {
    file: path.resolve("dist", "index.js"),
    format: "cjs",
  },
  plugins: [
    resolve(),
    size(),
    visualizer({
      title: `analyzer`,
      filename: "analyzer.html",
    }),
    commonjs({
      exclude: "node_modules",
    }),
    cleanup({
      comments: "none",
    }),
    typescript({
      tsconfig: "tsconfig.json",
      useTsconfigDeclarationDir: true,
      // tsconfigOverride: {
      //   compilerOptions: {
      //     declaration: isDeclaration,
      //     declarationMap: isDeclaration,
      //     declarationDir: `${packageDirDist}/packages/`, // 类型声明文件的输出目录
      //     module: "ES2015",
      //     paths,
      //   },
      // },
      include: ["*.ts+(|x)", "**/*.ts+(|x)", "../**/*.ts+(|x)"],
    }),
    // remove console.log in bundle
    // strip({
    //   include: ['**/*.(js|ts|tsx)'],
    //   functions: ['console.log']
    // })
  ],
};
