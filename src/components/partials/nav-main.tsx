import type { Icon } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url?: string;
		icon?: Icon;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const location = useLocation();
	const pathname = location.pathname;
	return (
		<div className="mt-4">
			{items
				.filter((item) => item.title !== "")
				.map((item) => {
					return (
						<Collapsible
							key={item.title}
							title={item.title}
							defaultOpen
							className="group/collapsible"
						>
							<SidebarGroup>
								<SidebarGroupContent className="flex flex-col gap-2 ">
									<CollapsibleTrigger
										className="flex items-center list-none"
										asChild
									>
										<div>
											{item.items ? (
												<SidebarMenuItem
													className={`w-full ${cn(item.url === "/" ? pathname === item.url && "underline font-bold" : pathname.includes(item.url!) && "underline font-bold")}`}
												>
													<SidebarMenuButton
														tooltip={item.title}
														className="w-full"
													>
														{item.icon && <item.icon />}
														<span>{item.title}</span>
													</SidebarMenuButton>
												</SidebarMenuItem>
											) : (
												<Link to={item.url} key={item.title} className="w-full">
													<SidebarMenuItem
														className={`w-full ${cn(item.url === "/" ? pathname === item.url && "underline font-bold" : pathname.includes(item.url!) && "underline font-bold")}`}
													>
														<SidebarMenuButton
															tooltip={item.title}
															className="w-full"
														>
															{item.icon && <item.icon />}
															<span>{item.title}</span>
														</SidebarMenuButton>
													</SidebarMenuItem>
												</Link>
											)}
											{item.items?.length ? (
												<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
											) : (
												<div></div>
											)}
										</div>
									</CollapsibleTrigger>
								</SidebarGroupContent>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.length ? (
											item.items?.map(
												(subItem) =>
													subItem.title !== "" && (
														<SidebarMenuSubItem
															key={subItem.title}
															className={`${cn(item.url === "/" ? pathname === item.url && " font-bold" : pathname.includes(subItem.url) && "font-bold")}`}
														>
															<SidebarMenuSubButton asChild>
																<Link to={subItem.url}>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													),
											)
										) : (
											<div></div>
										)}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarGroup>
						</Collapsible>
					);
				})}
		</div>
	);
}
