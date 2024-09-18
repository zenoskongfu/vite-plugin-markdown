import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    vitePluginCallback: (module: any) => void;
  }
}

const getCompo = () => {
  return new Promise((resolve, reject) => {
    const url = "/src/component/Foo/index.tsx?callback=vitePluginCallback";
    const script = document.createElement("script");
    script.type = "module";
    script.src = url;

    window.vitePluginCallback = (module: any) => {
      console.log("module", module);
      resolve(module);
    };
    script.onload = () => {
      // resolve
    };
    script.onerror = () => {
      console.error("script load error");
      reject(null);
    };

    document.head.appendChild(script);
  });
};

const DynamicCompo = () => {
  const [Compo, setCompo] = useState(() => () => null);

  useEffect(() => {
    setCompo(React.lazy(getCompo));
  }, []);

  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <Compo />
    </React.Suspense>
  );
};

export default DynamicCompo;
