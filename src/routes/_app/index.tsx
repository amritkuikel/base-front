import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/")({
	component: App,
});

function App() {
	return (
		<Link to="/intent-test">
			<Button>Intent Test</Button>
		</Link>
	);
}
