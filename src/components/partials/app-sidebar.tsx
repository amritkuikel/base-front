import {
	IconCategory,
	IconDashboard,
	IconFolder,
	IconListDetails,
	IconSettings,
	IconStar,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { NavMain } from "@/components/partials/nav-main";
import { NavUser } from "@/components/partials/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/use-auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	// const { user, permissions, roles } = useAuth();
	// const data = {
	// 	navMain: [
	// 		{
	// 			title: ("dashboard"),
	// 			url: "/",
	// 			icon: IconDashboard,
	// 		},

	// 		{
	// 			title: ("projects"),
	// 			url: "/project",
	// 			icon: IconFolder,

	// 			items: [
	// 				roles.includes("admin") || roles.includes("municipality-user")
	// 					? { title: ("allProjects"), url: "/projects" }
	// 					: { title: "", url: "" },
	// 				((roles.includes("admin") || roles.includes("screener")) && {
	// 					title: ("screening"),
	// 					url: "/project-status/screening",
	// 				}) || { title: "", url: "" },
	// 				((roles.includes("admin") || roles.includes("assessment-user")) && {
	// 					title: ("assessments"),
	// 					url: "/project-status/assessment",
	// 				}) || { title: "", url: "" },
	// 				((roles.includes("admin") || roles.includes("recommender")) && {
	// 					title: ("recommendation"),
	// 					url: "/project-status/recommendation",
	// 				}) || { title: "", url: "" },
	// 				((roles.includes("admin") || roles.includes("approver")) && {
	// 					title: ("approval"),
	// 					url: "/project-status/approval",
	// 				}) || { title: "", url: "" },
	// 				(roles.includes("admin") && {
	// 					title: ("projectBank"),
	// 					url: "/project-status/approved",
	// 				}) || { title: "", url: "" },
	// 			],
	// 		},

	// 		permissions.includes("view.assessments")
	// 			? {
	// 					title: ("assessments"),
	// 					url: "/assessments",
	// 					icon: IconListDetails,
	// 				}
	// 			: { title: "", url: "" },
	// 		permissions.includes("view.project_categories")
	// 			? {
	// 					title: ("projectCategory"),
	// 					url: "/category-projects",
	// 					icon: IconCategory,
	// 				}
	// 			: { title: "", url: "" },
	// 		permissions.includes("view.review_types")
	// 			? {
	// 					title: ("reviewType"),
	// 					url: "/review-type",
	// 					icon: IconStar,
	// 				}
	// 			: { title: "", url: "" },

	// 		permissions.includes("view.users")
	// 			? {
	// 					title: ("users"),
	// 					url: "user",

	// 					icon: IconUsers,
	// 					items: [
	// 						(roles.includes("admin") && {
	// 							title: ("employees"),
	// 							url: "/employee-user",
	// 						}) || { title: "", url: "" },
	// 						{
	// 							title: ("municipalUsers"),
	// 							url: "/municipal-users",
	// 						},
	// 						{
	// 							title: ("waterUserAssociation"),
	// 							url: "/water-users-association",
	// 						},
	// 						{
	// 							title: ("privateSector"),
	// 							url: "/private-sector-users",
	// 						},
	// 						{
	// 							title: ("otherUsers"),
	// 							url: "/other-users",
	// 						},
	// 					],
	// 				}
	// 			: { title: "", url: "" },
	// 		roles.includes("admin")
	// 			? {
	// 					title: ("settings"),
	// 					url: "/settings",
	// 					icon: IconSettings,
	// 				}
	// 			: { title: "", url: "" },
	// 		roles.includes("municipality-user")
	// 			? {
	// 					title: ("Profile"),
	// 					url: "/profile",
	// 					icon: IconUser,
	// 				}
	// 			: { title: "", url: "" },
	// 	],
	// };
	return (
		<Sidebar collapsible="offcanvas" {...props} className="z-20">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5!"
						>
							<Link to="/" className="pb-8 flex items-center gap-2">
								<img
									src="https://tdf.org.np/sites/default/files/logo.svg"
									alt="TDF Logo"
									className="h-8"
								/>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>{/* <NavMain items={data.navMain} /> */}</SidebarContent>
			{/* <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter> */}
		</Sidebar>
	);
}
