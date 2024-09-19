import { debounce } from "lodash-es";
import { useEffect, useState } from "react";
import DynamicCompo from "../DynamicCompo";
import compileCode from "../MarkdownReact/complieCode";
import ErrorBoundary from "./ErrorBoundary";
import "./index.scss";

const EditCode = (props: {
  code: string;
  currentPath?: string;
  isEdit: boolean;
}) => {
  const { code, currentPath, isEdit = "true" } = props;

  const [innCode, setInnerCode] = useState(code);
  const [compliedCode, setCompliedCode] = useState("");

  const [key, setKey] = useState(1);

  const compile = () => {
    try {
      const res = compileCode(innCode);
      setCompliedCode(res!);
      setKey(key + 1);
    } catch (error) {
      console.log("complie error");
    }
  };

  useEffect(() => {
    compile();
  }, [innCode]);

  const onChange = (e: any) => {
    setInnerCode(e.target.value);
  };

  return (
    <div className="edit-code-container">
      <div className="component-container">
        <ErrorBoundary key={key}>
          <DynamicCompo compiledCode={compliedCode} currentPath={currentPath} />
        </ErrorBoundary>
      </div>
      {isEdit == "true" && (
        <textarea
          className="editor"
          defaultValue={innCode}
          onChange={debounce(onChange, 1000)}
        ></textarea>
      )}
    </div>
  );
};

export default EditCode;
