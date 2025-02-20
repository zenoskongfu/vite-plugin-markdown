let index = 0;
// 这是jsonp的方式，用于加载远程的组件
// 通过script告诉服务端，我需要什么组件，然后服务端会将组件的js代码返回给我
// js代码返回给前端后，浏览器会执行这个代码。
// 代码中会调用一个全局的回调函数，将组件的module传递给这个回调函数
const fetchCompo = (compoPath: string) => {
  return new Promise((resolve, reject) => {
    const _index = index++;
    // 服务端拿到这个组件路径，会直接返回编译之后的js代码
    // （其实我们可以直接将用户编写的代码全部交给服务端，服务端将代码保存值硬盘中，然后直接返回保存在硬盘的文件。
    // vite会对每一个发送给前端的文件都会进行编译，以及依赖的处理）
    const url = compoPath + "?callback=vitePluginCallback" + _index;
    const script = document.createElement("script");
    script.type = "module";
    script.src = url;

    // 给每一个回调函数设置一个名字，防止不同的组件的回调函数冲突
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
