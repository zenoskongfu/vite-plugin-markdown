import { Plugin, transformWithEsbuild } from "vite";
import markdown2html from "../../util/markdown2html";
import transformEsbuild from "../../util/transformEsbuild";

import path from "path";
import fs from "fs";
import handleFilename from "./util/handleFilename";
import checkDirIsExist from "./util/checkDirIsExist";
import firstCharUpperCase from "./util/firstCharUpperCase";

const tempPath = path.resolve(__dirname, "../../.temp");
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

            fs.writeFileSync(filepath, code, "utf-8");
            return {
              tagName: filename,
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

            return {
              tagName: filename,
            };
          },
        },
      });

      console.log("htmlStr: ", htmlStr);

      let res = `
          import React from 'react';
          ${Object.entries(dynamicCompos)
            .map(([name, path]) => {
              return `import ${name} from '${path}'`;
            })
            .join(";\n")}
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
            console.log("match: ", match);
            return firstCharUpperCase(match);
          }
        );

        return code;
      };

      try {
        res = (
          await transformEsbuild(handleTagname(Object.keys(dynamicCompos), res))
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
