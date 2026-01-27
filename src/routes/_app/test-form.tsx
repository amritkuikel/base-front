/** biome-ignore-all lint/correctness/noChildrenProp: <todo> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <todo> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <todo> */
/** biome-ignore-all lint/correctness/useUniqueElementIds: <todo> */

import TestForm from "@/components/forms/form/test/test-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/test-form")({
	component: TestForm,
});
