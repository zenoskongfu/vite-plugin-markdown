import { Plugin, transformWithEsbuild } from "vite";
import markdown2html from "../../util/markdown2html";
import transformEsbuild from "../../util/transformEsbuild";

import path from "path";
import fs from "fs";
import handleFilename from "./util/handleFilename";
import checkDirIsExist from "./util/checkDirIsExist";
import firstCharUpperCase from "./util/firstCharUpperCase";

const tempPath = path.resolve(__dirname, "../../.temp");
const rootPath = process.cwd();
checkDirIsExist(tempPath);

const markdownPlugin = function (): Plugin {
  return {
    name: "vite-plugin-markdown",
    async transform(code, id, options) {
      if (!id.endsWith(".md")) return;

      const mdName = handleFilename(id);

      let index = 0;
      const dynamicCompos = {} as any;
      const htmlStr = await markdown2html(code, {
        codeBlock: {
          handleCode: (code, language) => {
            if (!code.includes("export default")) {
              throw new Error("not export default");
            }
            const filename = mdName + "demo" + index++;
            const filepath = path.resolve(tempPath, filename + ".tsx");
            dynamicCompos[filename] = filepath;

            // dirname
            const dirname = path.dirname(id);

            fs.writeFileSync(filepath, code, "utf-8");
            return {
              tagName: "editcode",
              properties: {
                code: code,
                currentPath: dirname.replace(rootPath, ""),
              },
            };
          },
        },
        codeSrc: {
          handleCode: (codeProperties: Record<string, string>) => {
            const { src } = codeProperties;
            if (!src || !src.startsWith(".")) throw new Error("error src path");
            const absolutePath = path.resolve(id, src);

            const filename = mdName + "demo" + index++;
            dynamicCompos[filename] = absolutePath;

            const code = fs.readFileSync(absolutePath, "utf-8");
            // if(code.)

            return {
              tagName: "editcode",
              properties: {
                code,
                currentPath: path.dirname(id).replace(rootPath, ""),
              },
            };
          },
        },
      });

      const addCompo = [["editcode", "@src/component/EditCode"]];

      let res = `
          import React from 'react';
          ${Object.entries(dynamicCompos)
            .map(([name, path]) => {
              return `import ${name} from '${path}'`;
            })
            .join(";\n")}
            ${addCompo.map(
              (item) =>
                `import ${firstCharUpperCase(item[0])} from '${item[1]}'`
            )}

          export default function(){
            return <>
              ${htmlStr.value}
            </>
          }
        `;

      const handleTagname = (tagNames: string[], code: string) => {
        code = code.replace(
          new RegExp(
            `${tagNames.map((item) => item.toLowerCase()).join("|")}`,
            "g"
          ),
          (match: string) => {
            return firstCharUpperCase(match);
          }
        );

        return code;
      };

      try {
        const addCompoName = addCompo.map((item) => item[0]);
        res = (
          await transformEsbuild(
            handleTagname([...Object.keys(dynamicCompos), ...addCompoName], res)
          )
        ).code;
      } catch (error) {
        console.error(error);
      }

      console.log("transform result: ", res);

      return {
        code: res,
        map: null,
      };
    },
  };
};

export default markdownPlugin;
