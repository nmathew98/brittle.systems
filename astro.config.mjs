import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx({
    optimize: true
  })],
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