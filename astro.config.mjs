import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypePrettyCode from "rehype-pretty-code";
import react from "@astrojs/react";

const prettyCodeOptions = {
	theme: "github-dark",
};

// https://astro.build/config
export default defineConfig({
	site: "https://brittle.systems",
	image: {
		// Cloudflare does not support Astro's built in image optimization
		// see: https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service
		service: passthroughImageService(),
	},
	integrations: [
		tailwind(),
		mdx({
			optimize: {
				customComponentNames: ["img", "a"],
			},
		}),
		sitemap(),
		react(),
	],
	prefetch: true,
	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
	},
	output: "hybrid",
});
