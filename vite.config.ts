import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import markdownPlugin from "./src/plugin/vite/markdownPlugin";
import RequirePlugin from "./src/plugin/vite/RequirePlugin";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), markdownPlugin(), RequirePlugin()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },
});
