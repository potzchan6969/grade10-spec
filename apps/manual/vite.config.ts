import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { manualStorePlugin } from "./src/store/vite-plugin.mts";

/**
 * The three libraries that dwarf the app: the framework, the markdown pipeline
 * behind every prose block, and the search engine behind ⌘K. Each takes its own
 * chunk, with the tree it pulls, so an edit to the manual ships without
 * re-sending any of them — and no single chunk trips the size reporter.
 * Order is precedence: the framework claims React before markdown asks for it.
 */
const VENDOR_CHUNKS = [
  { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
  { name: "router", test: /node_modules[\\/]react-router[\\/]/ },
  {
    name: "markdown",
    test: /node_modules[\\/](react-markdown|remark-gfm)[\\/]/,
  },
  { name: "search", test: /node_modules[\\/]minisearch[\\/]/ },
];

export default defineConfig({
  plugins: [react(), tailwindcss(), manualStorePlugin()],
  // Fixed port so links into the manual are stable; 6006/6010 are the workbenches.
  server: { port: 6017, strictPort: true },
  preview: { port: 6017, strictPort: true },
  build: {
    rolldownOptions: { output: { codeSplitting: { groups: VENDOR_CHUNKS } } },
  },
});
