import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { User } from "@/types";
import { ModeToggle } from "../shared/theme-switcher";

export function NavUser({ user }: { user: User }) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{user.name}</span>
						<span className="text-muted-foreground truncate text-xs">
							{user.email}
						</span>
						<span className="text-muted-foreground truncate text-xs">
							{user.phone_number}
						</span>
					</div>
					<ModeToggle />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
