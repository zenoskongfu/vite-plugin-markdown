import * as prod from "react/jsx-runtime";
import React from "react";
import rehypeReact from "rehype-react";

const _Rehypereact = () => {
  const production = {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    createElement: React.createElement,
  };

  return [rehypeReact, production as any];
};

export default _Rehypereact;
