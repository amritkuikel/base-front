import { createFileRoute } from "@tanstack/react-router";
import { BugReportForm } from "@/components/forms/form/tanstack-form";

export const Route = createFileRoute("/_app/test")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<BugReportForm />
		</div>
	);
}
