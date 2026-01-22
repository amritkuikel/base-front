import {
	createFileRoute,
	Navigate,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { AppSidebar } from "@/components/partials/app-sidebar";
import { SiteHeader } from "@/components/partials/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUserFn } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
	beforeLoad: async ({ location }) => {
		const user = await getCurrentUserFn();

		if (!user) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}

		return { user };
	},
	component: App,
});

function App() {
	const { user } = Route.useRouteContext();

	if (!user) {
		return <Navigate to="/login" search={{ redirect: "" }} />;
	}
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 62)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<Outlet />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
