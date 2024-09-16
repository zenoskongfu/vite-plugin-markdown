import { transform } from "@babel/standalone";
// Babel.transform
const compileCode = (code: string) => {
  const res = transform(code, {
    presets: [
      "react",
      "typescript",
      [
        "env",
        {
          modules: "commonjs",
        },
      ],
    ],

    filename: "test.tsx",
    retainLines: true,
  });

  return res.code;
};

export default compileCode;
