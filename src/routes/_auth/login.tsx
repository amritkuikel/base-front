import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { LoginPage } from "@/components/pages/auth/login-page";

export const Route = createFileRoute("/_auth/login")({
	validateSearch: z.object({
		token: z.string().optional(),
	}),
	component: LoginPage,
});
