/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <to be fixed later> */

import { createContext, useContext, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { Fetch } from "@/lib/fetcher";
import type { User } from "@/types";

interface AuthContext {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
	setUser: (user: User) => void;
	setJwt: (token: string) => void;
	logout: () => void;
	roles: string[];
	permissions: string[];
}

const AuthContext = createContext<AuthContext>({
	isAuthenticated: false,
	user: null,
	loading: true,
	setUser: () => {},
	setJwt: () => {},
	logout: () => {},
	roles: [],
	permissions: [],
});
const cookies = new Cookies();
const cookieOptions = {
	path: "/",
	expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
	maxAge: 60 * 60 * 24 * 7,
};

export const setJwt = (token: string) => {
	cookies.remove("access_token");
	cookies.set("access_token", token, cookieOptions);
};

export const setLangauge = (language: string) => {
	cookies.remove("language");
	cookies.set("language", language, cookieOptions);
};

export const getLangauge = () => {
	return cookies.get("language");
};

export const getJwt = () => {
	return cookies.get("access_token");
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [roles, setRoles] = useState<string[]>([]);
	const [permissions, setPermissions] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [access_token, setAccessToken] = useState<string | null>(null);
	const logout = () => {
		Fetch({
			url: "/auth/logout",
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		})
			.then(() => {
				cookies.remove("access_token");
				cookies.remove("refresh_token");
				setAccessToken(null);
				setUser(null);
			})
			.catch(() => {
				cookies.remove("access_token");
				cookies.remove("refresh_token");
				setAccessToken(null);
				setUser(null);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const setTokens = (token: string) => {
		setJwt(token);
		setAccessToken(token);
	};

	useEffect(() => {
		const access_token = getJwt();
		if (access_token) {
			setAccessToken(access_token);
		} else {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		Fetch<{ data: { user: User } }>({
			url: "/auth/me",
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		})
			.then((user: { data: { user: User } }) => {
				if (user.data.user) {
					const roles: string[] = [];
					const permissions: string[] = [];
					user.data.user.roles.map((role: string) => roles.push(role));
					user.data.user.permissions.map((permission: string) =>
						permissions.push(permission),
					);
					setRoles(roles);
					setPermissions(user.data.user.permissions);
					setUser(user.data.user);
				} else {
					logout();
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, [access_token]);
	const isAuthenticated = !!user;
	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				setUser,
				loading,
				setJwt: setTokens,
				logout,
				roles,
				permissions,
			}}
		>
			{loading ? (
				<div className="w-full min-h-screen flex justify-center items-center">
					loading...
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
