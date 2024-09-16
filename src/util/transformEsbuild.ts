import * as esbuild from "esbuild";

const transformEsbuild = (code: string, options?: Record<string, any>) => {
  return esbuild.transform(code, {
    loader: "tsx",
    format: "esm",
    ...(options || {}),
  });
};

export default transformEsbuild;
