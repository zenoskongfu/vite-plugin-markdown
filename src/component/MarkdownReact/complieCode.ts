import { declare } from "@babel/helper-plugin-utils";
import { transform } from "@babel/standalone";

const addReactImport = declare((api) => {
  return {
    name: "@babel/plugin-add-react-import",
    visitor: {
      Program: {
        enter(path, state) {
          let hasReact = false;

          path.traverse({
            ImportDefaultSpecifier(_path) {
              console.log("find...");
              if (_path.node.local.name == "React") {
                hasReact = true;
                console.log("find React!!");
                _path.stop();
              }
            },
          });

          console.log("end finding");

          if (!hasReact) {
            const importAst = api.template.ast(`import React from 'react'`);
            path.node.body.unshift(importAst as any);
          }
        },
      },
    },
  };
});

// Babel.transform
const compileCode = (code: string) => {
  const res = transform(code, {
    presets: [
      ["react"],
      "typescript",
      [
        "env",
        {
          modules: "commonjs",
        },
      ],
    ],
    plugins: [addReactImport],

    filename: "test.tsx",
    retainLines: true,
  });

  return res.code;
};

export default compileCode;
