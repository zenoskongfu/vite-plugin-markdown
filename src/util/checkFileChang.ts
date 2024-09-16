import fs from "fs";
import path from "path";
import crypto from "crypto";

const dynamicTempPath = path.resolve(__dirname, "../.temp");
const hashPath = path.resolve(dynamicTempPath, "./package-lock-hash.json");

const checkFileMTime = (currentPath: string, previousPath: string) => {
  let isModify = false;

  const currentMTime = fs.statSync(currentPath).mtime.getTime();
  if (!fs.existsSync(previousPath)) {
    isModify = true;
  } else {
    const previousMTime = fs.statSync(previousPath).mtime.getTime();

    if (currentMTime !== previousMTime) {
      isModify = true;
    }
  }

  return isModify;
};

const getHash = (filePath: string) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
};

const checkFileContent = (currentPath: string, previousPath: string) => {
  let isModify = false;
  let fileHash = "";
  if (fs.existsSync(hashPath)) {
    fileHash = fs.readFileSync(hashPath, "utf-8");
  }

  const currentFileHash = getHash(currentPath);
  if (fileHash !== currentFileHash) {
    isModify = true;
  }

  if (isModify) {
    fs.writeFileSync(hashPath, currentFileHash);
  }

  return isModify;
};

const checkFileChange = (currentPath: string, previousPath: string) => {
  let isModify = checkFileMTime(currentPath, previousPath);
  if (isModify) {
    return true;
  }

  isModify = checkFileContent(currentPath, previousPath);

  return isModify;
};

export default checkFileChange;
