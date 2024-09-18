import { useEffect, useState } from "react";
import "./index.scss";
import "../../util/prim-theme";
import compileCode from "./complieCode";
import { execCode } from "./execCode";

const MarkdownReact = (props: { code: string }) => {
  const [compo, setCompo] = useState<React.ReactElement>(<></>);
  const [code, setCode] = useState("");

  const complie = async () => {
    const code = compileCode(`
      import React from 'react';
      import {useState} from 'react';
      import * as babel from '@babel/core';

       function App(){
      const [count, setCount] = useState(0);
        return <div onClick={()=>{
        setCount(count+1);
        }}>app <button>count: {count}</button></div>
      }
        export default App;

      `);

    setCode(code);
    console.log("code: ", code);
  };

  useEffect(() => {
    complie();
  }, []);

  const Compo = code ? execCode(code) : () => <div></div>;

  return (
    <div className="remark-react-container">
      <Compo />
    </div>
  );
};

export default MarkdownReact;
