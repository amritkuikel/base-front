import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ParaglideLocaleSwitcher from "@/components/shared/locale-switcher";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
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
			<ParaglideLocaleSwitcher />
			<div className="flex flex-col gap-2">
				<span>{env.VITE_APP_ENV}</span>
				<span>{env.VITE_BASE_URL}</span>
				<span>{env.VITE_APP_TITLE}</span>
			</div>
			{posts.map((post) => (
				<div key={post.id}>
					<Button>{post.name}</Button>
				</div>
			))}
		</div>
	);
}
