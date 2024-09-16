import path from "path";
import packageJson from "../../package.json";
import fs from "fs";
import { dynamicTempPath } from "./config";
const handlePackageName = (name: string) => {
  return "_" + name.replace(/(-|\/|@)/g, "_");
};
const generateRequire = () => {
  try {
    const { dependencies } = packageJson;
    const dependenciesKeys = Object.keys(dependencies).filter(
      (item) => !item.startsWith("@types") || !(item == "esbuild")
    );

    const importStr = dependenciesKeys
      .map((item) => {
        return `const ${handlePackageName(item)} = await import('${item}');`;
      })
      .join("\n");

    const requireStr = `
    function require(module){
      switch(module){
          ${dependenciesKeys
            .map((item) => {
              return `case '${item}':
            return ${handlePackageName(item)};`;
            })
            .join("\n")}
          default:
            return {}
        }
    }

    export default require;
    `;

    console.log(importStr, requireStr);

    const fileCode = `${importStr}

  ${requireStr}
  `;

    fs.writeFileSync(
      path.resolve(dynamicTempPath, "./require.ts"),
      fileCode,
      "utf-8"
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default generateRequire;
