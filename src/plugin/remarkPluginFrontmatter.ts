import grayMatter from "gray-matter";
import { visit } from "unist-util-visit";

const getFrontmatter = (code: string) => {
  return grayMatter(code);
};

const remarkPluginFrontmatter = () => {
  return (tree: import("unist").Node) => {
    visit(tree, "code", (node: any) => {
      const { value } = node;
      const { content, data } = getFrontmatter(value);

      if (Object.keys(data).length > 0) {
        // 把解析到的 frontmatter 数据存储到 code 节点的 data 属性中
        node.value = content; // 保留代码块的内容
        node.data = {
          ...node.data,
          ...data,
        };
        node.meta = data;
      }
    });
  };
};

export default remarkPluginFrontmatter;
