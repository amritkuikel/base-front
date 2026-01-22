import type React from "react";
import type {
	Control,
	ControllerFieldState,
	ControllerRenderProps,
	FieldValues,
	Path,
	UseFormStateReturn,
} from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

export type InputFieldProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	labelright?: React.ReactElement;
	description?: string;
	required?: boolean;
	input: ({
		field,
		fieldState,
		formState,
	}: {
		field: ControllerRenderProps<T>;
		fieldState: ControllerFieldState;
		formState: UseFormStateReturn<T>;
	}) => React.ReactElement;
};

export const InputField = <T extends FieldValues>({
	name,
	label,
	description,
	labelright,
	control,
	input,
	required,
}: InputFieldProps<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState, formState }) => (
				<FormItem className="w-full flex flex-col space-y-2">
					{label && (
						<div className="flex items-start justify-start h-fit w-full">
							<Label
								htmlFor={name}
								className="text-sm font-semibold  flex items-center gap-1"
							>
								{label}
								{required && <span className="text-red-500 font-bold">*</span>}
							</Label>
							{labelright}
						</div>
					)}

					<FormControl>{input({ field, fieldState, formState })}</FormControl>

					{description && (
						<FormDescription className="text-xs ">
							{description}
						</FormDescription>
					)}
					<FormMessage className="text-xs text-destructive" />
				</FormItem>
			)}
		/>
	);
};
