import require, {getRequire} from "virtual:require";

export const execCode = (code: string, currentPath: string = '') => {
  if (!code) return () => {};

  const exports = { default: null };
  try {
    new Function("require", "exports", code)(getRequire(currentPath), exports);

    return exports.default as any;
  } catch (error) {
    return () => null;
  }
};
