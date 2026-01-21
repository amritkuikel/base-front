// Import the generated route tree
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "render",
		scrollRestoration: true,
		defaultErrorComponent: () => <div>error</div>,
		defaultPendingComponent: () => <div>loading</div>,
		defaultNotFoundComponent: () => <div>not found</div>,
	});

	setupRouterSsrQueryIntegration({ router, queryClient });

	return router;
};
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
