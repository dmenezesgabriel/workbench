// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, "src/main.js"),
        worker: resolve(__dirname, "src/workers/multiply.worker.js"),
      },
      name: "WorkerLib",
      fileName: "[name]",
    },
  },
});
