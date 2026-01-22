import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { getLocale } from "@/paraglide/runtime";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		beforeLoad: async () => {
			if (typeof document !== "undefined") {
				document.documentElement.setAttribute("lang", getLocale());
			}
		},
		head: () => ({
			meta: [
				{
					charSet: "utf-8",
				},
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					title: "Tdf-mis",
				},
			],
			links: [
				{
					rel: "stylesheet",
					href: appCss,
				},
			],
		}),
		errorComponent: () => <div>/ error</div>,
		component: RootComponent,
		notFoundComponent: () => <div>/ not found</div>,
	},
);
function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}
function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
