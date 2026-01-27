import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import { Button } from "@/components/ui/button";
import { fieldContext, formContext, useFormContext } from "./form-provider";

const TextInput = lazy(() => import("@/components/forms/form/test/text-input"));
const TextAreaInput = lazy(
	() => import("@/components/forms/form/test/text-area-input"),
);
const SelectInput = lazy(
	() => import("@/components/forms/form/test/select-input"),
);
const CheckboxInput = lazy(
	() => import("@/components/forms/form/test/checkbox-input"),
);
const RadioInput = lazy(
	() => import("@/components/forms/form/test/radio-input"),
);
const SwitchInput = lazy(
	() => import("@/components/forms/form/test/switch-input"),
);
const SubordinatesInput = lazy(
	() => import("@/components/forms/form/test/subordinates"),
);

function SubscribeButtons() {
	const form = useFormContext();
	return (
		<form.Subscribe
			selector={(state) => ({
				isSubmitting: state.isSubmitting,
				isValid: state.isValid,
				isDirty: state.isDirty,
			})}
		>
			{({ isSubmitting, isValid, isDirty }) => (
				<div className="flex gap-2">
					<Button type="submit" disabled={isSubmitting || !isValid}>
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>

					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting || !isDirty}
						onClick={() => form.reset()}
					>
						Reset
					</Button>
				</div>
			)}
		</form.Subscribe>
	);
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldComponents: {
		TextInput,
		TextAreaInput,
		SelectInput,
		CheckboxInput,
		RadioInput,
		SwitchInput,
		SubordinatesInput,
	},
	formComponents: {
		SubscribeButtons,
	},

	fieldContext,
	formContext,
});
