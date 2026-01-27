import { ModeToggle } from "@/components/shared/theme-switcher";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { loginFn } from "@/lib/auth";
import { useAppForm } from "@/components/forms/form/test/form-hook";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters",
	}),
});

export function LoginPage() {
	const login = useServerFn(loginFn);

	const loginForm = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onBlur: LoginSchema,
			onSubmit: LoginSchema,
		},
		onSubmit: async ({ value }) => {
			login({ data: value });
		},
	});

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-muted/40 px-4">
			<Card className="w-full max-w-sm shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl">Welcome back</CardTitle>
					<CardDescription>Sign in to your account to continue</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						id="login-form"
						onSubmit={(e) => {
							e.preventDefault();
							loginForm.handleSubmit(e);
						}}
						className="space-y-4"
					>
						<FieldGroup>
							<loginForm.AppField
								name="email"
								children={(field) => (
									<field.TextInput label="Email" type="email" />
								)}
							/>

							<loginForm.AppField
								name="password"
								children={(field) => (
									<field.TextInput label="Password" type="password" />
								)}
							/>
						</FieldGroup>

						<loginForm.AppForm>
							<loginForm.SubscribeButtons />
						</loginForm.AppForm>
					</form>
				</CardContent>

				<CardFooter className="text-center text-xs text-muted-foreground">
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</CardFooter>
			</Card>

			<div className="absolute bottom-4 left-4">
				<ModeToggle />
			</div>
		</div>
	);
}
