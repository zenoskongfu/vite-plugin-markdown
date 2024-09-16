import React, { useEffect, useState } from "react";
import "./App.css";
import Readme from "../README.md?raw";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeStringify from "rehype-stringify";
import MarkdownReact from "./component/MarkdownReact";
import getCodeblock from "./util/getCodeblock";
import FoomdStr from "./docs/Foo.md?raw";
import Foomd from "./docs/Foo.md";

import markdown2html from "./util/markdown2html";

function App() {
  const [content, setContent] = useState("");
  const [compo, setCompo] = useState<any>();

  useEffect(() => {
    // console.log(Readme);
    // let res = "";

    // const tempHandle = remark().use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw);

    // const _compo = tempHandle.use(rehypeReact, production).processSync(Readme);

    // const _content = remark()
    // 	.use(remarkRehype, { allowDangerousHtml: true })
    // 	.use(rehypeRaw)
    // 	.use(rehypeStringify)
    // 	.processSync(Readme);

    // setContent(_content.value);
    // setCompo(_compo.result);

    getCodeblock(FoomdStr).then((res) => {
      console.log("code block: ", res);
    });

    // markdown2html(FoomdStr).then((res) => {
    //   console.log(res.value);
    // });
  }, []);
  return (
    <div>
      <MarkdownReact code={FoomdStr} />
      <Foomd />
    </div>
  );
}

export default App;
