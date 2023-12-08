import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://brittle.systems",
	image: {
		// Cloudflare does not support Astro's built in image optimization
		// see: https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service
		service: passthroughImageService()
	},
	integrations: [
		tailwind(),
		mdx({
			optimize: true,
		}),
		sitemap(),
	],
	prefetch: true,
	markdown: {
		shikiConfig: {
			theme: "github-dark",
			wrap: true,
		},
	},
	output: "server",
	adapter: cloudflare({
		mode: "directory",
		imageService: "cloudflare",
		runtime: {
			type: "pages",
			mode: "off",
		},
	}),
});
