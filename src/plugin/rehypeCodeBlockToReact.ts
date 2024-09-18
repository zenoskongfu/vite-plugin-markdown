import { visit } from "unist-util-visit";

type Tree = import("unist").Node;

export type OptionType = {
  handleCode: (
    code: string,
    language: string
  ) => {
    tagName: string;
    properties?: Record<string, any>;
    children?: Record<string, string>[];
  };
};

export type CodeSrcOptionType = {
  handleCode: (properties: Record<string, string>) => {
    tagName: string;
    properties?: Record<string, string>;
    children?: Record<string, string>[];
  };
};

const handleCodeBlock = (tree: Tree, options: OptionType) => {
  const {
    handleCode, // (code, language)=> tagName, properties
  } = options || {};

  // 遍历 HTML AST
  visit(tree, "element", (node: any) => {
    // 找到代码块 `<pre><code>`
    if (
      node.tagName === "pre" &&
      node.children.length > 0 &&
      node.children[0].tagName === "code"
    ) {
      const codeNode = node.children[0];
      const language =
        codeNode.properties.className?.[0]?.replace("language-", "") || "";
      const code = codeNode.children[0].value;

      try {
        const { tagName, properties, children } = handleCode(code, language);
        // 替换为自定义的 React 组件
        node.tagName = "pre";
        node.type = "element";
        node.children = [
          {
            type: "element",
            tagName: tagName,
            properties: properties || {},
            children: children
              ? children
              : [
                  {
                    type: "text",
                    value: "",
                  },
                ],
          },
        ];
      } catch (error) {
        //
      }
    }
  });
};

const handleCodeSrc = (tree: Tree, options: CodeSrcOptionType) => {
  const { handleCode } = options || {};
  visit(tree, "element", (node: any) => {
    if (node.tagName === "code" && node.properties.src) {
      try {
        const { tagName, properties, children } = handleCode(node.properties);
        // 替换为自定义的 React 组件
        node.tagName = "pre";
        node.type = "element";
        node.children = [
          {
            type: "element",
            tagName: tagName,
            properties: properties || {},
            children: children
              ? children
              : [
                  {
                    type: "text",
                    value: "",
                  },
                ],
          },
        ];
      } catch (error) {
        //
      }
    }
  });
};

function rehypeCodeBlockToReact(options: OptionType) {
  return () => (tree: Tree) => {
    handleCodeBlock(tree, options);
  };
}

function rehypeCodeSrcToReact(options: CodeSrcOptionType) {
  return () => (tree: Tree) => {
    handleCodeSrc(tree, options);
  };
}

// 自定义 rehype 插件，用来将 class 转为 className
function rehypeClassToClassName() {
  return (tree: Tree) => {
    visit(tree, "element", (node: any) => {
      if (node.properties && node.properties.class) {
        node.properties.className = node.properties.class;
        delete node.properties.class;
      }
    });
  };
}

export { rehypeCodeBlockToReact, rehypeCodeSrcToReact, rehypeClassToClassName };
