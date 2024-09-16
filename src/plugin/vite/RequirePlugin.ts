import path from "path";
import { Plugin } from "vite";
import checkFileChange from "../../util/checkFileChang";
import generateRequire from "../../util/generateRequire";
import fs from "fs";
import { dynamicTempPath } from "../../util/config";

const virtualRequire = "virtual:require";
const virtualRequireModuleId = "\0" + virtualRequire;

const RequirePlugin = (): Plugin => {
  return {
    name: "vite-plugin-markdown",
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
        generateRequire();
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
  };
};

export default RequirePlugin;
