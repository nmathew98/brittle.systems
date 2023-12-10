const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			animation: {
				"ping-logo":
					"ping-logo 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			keyframes: {
				"ping-logo": {
					"75%, 100%": {
						transform: "scale(1.1)",
						opacity: "0",
					},
				},
			},
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				mono: ["Monaspace", ...defaultTheme.fontFamily.mono],
				serif: ["EB Garamond", ...defaultTheme.fontFamily.serif],
			},
			typography: theme => ({
				// Reference
				// https://github.com/tailwindlabs/tailwindcss-typography/blob/a86e6015694c3435ff6cef84f3dd61b81adf26e1/src/styles.js#L1048
				slate: {
					css: {
						"--tw-prose-invert-body": theme("colors.orange.50"),
						"--tw-prose-invert-headings":
							theme("colors.orange.500"),
						"--tw-prose-invert-links": theme("colors.orange.500"),
						"--tw-prose-invert-bold": theme("colors.orange.500"),
					},
				},
			}),
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
