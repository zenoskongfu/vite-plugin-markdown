import { Plugin } from "vite";
import handleMarkdown from "./util/handleMarkdown";

const markdownPlugin = function (): Plugin {
  return {
    name: "vite-plugin-markdown",
    async transform(code, id, options) {
      if (!id.endsWith(".md")) return;

      const { code: _code } = await handleMarkdown(code, id);
      return {
        code: _code,
      };
    },
  };
};

export default markdownPlugin;
