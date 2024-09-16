import require from "virtual:require";
const React = await import("react");
export const execCode = (code: string) => {
  if (!code) return () => {};

  // const require = (module: string) => {
  //   if (module == "react") {
  //     return React;
  //   }
  // };

  const exports = { default: null };

  new Function("require", "exports", code)(require, exports);

  return exports.default as any;
};
