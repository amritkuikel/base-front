/** biome-ignore-all lint/correctness/useHookAtTopLevel: <intended> */

import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { User } from "@/types";
import { Fetch } from "./fetcher";
import { useAppSession } from "./session";

export const loginFn = createServerFn({ method: "POST" })
	.inputValidator(
		({ email, password }: { email: string; password: string }) => ({
			email,
			password,
		}),
	)
	.handler(async ({ data }) => {
		const userData = await Fetch<{ data: { token: string; user: User } }>({
			url: "/auth/login",
			method: "POST",
			data: data,
		}).then((res) => {
			return res.data;
		});

		if (!userData) {
			return { error: "Invalid credentials" };
		}

		const session = await useAppSession();
		await session.update({
			id: userData.user.id,
			email: userData.user.email,
			token: userData.token,
			name: userData.user.name,
			phone_number: userData.user.phone_number,
		});

		throw redirect({ to: "/" });
	});

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	const session = await useAppSession();
	await Fetch({
		method: "POST",
		url: "/auth/logout",
	}).then(async () => {
		await session.clear();
		throw redirect({ to: "/login" });
	});
});

const getCurrentUser = async () => {
	const session = await useAppSession();
	const userId = session.data.id;

	if (!userId) {
		return null;
	}
	const res = await Fetch<{ data: { user: User } }>({
		url: "/auth/me",
		headers: {
			Authorization: `Bearer ${session.data.token}`,
		},
	});
	return res.data.user;
};

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return await getCurrentUser();
	},
);

export const getTokenFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await useAppSession();
		return session.data.token;
	},
);
