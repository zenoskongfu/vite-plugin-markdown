import rehypePrism from "rehype-prism";
import rehypeRaw from "rehype-raw";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import {
  CodeSrcOptionType,
  OptionType,
  rehypeClassToClassName,
  rehypeCodeBlockToReact,
  rehypeCodeSrcToReact,
} from "../plugin/rehypeCodeBlockToReact";
import _Rehypereact from "./_Rehypereact";

const markdown2html = (
  markdown: string,
  code2ReactOptions: {
    codeBlock: OptionType;
    codeSrc: CodeSrcOptionType;
  }
) => {
  const { codeBlock, codeSrc } = code2ReactOptions;
  return remark()
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeRaw)
    .use(rehypePrism, { plugins: ["line-numbers"] })
    .use(rehypeCodeBlockToReact(codeBlock))
    .use(rehypeCodeSrcToReact(codeSrc))
    .use(rehypeClassToClassName)
    .use(rehypeStringify, {
      allowDangerousHtml: true,
      allowDangerousCharacters: true,
      closeSelfClosing: true,
      upperDoctype: true,
    })

    .process(markdown);
};

export default markdown2html;


