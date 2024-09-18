import React, { useEffect, useState } from "react";
import { execCode } from "../util/execCode";

declare global {
  interface Window {
    vitePluginCallback: (module: any) => void;
  }
}

const generateCompo = (code: string, currentPath: string) => {
  return new Promise((resolve, reject) => {
    execCode(code, currentPath)
      .then((res) => {
        resolve({ default: res });
      })
      .catch(() => {
        reject(null);
      });
  });
};

type Props = {
  compiledCode: string;
  currentPath: string;
};

const DynamicCompo = (props: Props) => {
  const [Compo, setCompo] = useState(() => () => null);

  useEffect(() => {
    setCompo(
      React.lazy(() => generateCompo(props.compiledCode, props.currentPath))
    );
  }, []);

  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <Compo />
    </React.Suspense>
  );
};

export default DynamicCompo;
