import { useSession } from "@tanstack/react-start/server";
import { env } from "@/env";
import type { User } from "@/types";

type SessionUser = {
	email: User["email"];
	token: string;
	name: User["name"];
	phone_number: User["phone_number"];
	id: User["id"];
};

export function useAppSession() {
	return useSession<SessionUser>({
		name: "app-session",
		password: env.SESSION_SECRET,
		cookie: {
			secure: false,
			sameSite: "lax",
			httpOnly: true,
		},
	});
}
