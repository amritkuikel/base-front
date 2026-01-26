/** biome-ignore-all lint/correctness/useUniqueElementIds: <todo> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <todo> */

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { m } from "@/paraglide/messages";
export const description = "An interactive area chart";

const chartConfig = {
	count: {
		label: "Count",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

export function ChartAreaInteractive({ projects }: { projects?: any }) {
	const chartData = projects;
	const isMobile = useIsMobile();
	const [timeRange, setTimeRange] = React.useState("90d");

	React.useEffect(() => {
		if (isMobile) {
			setTimeRange("7d");
		}
	}, [isMobile]);

	const filteredData = chartData.filter((item: any) => {
		const date = new Date(item.date);
		const referenceDate = new Date();
		let daysToSubtract = 90;
		if (timeRange === "30d") {
			daysToSubtract = 30;
		} else if (timeRange === "7d") {
			daysToSubtract = 7;
		}
		const startDate = new Date(referenceDate);
		startDate.setDate(startDate.getDate() - daysToSubtract);
		return date >= startDate && date <= referenceDate;
	});

	return (
		<Card className="@container/card">
			<CardHeader>
				<CardTitle>{m.totalProjects()}</CardTitle>
				<CardDescription>
					<span className="hidden @[540px]/card:block">
						{m.totalLast3Months()}
					</span>
					<span className="@[540px]/card:hidden">{m.last3Months()}</span>
				</CardDescription>
				<CardAction>
					<ToggleGroup
						type="single"
						value={timeRange}
						onValueChange={setTimeRange}
						variant="outline"
						className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
					>
						<ToggleGroupItem value="90d">{m.last3Months()}</ToggleGroupItem>
						<ToggleGroupItem value="30d">{m.last30Days()}</ToggleGroupItem>
						<ToggleGroupItem value="7d">{m.last7days()}</ToggleGroupItem>
					</ToggleGroup>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger
							className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
							size="sm"
							aria-label="Select a value"
						>
							<SelectValue placeholder="Last 3 months" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="90d" className="rounded-lg">
								Last 3 months
							</SelectItem>
							<SelectItem value="30d" className="rounded-lg">
								Last 30 days
							</SelectItem>
							<SelectItem value="7d" className="rounded-lg">
								Last 7 days
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={filteredData}>
						<defs>
							<linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-count)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-count)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="count"
							type="natural"
							fill="url(#fillMobile)"
							stroke="var(--color-count)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
