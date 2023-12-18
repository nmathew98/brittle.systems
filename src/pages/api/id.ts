import type { APIRoute } from "astro";
import { randomUUID } from "node:crypto";

export const COOKIE_NAME = "uuid";

export const GET: APIRoute = async ({ cookies }) => {
	const response = new Response(null, {
		status: 204,
	});
	const hasUuid = cookies.has(COOKIE_NAME);

	if (hasUuid) return response;

	cookies.set(COOKIE_NAME, randomUUID(), {
		domain: import.meta.env.PROD ? "brittle.systems" : undefined,
		httpOnly: import.meta.env.PROD,
		secure: import.meta.env.PROD,
	});

	return response;
};
