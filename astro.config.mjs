import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://brittle.systems",
  integrations: [tailwind(), mdx({
    optimize: true
  }), sitemap()],
  prefetch: true,
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