import path from "path";
import firstCharUpperCase from "./firstCharUpperCase";

const handleFilename = (filename: string) => {
  filename = path.basename(filename).replace(path.extname(filename), "");
  // filename = filename.substring(0, 1).toUpperCase() + filename.substring(1);
  return firstCharUpperCase(filename.toLowerCase());
};

export default handleFilename;
