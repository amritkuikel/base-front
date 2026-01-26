/** biome-ignore-all lint/correctness/useHookAtTopLevel: <to be fixed later> */

import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logoutFn } from "@/lib/auth";
import { m } from "@/paraglide/messages";
import ParaglideLocaleSwitcher from "../shared/locale-switcher";
import { Button } from "../ui/button";

export function SiteHeader() {
	const router = useRouter();
	const canGoBack = useCanGoBack();
	const logout = useServerFn(logoutFn);

	const handleLogout = async () => {
		await logout();
	};

	return (
		<header className="flex  bg-secondary h-(--header-height) sticky top-0 z-10 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center  gap-1 px-4 lg:gap-2 lg:px-6 ">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>

				<h1 className="text-base font-medium hidden md:block">
					{m.dashboard()}
				</h1>
				<div className="flex items-center gap-1 pr-4 cursor-pointer">
					<Button
						onClick={() => router.history.back()}
						variant="outline"
						disabled={!canGoBack}
					>
						<ArrowLeft />
					</Button>
					<Button onClick={() => router.history.forward()} variant="outline">
						<ArrowRight />
					</Button>
				</div>

				<div className="flex w-full items-center gap-1  justify-end">
					<ParaglideLocaleSwitcher />
					<Button
						className=" flex items-center cursor-pointer gap-2 "
						onClick={handleLogout}
					>
						<LogOut className="h-4 w-4 " />
						<div className="text-sm   font-medium hidden md:block">
							{m.logout()}
						</div>
					</Button>
				</div>
			</div>
		</header>
	);
}
