import type { APIRoute } from "astro";
import { COOKIE_NAME } from "./id";
import { createStorage as createUnstorage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";

export const GET: APIRoute = async ({ cookies }) => {
	const hasUuid = cookies.has(COOKIE_NAME);

	if (!hasUuid) {
		return new Response(null, {
			status: 400,
		});
	}

	const { value: uuid } = cookies.get(COOKIE_NAME);

	if (!uuid)
		return new Response(null, {
			status: 400,
		});

	const scroll = await retrieveFromStorage(uuid);

	return new Response(JSON.stringify(scroll), {
		headers: new Headers({
			"Content-Type": "application/json",
		}),
	});
};

export const PUT: APIRoute = async ({ cookies, request }) => {
	const hasUuid = cookies.has(COOKIE_NAME);

	if (!hasUuid) {
		return new Response(null, {
			status: 400,
		});
	}

	const { value: uuid } = cookies.get(COOKIE_NAME);

	const body = await request.text();

	setInStorage(uuid, body);

	return new Response(null, {
		status: 204,
	});
};

const createStorage = () => {
	if (import.meta.env.PROD) {
		return createUnstorage({
			driver: cloudflareKVBindingDriver({ binding: "STORAGE" }),
		});
	}

	return createUnstorage();
};

const STORAGE = createStorage();

const setInStorage = (key: string, value: any) => {
	STORAGE.setItem(key, JSON.stringify(value));
};

const retrieveFromStorage = async (key: string) => {
	const value = await STORAGE.getItem<string>(key);

	return JSON.parse(value) as Record<string, any>;
};
