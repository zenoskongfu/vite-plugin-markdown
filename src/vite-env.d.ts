/// <reference types="vite/client" />

declare module "*.md";

declare module "remark-code-blocks" {}

declare module "virtual:require" {
  export default function require(module: string): any;
  export function getRequire(path: string): typeof require;
}
