import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/components/pages/shared/1-dashboard";

export const Route = createFileRoute("/_app/")({
	ssr: false,
	component: App,
});

function App() {
	return <ClientOnly> <DashboardPage /> </ClientOnly>;
}
