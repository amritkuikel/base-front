/** biome-ignore-all lint/correctness/useHookAtTopLevel: <explanation> */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Bell, Loader, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logoutFn } from "@/lib/auth";
import { Fetch } from "@/lib/fetcher";
import { useAuth } from "@/providers/use-auth";
import ParaglideLocaleSwitcher from "../shared/locale-switcher";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface Notification {
	id: number;
	project_apply_id: number;
	notified_by: number;
	notified_to: number;
	remarks: string | null;
	read_by_managers: boolean;
	read_by_user: boolean;
	status: string;
	created_at: string;
	updated_at: string;
}

export function SiteHeader() {
	const router = useRouter();
	const canGoBack = useCanGoBack();
	const queryClient = useQueryClient();
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const logout = useServerFn(logoutFn);
	async function fetchNotification(): Promise<Notification[]> {
		const res = await Fetch<any>({
			method: "GET",
			url: `/notifications`,
		});
		return res.data;
	}

	async function markAsRead(notificationId: number): Promise<void> {
		await Fetch({
			method: "POST",
			url: `/notification/${notificationId}/mark-as-read`,
		});
	}

	const { data: notification, isLoading } = useQuery({
		queryKey: ["notification"],
		queryFn: () => fetchNotification(),
	});

	const unreadCount = useMemo(() => {
		if (!notification) return 0;
		return notification.filter((item) => !item.read_by_managers).length;
	}, [notification]);

	const handleNotificationClick = async (
		notificationId: number,
		isRead: boolean,
	) => {
		if (!isRead) {
			try {
				await markAsRead(notificationId);
				queryClient.invalidateQueries({ queryKey: ["notification"] });
			} catch (error) {
				console.error("Failed to mark notification as read:", error);
			}
		}
	};

	const getNotificationMessage = (item: Notification) => {
		if (item.remarks) return item.remarks;

		switch (item.status) {
			case "rejected":
				return "yourProjectApplicationHasBeenRejected";
			case "approved":
				return "yourProjectApplicationHasBeenApproved";
			case "pending":
				return "yourProjectApplicationIsPendingReview";
			default:
				return "youHaveANewNotification";
		}
	};

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "approved":
				return "default";
			case "rejected":
				return "destructive";
			case "pending":
				return "secondary";
			default:
				return "outline";
		}
	};

	const handleLogout = async () => {
		await logout();
	};

	return (
		<div></div>
		// <header className="flex bg-secondary h-(--header-height) sticky top-0 z-10 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
		// 	<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 ">
		// 		<SidebarTrigger className="-ml-1" />
		// 		<Separator
		// 			orientation="vertical"
		// 			className="mx-2 data-[orientation=vertical]:h-4"
		// 		/>

		// 		<h1 className="text-base font-medium hidden md:block">{"dashboard"}</h1>
		// 		<div className="flex items-center gap-1 pr-4 cursor-pointer">
		// 			<Button
		// 				onClick={() => router.history.back()}
		// 				variant="outline"
		// 				disabled={!canGoBack}
		// 			>
		// 				<ArrowLeft />
		// 			</Button>
		// 			<Button onClick={() => router.history.forward()} variant="outline">
		// 				<ArrowRight />
		// 			</Button>
		// 		</div>
		// 		{/*     <div className="ml-auto">
		//   {isLoading ? (
		//     <Loader className="h-5 w-5 animate-spin" />
		//   ) : (
		//     <DropdownMenu
		//       open={isNotificationOpen}
		//       onOpenChange={setIsNotificationOpen}
		//     >
		//       <DropdownMenuTrigger asChild>
		//         <Button variant="ghost" size="icon" className="relative">
		//           <Bell className="h-5 w-5" />
		//           {unreadCount > 0 && (
		//             <Badge
		//               variant="destructive"
		//               className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
		//             >
		//               {unreadCount > 9 ? "9+" : unreadCount}
		//             </Badge>
		//           )}
		//         </Button>
		//       </DropdownMenuTrigger>

		//       <DropdownMenuContent align="end" className="w-80">
		//         <DropdownMenuLabel className="flex items-center justify-between">
		//           <span>{t("notifications")}</span>
		//           {notification && notification.length > 0 && (
		//             <span className="text-xs text-muted-foreground font-normal">
		//               {notification.length} {t("total")}
		//             </span>
		//           )}
		//         </DropdownMenuLabel>
		//         <DropdownMenuSeparator />

		//         {notification && notification.length > 0 ? (
		//           <div className="max-h-[400px] overflow-y-auto">
		//             {notification.map((item) => (
		//               <DropdownMenuItem
		//                 key={item.id}
		//                 className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
		//                   !item.read_by_managers ? "bg-accent/50" : ""
		//                 }`}
		//                 onClick={() =>
		//                   handleNotificationClick(
		//                     item.id,
		//                     item.read_by_managers,
		//                   )
		//                 }
		//               >
		//                 <Link
		//                   to={`/projects-one/$id/$tab`}
		//                   params={{
		//                     id: item.project_apply_id.toString(),
		//                     tab: "project",
		//                   }}
		//                   className="w-full"
		//                 >
		//                   <div className="flex items-start justify-between w-full gap-2">
		//                     <p className="text-sm flex-1">
		//                       {getNotificationMessage(item)}
		//                     </p>
		//                     <Badge
		//                       variant={getStatusVariant(item.status)}
		//                       className="shrink-0"
		//                     >
		//                       {item.status}
		//                     </Badge>
		//                   </div>
		//                   <p className="text-xs text-muted-foreground mt-1">
		//                     {new Date(item.created_at).toLocaleDateString(
		//                       "en-US",
		//                       {
		//                         month: "short",
		//                         day: "numeric",
		//                         year: "numeric",
		//                         hour: "2-digit",
		//                         minute: "2-digit",
		//                       },
		//                     )}
		//                   </p>
		//                 </Link>
		//               </DropdownMenuItem>
		//             ))}
		//           </div>
		//         ) : (
		//           <div className="p-4 text-center text-sm text-muted-foreground">
		//             {t("noNotifications")}
		//           </div>
		//         )}
		//       </DropdownMenuContent>
		//     </DropdownMenu>
		//   )}
		// </div>  */}
		// 		<ParaglideLocaleSwitcher />
		// 		<Button
		// 			className=" flex items-center cursor-pointer gap-2 "
		// 			onClick={ handleLogout }
		// 		>
		// 			<LogOut className="h-4 w-4 " />
		// 			<div className="text-sm   font-medium hidden md:block">
		// 				{"logout"}
		// 			</div>
		// 		</Button>
		// 	</div>
		// </header>
	);
}
