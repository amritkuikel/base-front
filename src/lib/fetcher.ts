/** biome-ignore-all lint/suspicious/noExplicitAny: <to be fixed later> */
/** biome-ignore-all lint/correctness/useHookAtTopLevel: <to be fixed later> */
import { Mutex } from "async-mutex";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";
import { getTokenFn } from "./auth";

export const baseURL = `${import.meta.env.VITE_BASE_URL}/api/v1`;

const mutex = new Mutex();

type ValidationError = {
	statusCode: number;
	path: string;
	errors: { [key: string]: string };
};

export type FetchError =
	| {
			statusCode?: number;
			message?: string;
	  }
	| ValidationError;

export const axiosInstance = axios.create({
	baseURL,
});

axiosInstance.interceptors.request.use(
	async (config) => {
		await mutex.waitForUnlock();
		const access_token = await getTokenFn();
		if (access_token && !config.headers.get("no-auth")) {
			config.headers.Authorization = `Bearer ${access_token}`;
		}
		config.headers.delete("no-auth");
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as any & {
			_retry: boolean;
		};

		if (originalRequest._retry) {
			return Promise.reject(error);
		}
		if (
			error.response?.status === 401 &&
			(error.response?.data as { message: string })?.message === "Unauthorized"
		) {
			if (!mutex.isLocked()) {
				const release = await mutex.acquire();
				try {
					originalRequest._retry = true;
					return axiosInstance(originalRequest);
				} finally {
					release();
				}
			} else {
				await mutex.waitForUnlock();
				const access_token = await getTokenFn();
				originalRequest.headers.Authorization = `Bearer ${access_token}`;
				return axiosInstance(originalRequest);
			}
		}
		return Promise.reject(error);
	},
);

export async function Fetch<T, U = unknown>(
	params: AxiosRequestConfig<U>,
): Promise<T> {
	try {
		const res = await axiosInstance({
			...params,
		});
		const successCodes = [200, 201, 204];
		if (successCodes.includes(res.status)) {
			return res.data as T;
		} else {
			throw res.data;
		}
	} catch (error) {
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw error.response.data;
			}
		}
		throw { message: "An Error Occured" } as FetchError;
	}
}
