import require, { addImport, LOSE_IMPORT } from "../../.temp/require";
import fetchCompo from "./fetchCompo";
import pathBrowserify from "path-browserify";

export const execCode = async (code: string, currentPath: string = "") => {
  if (!code) return () => {};

  const exports = { default: null };
  while (true) {
    try {
      new Function("require", "exports", code)(require, exports);

      return exports.default as any;
    } catch (err) {
      const error = err as { type: string; path: string };
      console.log("error: ", error);
      if (error.type == LOSE_IMPORT) {
        const path = error.path;
        const compoPath = pathBrowserify.resolve(currentPath, path);
        const module = await fetchCompo(compoPath);
        console.log("fetch Compo: ", path, module);
        addImport(path, module);
      } else {
        return () => null;
      }
    }
  }
};
