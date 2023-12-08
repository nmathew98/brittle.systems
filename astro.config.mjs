import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  output: "server",
  adapter: cloudflare({
    mode: "directory",
    imageService: "cloudflare",
    runtime: {
      type: "pages",
      mode: "off"
    }
  })
});