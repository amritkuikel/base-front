import { getCurrentUserFn } from "@/lib/auth";
import {
	createFileRoute,
	Navigate,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { z } from "zod";

const authSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth")({
	validateSearch: authSearchSchema,
	beforeLoad: async ({ location }) => {
		const user = await getCurrentUserFn();

		if (user) {
			throw redirect({
				to: "/",
				search: { redirect: location.href },
			});
		}

		return { user };
	},
	component: Auth,
});

function Auth() {
	const { user } = Route.useRouteContext();
	const search = Route.useSearch();

	if (user) {
		return <Navigate to={search.redirect || "/"} />;
	}

	return (
		<div className="w-full min-h-screen flex justify-center items-center">
			<Outlet />
		</div>
	);
}
