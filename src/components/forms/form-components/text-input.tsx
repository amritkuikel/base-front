import { Eye, EyeOff } from "lucide-react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "nepali-datepicker-reactjs/dist/index.css";
import { getInputProps } from "@/lib/get-input-props";
import type { InputProps } from "@/types";
import { InputField, type InputFieldProps } from "./input-field";

type TextInputProps<T extends FieldValues> = InputProps &
	Omit<InputFieldProps<T>, "input">;

export const TextInput = <T extends FieldValues>(props: TextInputProps<T>) => {
	const [fieldProps, inputProps] = getInputProps(props);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const getInputType = () => {
		if (inputProps.type === "password") {
			return showPassword ? "text" : "password";
		}
		return inputProps.type;
	};

	const isDateInput = inputProps.type === "date";

	return (
		<InputField
			{...fieldProps}
			input={({ field }) => {
				if (isDateInput) {
					return (
						<div className="relative w-full">
							<NepaliDatePicker
								value={field.value ?? ""}
								onChange={(date: string) => field.onChange(date)}
								options={{
									calenderLocale: "ne",
									valueLocale: "en",
								}}
								inputClassName="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
							/>
						</div>
					);
				}

				return (
					<div className="relative">
						<Input
							{...inputProps}
							type={getInputType()}
							name={props.name}
							id={fieldProps.name}
							required={props.required}
							value={field.value ?? ""}
							onChange={(e) => {
								if (inputProps.type === "number") {
									return field.onChange(
										Number.parseFloat(e.target.value) || "",
									);
								}
								field.onChange(e);
							}}
						/>
						{inputProps.type === "password" && (
							<div className="absolute right-2 top-1/2 -translate-y-1/2">
								<Button
									variant="link"
									size="sm"
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="h-auto p-1"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						)}
					</div>
				);
			}}
		/>
	);
};
