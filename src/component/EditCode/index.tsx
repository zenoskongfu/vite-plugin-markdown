import { debounce } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import compileCode from "../MarkdownReact/complieCode";
import { execCode } from "../MarkdownReact/execCode";
import ErrorBoundary from "./ErrorBoundary";
import "./index.scss";
const EditCode = (props: { code: string; currentPath?: string }) => {
  const { code, currentPath } = props;
  // const code = atob(_code);
  // const currentPath = _currentPath && atob(_currentPath);
  // console.log("currentPath: ", _currentPath, _code);

  const [innCode, setInnerCode] = useState(code);
  const [compliedCode, setCompliedCode] = useState("");

  const [key, setKey] = useState(1);
  const [minHeight, setMinHeight] = useState("0px");
  const compoContainer = useRef<HTMLDivElement>(null);

  const complie = () => {
    try {
      const res = compileCode(innCode);
      setCompliedCode(res!);
      setKey(key + 1);
      // setCompo(execCode(res));
    } catch (error) {
      console.log("complie error");
    }
  };

  useEffect(() => {
    complie();
  }, [innCode]);

  const onChange = (e: any) => {
    console.log(e.target.value);
    setInnerCode(e.target.value);
  };

  let Compo = () => <div></div>;

  try {
    Compo = compliedCode ? execCode(compliedCode) : () => <div></div>;
  } catch (error) {
    console.log("exec error");
    Compo = () => <div></div>;
  }

  const Save = () => {
    console.log("save");
  };

  const onUpdate = (height: number) => {
    setMinHeight(height + "px");
  };

  // useEffect(() => {
  //   setMinHeight(compoContainer.current!.clientHeight + "px");
  // }, []);

  return (
    <div className="edit-code-container">
      <div className="component-container" style={{ minHeight }}>
        <ErrorBoundary key={key}>
          <Compo></Compo>
        </ErrorBoundary>
      </div>
      <textarea
        className="editor"
        defaultValue={innCode}
        onChange={debounce(onChange, 1000)}
      ></textarea>
    </div>
  );
};

export default EditCode;
