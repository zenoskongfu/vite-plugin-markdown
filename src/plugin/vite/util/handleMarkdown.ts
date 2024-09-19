import { dynamicTempPath } from "../../../util/config";
import markdown2html from "../../../util/markdown2html";
import checkDirIsExist from "./checkDirIsExist";
import path from "path";
import handleFilename from "./handleFilename";
import fs from "fs";
import firstCharUpperCase from "./firstCharUpperCase";
import transformEsbuild from "../../../util/transformEsbuild";
import { OptionType } from "../../rehypeCodeBlockToReact";

const rootPath = process.cwd();
checkDirIsExist(dynamicTempPath);

const handleTagName = (tagName: string) => {
  return tagName.toLowerCase();
};

const handleCodeBlock = (
  id: string,
  addDynamicImport: (key: string, value: string) => void
) => {
  const dirname = path.dirname(id);
  let index = 1;

  return {
    supportEdit: ((code, language, options) => {
      const { isEdit = true } = options;

      if (!code.includes("export default")) {
        throw new Error("not export default");
      }
      const tagName = handleTagName("editcode");
      addDynamicImport(tagName, "@src/component/EditCode");
      return {
        tagName,
        properties: {
          code: code,
          currentPath: dirname.replace(rootPath, ""),
          isEdit: isEdit === true ? "true" : "false",
        },
      };
    }) as OptionType["handleCode"],
    displaySelf: (code: string) => {
      const mdName = handleFilename(path.basename(id));
      const filename = mdName + "demo" + index++;
      const filepath = path.resolve(dynamicTempPath, filename + ".tsx");
      fs.writeFileSync(filepath, code, "utf-8");

      const tagName = handleTagName(filename);
      addDynamicImport(tagName, filepath);
      return {
        tagName: tagName,
      };
    },
  };
};

const handleCodeSrc = (
  id: string,
  addDynamicImport: (key: string, value: string) => void
) => {
  let index = 1;
  const absolutePath = (src: string) => path.resolve(id, "../", src);

  return {
    supportEdit: (codeProperties: Record<string, string>) => {
      const { src, isSupportEdit } = codeProperties;
      if (!src || !src.startsWith(".")) throw new Error("error src path");
      const _code = fs.readFileSync(absolutePath(src), "utf-8");

      const tagName = handleTagName("editcode");
      addDynamicImport(tagName, "@src/component/EditCode");

      return {
        tagName: tagName,
        properties: {
          code: _code,
          currentPath: path.dirname(id).replace(rootPath, ""),
          isSupportEdit: isSupportEdit,
        },
      };
    },
    displaySelf: (codeProperties: Record<string, string>) => {
      const { src } = codeProperties;
      if (!src || !src.startsWith(".")) throw new Error("error src path");

      const mdName = handleFilename(path.basename(id));
      const filename = mdName + "demosrc" + index++;

      const tagName = handleTagName(filename);
      addDynamicImport(tagName, absolutePath(src));

      return {
        tagName: tagName,
      };
    },
  };
};

const switchTagName = (tagNames: string[], code: string) => {
  code = code.replace(
    new RegExp(`${tagNames.map((item) => item.toLowerCase()).join("|")}`, "g"),
    (match: string) => {
      return firstCharUpperCase(match);
    }
  );

  return code;
};

const m2h = async (code: string, id: string) => {
  const dynamicImports: Record<string, string> = {};

  const addDynamicImport = (key: string, value: string) => {
    dynamicImports[key] = value;
  };

  const htmlFile = await markdown2html(code, {
    codeBlock: {
      handleCode: handleCodeBlock(id, addDynamicImport).supportEdit,
    },
    codeSrc: {
      handleCode: handleCodeSrc(id, addDynamicImport).displaySelf,
    },
  });

  return { htmlStr: htmlFile.value, dynamicImports };
};

const handleMarkdown = async (code: string, id: string) => {
  const { htmlStr, dynamicImports } = await m2h(code, id);

  let res = `
          import React from 'react';
          ${Object.entries(dynamicImports)
            .map(([name, path]) => {
              return `import ${firstCharUpperCase(name)} from '${path}'`;
            })
            .join(";\n")}
            

          export default function(){
            return <>
              ${htmlStr}
            </>
          }
        `;

  try {
    res = (
      await transformEsbuild(switchTagName(Object.keys(dynamicImports), res))
    ).code;
  } catch (error) {
    console.error(error);
  }

  return {
    code: res,
  };
};

export default handleMarkdown;
