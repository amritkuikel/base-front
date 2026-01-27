/** biome-ignore-all lint/suspicious/noExplicitAny: <todo> */
/** biome-ignore-all lint/style/noNonNullAssertion: <todo> */
/** biome-ignore-all lint/correctness/useUniqueElementIds: <todo> */
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconGripVertical,
	IconLayoutColumns,
} from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	type Row,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export const schema = z.object({
	id: z.number(),
	header: z.string(),
	type: z.string(),
	status: z.string(),
	target: z.string(),
	limit: z.string(),
	reviewer: z.string(),
});

export function DragHandle({ id }: { id: number }) {
	const { attributes, listeners } = useSortable({
		id,
	});

	return (
		<Button
			{...attributes}
			{...listeners}
			variant="ghost"
			size="icon"
			className="text-muted-foreground size-7 hover:bg-transparent"
			aria-label={"Drag to reorder"}
		>
			<IconGripVertical className="text-muted-foreground size-3" />
			<span className="sr-only">Drag to reorder</span>
		</Button>
	);
}

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.id,
	});

	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition,
			}}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function DataTable<TData, TValue>({
	name,
	data: initialData,
	columns,
	sheet,
	paginationData,
}: {
	name: string;
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
	sheet?: React.ReactNode;
	paginationData?: { currentPage: number; lastPage: number };
}) {
	const navigate = useNavigate();
	const search = useSearch({ strict: false });
	const [data, setData] = React.useState(() => initialData);
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	React.useEffect(() => {
		setData(initialData);
	}, [initialData]);
	const sortableId = React.useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() => data?.map(({ id }: any) => id) || [],
		[data],
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		getRowId: (row) => (row as any).id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setData((data) => {
				const oldIndex = dataIds.indexOf(active.id);
				const newIndex = dataIds.indexOf(over.id);
				return arrayMove(data, oldIndex, newIndex);
			});
		}
	}

	return (
		<Tabs
			defaultValue="outline"
			className="w-full flex-col justify-start gap-6"
		>
			<div className="flex items-center justify-between px-4 lg:px-6">
				<div className="font-medium">{name}</div>

				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								aria-label={"dataTable.customizeColumns"}
							>
								<IconLayoutColumns />
								<span className="hidden lg:inline">
									{"dataTable.customizeColumns"}
								</span>
								<span className="lg:hidden">{"dataTable.columns"}</span>
								<IconChevronDown className="ml-1 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide(),
								)
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id.replaceAll("_", " ")}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
					{sheet}
				</div>
			</div>
			<div className="px-4 lg:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
				<div className="col-span-full sm:col-span-2 md:col-span-1 lg:col-span-1">
					<label htmlFor="search-input" className="text-sm block mb-1">
						{"dataTable.search"}
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							id="search-input"
							type="search"
							placeholder={"dataTable.searchPlaceholder"}
							className="pl-10 h-9 bg-background border-border w-full"
							onChange={(event) => {
								(navigate as any)({
									search: (prev: any) => ({
										...prev,
										searchBy: event.target.value,
									}),
								});
							}}
							aria-label={"dataTable.search"}
						/>
					</div>
				</div>

				{/* Search In */}
				<div>
					<label htmlFor="search-in-select" className="text-sm block mb-1">
						{"dataTable.searchIn"}
					</label>
					<Select
						value={
							search.searchIn ||
							table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide(),
								)
								.map((column) => column.id)[0]
						}
						onValueChange={(value) => {
							(navigate as any)({
								search: (prev: any) => ({ ...prev, searchIn: value }),
							});
						}}
					>
						<SelectTrigger
							id="search-in-select"
							className="w-full"
							aria-label={"dataTable.searchIn"}
						>
							<SelectValue placeholder={"dataTable.selectColumnToSearchIn"}>
								{search?.searchIn?.split("_").join(" ") ||
									"dataTable.selectColumnToSearchIn"}
							</SelectValue>
						</SelectTrigger>
						<SelectContent align="end" className="w-56">
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide(),
								)
								.map((column) => (
									<SelectItem
										key={column.id}
										className="capitalize"
										value={column.id}
									>
										{column.id
											.split("_")
											.filter((item) => item !== "verified" && item !== "roles")
											.join(" ") || null}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>

				{/* Sort By */}
				<div>
					<label htmlFor="sort-by-select" className="text-sm block mb-1">
						{"dataTable.sortBy"}
					</label>
					<Select
						value={
							search.sortBy ||
							table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide(),
								)
								.map((column) => column.id)[0]
						}
						onValueChange={(value) => {
							(navigate as any)({
								search: (prev: any) => ({ ...prev, sortBy: value }),
							});
						}}
					>
						<SelectTrigger
							id="sort-by-select"
							className="w-full"
							aria-label={"dataTable.sortBy"}
						>
							<SelectValue placeholder={"dataTable.selectColumnSortBy"}>
								{search?.sortBy || "dataTable.selectColumnSortBy"}
							</SelectValue>
						</SelectTrigger>
						<SelectContent align="end" className="w-56">
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide(),
								)
								.map((column) => (
									<SelectItem
										key={column.id}
										className="capitalize"
										value={column.id}
									>
										{column.id}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>

				{/* Sort Order */}
				<div>
					<label htmlFor="sort-order-select" className="text-sm block mb-1">
						{"dataTable.sortOrder"}
					</label>
					<Select
						value={search.orderBy || "desc"}
						onValueChange={(value) => {
							(navigate as any)({
								search: (prev: any) => ({ ...prev, orderBy: value }),
							});
						}}
					>
						<SelectTrigger
							id="sort-order-select"
							className="w-full"
							aria-label={"dataTable.sortOrder"}
						>
							<SelectValue placeholder={"dataTable.selectSortOrder"}>
								{search.orderBy === "asc"
									? "dataTable.sortAsc"
									: "dataTable.sortDesc"}
							</SelectValue>
						</SelectTrigger>
						<SelectContent align="end" className="w-56">
							<SelectItem value="asc" className="capitalize">
								{"dataTable.sortAsc"}
							</SelectItem>
							<SelectItem value="desc" className="capitalize">
								{"dataTable.sortDesc"}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<TabsContent
				value="outline"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<div className="overflow-hidden rounded-lg border">
					<DndContext
						collisionDetection={closestCenter}
						modifiers={[restrictToVerticalAxis]}
						onDragEnd={handleDragEnd}
						sensors={sensors}
						id={sortableId}
					>
						<Table>
							<TableHeader className="bg-muted sticky top-0 z-10">
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id} colSpan={header.colSpan}>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody className="**:data-[slot=table-cell]:first:w-8">
								{table.getRowModel().rows?.length ? (
									<SortableContext
										items={dataIds}
										strategy={verticalListSortingStrategy}
									>
										{table.getRowModel().rows.map((row) => (
											<DraggableRow key={row.id} row={row as any} />
										))}
									</SortableContext>
								) : (
									<TableRow className="p-4">
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
											aria-live="polite"
										>
											{"dataTable.noResults"}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</DndContext>
				</div>
				<div className="flex items-center justify-between px-4">
					<div
						className="text-muted-foreground hidden flex-1 text-sm lg:flex"
						aria-live="polite"
					>
						{"dataTable.rowsSelected"}
						{table.getFilteredSelectedRowModel().rows.length}
						{table.getFilteredRowModel().rows.length}
					</div>
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label
								htmlFor="rows-per-page"
								className="text-sm font-medium whitespace-nowrap"
							>
								{"dataTable.rowsPerPage"}
							</Label>
							<Select
								value={search?.size?.toString() ?? "10"}
								onValueChange={(value) => {
									(navigate as any)({
										search: (prev: any) => ({
											...prev,
											page: 1,
											size: Number(value),
										}),
									});
								}}
							>
								<SelectTrigger
									size="sm"
									className="w-20"
									id="rows-per-page"
									aria-label={"dataTable.rowsPerPage"}
								>
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									>
										{search?.size?.toString() ?? "10"}
									</SelectValue>
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div
							className="flex w-fit items-center justify-center text-sm font-medium"
							aria-live="polite"
						>
							{paginationData ? (
								<div>
									{"dataTable.pageXOfY" +
										paginationData.currentPage +
										paginationData.lastPage}
								</div>
							) : (
								<div>{"dataTable.pageXOfY" + "1" + "1"}</div>
							)}
						</div>
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => {
									(navigate as any)({
										search: (prev: any) => ({ ...prev, page: 1 }),
									});
								}}
								disabled={!paginationData || paginationData.currentPage === 1}
								aria-label={"dataTable.goToFirstPage"}
							>
								<span className="sr-only">{"dataTable.goToFirstPage"}</span>
								<IconChevronsLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => {
									(navigate as any)({
										search: (prev: any) => ({
											...prev,
											page: paginationData?.currentPage! - 1,
										}),
									});
								}}
								disabled={!paginationData || paginationData.currentPage === 1}
								aria-label={"dataTable.goToPreviousPage"}
							>
								<span className="sr-only">{"dataTable.goToPreviousPage"}</span>
								<IconChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => {
									(navigate as any)({
										search: (prev: any) => ({
											...prev,
											page: paginationData?.currentPage! + 1,
										}),
									});
								}}
								disabled={
									!paginationData ||
									paginationData.currentPage === paginationData.lastPage
								}
								aria-label={"dataTable.goToNextPage"}
							>
								<span className="sr-only">{"dataTable.goToNextPage"}</span>
								<IconChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => {
									(navigate as any)({
										search: (prev: any) => ({
											...prev,
											page: paginationData?.lastPage,
										}),
									});
								}}
								disabled={
									!paginationData ||
									paginationData.currentPage === paginationData.lastPage
								}
								aria-label={"dataTable.goToLastPage"}
							>
								<span className="sr-only">{"dataTable.goToLastPage"}</span>
								<IconChevronsRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}
