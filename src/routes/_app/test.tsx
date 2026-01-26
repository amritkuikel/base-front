/** biome-ignore-all lint/correctness/noChildrenProp: <todo> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/correctness/useUniqueElementIds: <todo> */

import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2, XIcon } from "lucide-react";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/test")({
	component: RouteComponent,
});

function RouteComponent() {
	const formSchema = z.object({
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters."),
		description: z.string().min(20),
		gender: z.enum(["male", "female"]),
		roles: z.array(z.enum(["admin", "user"])),
		tasks: z.enum(["task1", "task2", "task3"]),
		isEnabled: z.boolean(),
		subordinates: z.array(
			z.object({
				email: z.string().email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters."),
				description: z.string().min(20),
				gender: z.enum(["male", "female"]),
				roles: z.array(z.enum(["admin", "user"])),
				tasks: z.enum(["task1", "task2", "task3"]),
				isEnabled: z.boolean(),
			}),
		),
	});
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			description: "",
			gender: "male",
			roles: ["user"],
			tasks: "task1",
			isEnabled: false,
			subordinates: [
				{
					email: "",
					password: "",
					description: "",
					gender: "male",
					roles: ["user"],
					tasks: "task1",
					isEnabled: false,
				},
			],
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
		validators: {
			onBlur: formSchema,
			onSubmit: formSchema,
		},
	});
	return (
		<Card>
			<CardContent>
				<form
					id="test-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit(e);
					}}
				>
					<FieldGroup>
						<form.Field
							name="email"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>{field.name}</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Enter your email"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="password"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>{field.name}</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											type="password"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Enter your password"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="description"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>{field.name}</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Enter your description"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="gender"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldContent>
											<FieldLabel htmlFor={field.name}>{field.name}</FieldLabel>
											<FieldDescription>Please select gender.</FieldDescription>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</FieldContent>
										<Select
											name={field.name}
											value={field.state.value}
											onValueChange={field.handleChange}
										>
											<SelectTrigger id={field.name} aria-invalid={isInvalid}>
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
											<SelectContent position="item-aligned">
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
											</SelectContent>
										</Select>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="roles"
							mode="array"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<FieldSet>
										<FieldLegend variant="label">Roles</FieldLegend>
										<FieldDescription>Please select roles.</FieldDescription>
										<FieldGroup data-slot="checkbox-group">
											{[
												{
													id: "admin",
													label: "Admin",
												},
												{
													id: "user",
													label: "User",
												},
											].map((item) => {
												return (
													<Field
														key={item.id}
														orientation="horizontal"
														data-invalid={isInvalid}
													>
														<Checkbox
															key={`checkbox-item-${item.id}`}
															id={`checkbox-item-${item.id}`}
															name={field.name}
															aria-invalid={isInvalid}
															checked={field.state.value.includes(item.id)}
															onCheckedChange={(checked) => {
																if (checked) {
																	field.pushValue(item.id);
																} else {
																	const index = field.state.value.indexOf(
																		item.id,
																	);
																	if (index > -1) {
																		field.removeValue(index);
																	}
																}
															}}
														/>
														<FieldLabel htmlFor={`checkbox-item-${item.id}`}>
															{item.label}
														</FieldLabel>
													</Field>
												);
											})}
										</FieldGroup>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</FieldSet>
								);
							}}
						/>
						<form.Field
							name="tasks"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<FieldSet>
										<FieldLegend variant="label">Tasks</FieldLegend>
										<FieldDescription>Please select tasks.</FieldDescription>
										<RadioGroup
											name={field.name}
											value={field.state.value}
											onValueChange={field.handleChange}
										>
											{[
												{
													id: "task1",
													title: "Task 1",
													description: "Task 1 description.",
												},
												{
													id: "task2",
													title: "Task 2",
													description: "Task 2 description.",
												},
												{
													id: "task3",
													title: "Task 3",
													description: "Task 3 description.",
												},
											].map((plan) => (
												<FieldLabel
													key={plan.id}
													htmlFor={`form-tanstack-radiogroup-${plan.id}`}
												>
													<Field
														orientation="horizontal"
														data-invalid={isInvalid}
													>
														<FieldContent>
															<FieldTitle>{plan.title}</FieldTitle>
															<FieldDescription>
																{plan.description}
															</FieldDescription>
														</FieldContent>
														<RadioGroupItem
															value={plan.id}
															id={`form-tanstack-radiogroup-${plan.id}`}
															aria-invalid={isInvalid}
														/>
													</Field>
												</FieldLabel>
											))}
										</RadioGroup>
									</FieldSet>
								);
							}}
						/>
						<form.Field
							name="isEnabled"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field orientation="horizontal" data-invalid={isInvalid}>
										<FieldContent>
											<FieldLabel htmlFor={field.name}>{field.name}</FieldLabel>
											<FieldDescription>
												Please select {field.name}.
											</FieldDescription>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</FieldContent>
										<Switch
											id={field.name}
											name={field.name}
											checked={field.state.value}
											onCheckedChange={field.handleChange}
											aria-invalid={isInvalid}
										/>
									</Field>
								);
							}}
						/>
						<form.Field
							name="subordinates"
							mode="array"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<FieldSet>
										<FieldLegend variant="label">Subordinates</FieldLegend>
										<FieldDescription>
											Please add subordinates.
										</FieldDescription>
										<FieldGroup>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													field.pushValue({
														email: "",
														password: "",
														description: "",
														gender: "male",
														roles: ["user"],
														tasks: "task1",
														isEnabled: false,
													})
												}
												disabled={field.state.value.length >= 5}
											>
												Add Subordinate
											</Button>
											{field.state.value.map((_, index) => (
												<Card key={index} className="p-2">
													<form.Field
														name={`subordinates[${index}].email`}
														children={(field) => {
															const isInvalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<Field data-invalid={isInvalid}>
																	<FieldLabel htmlFor={field.name}>
																		Enter Email
																	</FieldLabel>
																	<Input
																		id={field.name}
																		name={field.name}
																		value={field.state.value}
																		onBlur={field.handleBlur}
																		onChange={(e) =>
																			field.handleChange(e.target.value)
																		}
																		aria-invalid={isInvalid}
																		placeholder="Enter your email"
																		autoComplete="off"
																	/>
																	{isInvalid && (
																		<FieldError
																			errors={field.state.meta.errors}
																		/>
																	)}
																</Field>
															);
														}}
													/>
													<form.Field
														name={`subordinates[${index}].password`}
														children={(field) => {
															const isInvalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<Field data-invalid={isInvalid}>
																	<FieldLabel htmlFor={field.name}>
																		Enter Password
																	</FieldLabel>
																	<Input
																		id={field.name}
																		name={field.name}
																		type="password"
																		value={field.state.value}
																		onBlur={field.handleBlur}
																		onChange={(e) =>
																			field.handleChange(e.target.value)
																		}
																		aria-invalid={isInvalid}
																		placeholder="Enter your password"
																		autoComplete="off"
																	/>
																	{isInvalid && (
																		<FieldError
																			errors={field.state.meta.errors}
																		/>
																	)}
																</Field>
															);
														}}
													/>
													<form.Field
														name={`subordinates[${index}].description`}
														children={(field) => {
															const isInvalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<Field data-invalid={isInvalid}>
																	<FieldLabel htmlFor={field.name}>
																		Enter Description
																	</FieldLabel>
																	<Textarea
																		id={field.name}
																		name={field.name}
																		value={field.state.value}
																		onBlur={field.handleBlur}
																		onChange={(e) =>
																			field.handleChange(e.target.value)
																		}
																		aria-invalid={isInvalid}
																		placeholder="Enter your description"
																		autoComplete="off"
																	/>
																	{isInvalid && (
																		<FieldError
																			errors={field.state.meta.errors}
																		/>
																	)}
																</Field>
															);
														}}
													/>
													<form.Field
														name={`subordinates[${index}].gender`}
														children={(field) => {
															const isInvalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<Field data-invalid={isInvalid}>
																	<FieldContent>
																		<FieldLabel htmlFor={field.name}>
																			Enter Gender
																		</FieldLabel>
																		<FieldDescription>
																			Please select gender.
																		</FieldDescription>
																		{isInvalid && (
																			<FieldError
																				errors={field.state.meta.errors}
																			/>
																		)}
																	</FieldContent>
																	<Select
																		name={field.name}
																		value={field.state.value}
																		onValueChange={field.handleChange}
																	>
																		<SelectTrigger
																			id={field.name}
																			aria-invalid={isInvalid}
																		>
																			<SelectValue placeholder="Select gender" />
																		</SelectTrigger>
																		<SelectContent position="item-aligned">
																			<SelectItem value="male">Male</SelectItem>
																			<SelectItem value="female">
																				Female
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	{isInvalid && (
																		<FieldError
																			errors={field.state.meta.errors}
																		/>
																	)}
																</Field>
															);
														}}
													/>
													<form.Field
														name={`subordinates[${index}].roles`}
														mode="array"
														children={(field) => {
															const isInvalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<FieldSet>
																	<FieldLegend variant="label">
																		Roles
																	</FieldLegend>
																	<FieldDescription>
																		Please select roles.
																	</FieldDescription>
																	<FieldGroup data-slot="checkbox-group">
																		{[
																			{
																				id: "admin",
																				label: "Admin",
																			},
																			{
																				id: "user",
																				label: "User",
																			},
																		].map((item) => {
																			return (
																				<Field
																					key={item.id}
																					orientation="horizontal"
																					data-invalid={isInvalid}
																				>
																					<Checkbox
																						key={`checkbox-item-${item.id}`}
																						id={`checkbox-item-${item.id}`}
																						name={field.name}
																						aria-invalid={isInvalid}
																						checked={field.state.value.includes(
																							item.id,
																						)}
																						onCheckedChange={(checked) => {
																							if (checked) {
																								field.pushValue(item.id);
																							} else {
																								const index =
																									field.state.value.indexOf(
																										item.id,
																									);
																								if (index > -1) {
																									field.removeValue(index);
																								}
																							}
																						}}
																					/>
																					<FieldLabel
																						htmlFor={`checkbox-item-${item.id}`}
																					>
																						{item.label}
																					</FieldLabel>
																				</Field>
																			);
																		})}
																	</FieldGroup>
																	{isInvalid && (
																		<FieldError
																			errors={field.state.meta.errors}
																		/>
																	)}
																</FieldSet>
															);
														}}
													/>
													<form.Field
														name={`subordinates[${index}].tasks`}
														children={(field) => {
															const isInvalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<FieldSet>
																	<FieldLegend variant="label">
																		Tasks
																	</FieldLegend>
																	<FieldDescription>
																		Please select tasks.
																	</FieldDescription>
																	<RadioGroup
																		name={field.name}
																		value={field.state.value}
																		onValueChange={field.handleChange}
																	>
																		{[
																			{
																				id: "task1",
																				title: "Task 1",
																				description: "Task 1 description.",
																			},
																			{
																				id: "task2",
																				title: "Task 2",
																				description: "Task 2 description.",
																			},
																			{
																				id: "task3",
																				title: "Task 3",
																				description: "Task 3 description.",
																			},
																		].map((plan) => (
																			<FieldLabel
																				key={plan.id}
																				htmlFor={`form-tanstack-radiogroup-${plan.id}`}
																			>
																				<Field
																					orientation="horizontal"
																					data-invalid={isInvalid}
																				>
																					<FieldContent>
																						<FieldTitle>
																							{plan.title}
																						</FieldTitle>
																						<FieldDescription>
																							{plan.description}
																						</FieldDescription>
																					</FieldContent>
																					<RadioGroupItem
																						value={plan.id}
																						id={`form-tanstack-radiogroup-${plan.id}`}
																						aria-invalid={isInvalid}
																					/>
																				</Field>
																			</FieldLabel>
																		))}
																	</RadioGroup>
																</FieldSet>
															);
														}}
													/>
													<form.Field
														name={`subordinates[${index}].isEnabled`}
														children={(field) => {
															const isInvalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<Field
																	orientation="horizontal"
																	data-invalid={isInvalid}
																>
																	<FieldContent>
																		<FieldLabel htmlFor={field.name}>
																			Enable
																		</FieldLabel>
																		<FieldDescription>
																			Please select Enable.
																		</FieldDescription>
																		{isInvalid && (
																			<FieldError
																				errors={field.state.meta.errors}
																			/>
																		)}
																	</FieldContent>
																	<Switch
																		id={field.name}
																		name={field.name}
																		checked={field.state.value}
																		onCheckedChange={field.handleChange}
																		aria-invalid={isInvalid}
																	/>
																</Field>
															);
														}}
													/>

													<Button
														type="button"
														onClick={() => field.removeValue(index)}
													>
														<XIcon /> Remove Subordinate
													</Button>
												</Card>
											))}
										</FieldGroup>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</FieldSet>
								);
							}}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Field orientation={"horizontal"}>
					<Button type="button" onClick={() => form.reset()}>
						Reset
					</Button>
					<Button type="submit" form="test-form">
						Submit
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
}
