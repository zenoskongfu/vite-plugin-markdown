import { useEffect, useState } from "react";
import "./App.css";
import Foomd from "./docs/Foo.md";
import DynamicCompo from "./component/DynamicCompo";

function App() {
  return (
    <div>
      <DynamicCompo />
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
