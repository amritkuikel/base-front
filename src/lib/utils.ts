import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type PostType = {
	id: string;
	name: string;
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const fetchPosts = createServerFn({ method: "GET" }).handler(
	async () => {
		return axios
			.get<{ data: PostType[] }>(
				"https://appraisaldemoapi.futurecodes.com.np/api/v1/get-all-provinces?pagination=false",
			)
			.then((r) => r.data.data);
	},
);

export const postsQueryOptions = () =>
	queryOptions({
		queryKey: ["posts"],
		queryFn: () => fetchPosts(),
	});
