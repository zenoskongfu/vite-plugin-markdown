import require, { addImport, LOSE_IMPORT } from "../../.temp/require";
import fetchCompo from "./fetchCompo";
import pathBrowserify from "path-browserify";

export const execCode = async (code: string, currentPath: string = "") => {
  if (!code) return () => {};

  const exports = { default: null };
  // 循环请求多个组件
  while (true) {
    try {
      new Function("require", "exports", code)(require, exports);

      return exports.default as any;
    } catch (err) {
      const error = err as { type: string; path: string };
      console.log("error: ", error);
      // 一般情况是缺少组件的引用
      if (error.type == LOSE_IMPORT) {
        const path = error.path;
        const compoPath = pathBrowserify.resolve(currentPath, path);
        // 请求新的组件
        const module = await fetchCompo(compoPath);
        console.log("fetch Compo: ", path, module);
        addImport(path, module);
      } else {
        return () => null;
      }
    }
  }
};
