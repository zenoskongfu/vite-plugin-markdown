let index = 0;
const fetchCompo = (compoPath: string) => {
  return new Promise((resolve, reject) => {
    const _index = index++;
    const url = compoPath + "?callback=vitePluginCallback" + _index;
    const script = document.createElement("script");
    script.type = "module";
    script.src = url;

    window["vitePluginCallback" + _index] = (module: any) => {
      console.log("module", module);
      resolve(module);
    };

    script.onload = () => {
      // resolve
      console.log("load success: ", compoPath);
      window["vitePluginCallback" + _index] = null;
    };

    script.onerror = () => {
      console.error("script load error", compoPath);
      reject(null);
    };

    document.head.appendChild(script);
  });
};

export default fetchCompo;
