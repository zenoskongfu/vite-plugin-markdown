import path from "path";
import { Plugin } from "vite";
import checkFileChange from "../../util/checkFileChang";
import generateRequire from "../../util/generateRequire";
import fs from "fs";
import { dynamicTempPath } from "../../util/config";
import GetExport from "../GetExport";

const virtualRequire = "virtual:require";
const virtualRequireModuleId = "\0" + virtualRequire;

const parseUrl = (url: string) => {
  const _url = url.split("?");
  if (_url.length < 2) {
    return {
      url,
      params: {},
    };
  }
  return {
    url: _url[1],
    params: Object.fromEntries(
      _url[1].split("&").map((item) => item.split("=")) as any
    ),
  };
};

const RequirePlugin = (): Plugin => {
  return {
    name: "vite-plugin-require",
    buildStart() {
      const packageLockJsonPath = path.resolve(
        __dirname,
        "../../../package.json"
      );
      const isModify = checkFileChange(
        packageLockJsonPath,
        packageLockJsonPath
      );
      if (isModify) {
        // generateRequire();
      }
    },
    resolveId(id) {
      if (id === virtualRequire) {
        return virtualRequireModuleId;
      }
    },
    load(id) {
      if (id === virtualRequireModuleId) {
        return fs.readFileSync(
          path.resolve(dynamicTempPath, "./require.ts"),
          "utf-8"
        );
      }
    },
    transform(code, id) {
      if (id.includes("callback")) {
        // try {
        const newUrl = parseUrl(id);
        if (newUrl.params.callback) {
          const callbackName = newUrl.params.callback;
          const { code: _code, exportStr } = GetExport(code);

          code =
            _code +
            `
            ${callbackName}(${exportStr});
            `;

          return { code };
        }
        // } catch (error) {
        //   //
        //   console.error(error);
        // }
      }
    },
  };
};

export default RequirePlugin;
