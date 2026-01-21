import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { postsQueryOptions } from "@/lib/utils";

export const Route = createFileRoute("/intent-test")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(postsQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { data: posts } = useSuspenseQuery(postsQueryOptions());
	return (
		<div className="flex flex-col gap-2">
			{" "}
			{posts.map((post) => (
				<div key={post.id}>
					<Button>{post.name}</Button>
				</div>
			))}
		</div>
	);
}
