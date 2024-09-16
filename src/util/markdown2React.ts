import rehypePrism from "rehype-prism";
import rehypeRaw from "rehype-raw";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import _Rehypereact from "./_Rehypereact";

const markdown2React = (markdown: string) => {
  return remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrism, { plugins: ["line-numbers"] })
    .use(..._Rehypereact())
    .process(markdown);
};

export default markdown2React;
