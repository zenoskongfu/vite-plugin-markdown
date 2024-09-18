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
import EditCode from "./component/EditCode";
import FromInput from "./component/FormInput";
import DynamicCompo from "./component/DynamicCompo";

function App() {
  const [content, setContent] = useState("");
  const [compo, setCompo] = useState<any>();

  useEffect(() => {
    // getCodeblock(FoomdStr).then((res) => {
    //   console.log("code block: ", res);
    // });
  }, []);
  return (
    <div>
      {/* <DynamicCompo /> */}
      {/* <MarkdownReact code={FoomdStr} /> */}
      <Foomd />
      {/* <EditCode
        code={`
          import React from 'react';
          import {useState} from 'react';
          import * as babel from '@babel/core';

          function App(){
          const [count, setCount] = useState(0);
            return <div style={{height: '200px'}} onClick={()=>{
            setCount(count+1);
            }}>app <button>count: {count}</button></div>
          }
          
          export default App;
      `}
      /> */}
    </div>
  );
}

export default App;
