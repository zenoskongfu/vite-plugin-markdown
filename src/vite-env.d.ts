/// <reference types="vite/client" />

declare module "*.md";

declare module "remark-code-blocks" {}

declare module "virtual:require" {
  export function require(module: string): any;
}
