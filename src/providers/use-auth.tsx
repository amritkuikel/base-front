import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createContext, type ReactNode, useContext } from "react";
import { getCurrentUserFn } from "@/lib/auth";
import type { User } from "@/types";

export type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const getCurrentUser = useServerFn(getCurrentUserFn);
	const {
		data: user,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["user"],
		queryFn: () => getCurrentUser(),
	});

	return (
		<AuthContext.Provider value={{ user: user ?? null, isLoading, refetch }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
}
