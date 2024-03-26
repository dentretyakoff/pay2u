import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: "/src/components",
      pages: "/src/pages",
      store: "/src/store",
      shared: "/src/shared",
      widgets: "/src/widgets",
      models: "/src/models",
      app: "/src/app",
      providers: "/src/providers",
      services: "/src/services",
    },
  },
});
