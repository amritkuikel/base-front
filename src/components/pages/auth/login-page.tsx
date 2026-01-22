// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { Link, useSearch } from "@tanstack/react-router";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import { TextInput } from "@/components/forms/form-components/text-input";
// import { ModeToggle } from "@/components/shared/mode-toggle";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Form } from "@/components/ui/form";
// import { Fetch } from "@/lib/fetcher";
// import { useAuth } from "@/provider/use-auth";
// import type { ErrorMessage } from "@/types";

// const LoginSchema = z.object({
// 	email: z.string().email(),
// 	password: z
// 		.string()
// 		.min(8, { message: "Password must be at least 8 characters" }),
// });

// type LoginFormType = z.infer<typeof LoginSchema>;

// export function LoginPage() {
// 	const { setJwt } = useAuth();
// 	const { token } = useSearch({ strict: false });
// 	const loginForm = useForm<LoginFormType>({
// 		resolver: zodResolver(LoginSchema),
// 	});
// 	const onLoginSubmit = (data: LoginFormType) => {
// 		onLogin.mutate(data);
// 	};
// 	const onLogin = useMutation({
// 		mutationFn: async (data: LoginFormType) => {
// 			try {
// 				await Fetch<{ data: { token: string } }>({
// 					url: "/auth/login",
// 					method: "POST",
// 					data: data,
// 				}).then((res) => {
// 					toast.success("User logged in successfully");
// 					setJwt(res?.data?.token);
// 				});
// 			} catch (error: unknown) {
// 				toast.error((error as ErrorMessage)?.message);
// 				console.error("Error during login:", error);
// 			}
// 		},
// 	});

// 	const onTokenLogin = useMutation({
// 		mutationFn: async () => {
// 			try {
// 				await Fetch<{ data: { token: string } }>({
// 					url: "/auth/external-token",
// 					method: "POST",
// 					data: { token: token },
// 				}).then((res) => {
// 					toast.success("User logged in successfully");
// 					setJwt(res?.data?.token);
// 				});
// 			} catch (error: unknown) {
// 				toast.error((error as Error)?.message);
// 				console.error("Error during login:", error);
// 			}
// 		},
// 	});

// 	useEffect(() => {
// 		if (token) {
// 			onTokenLogin.mutate();
// 		}
// 	}, [token, onTokenLogin]);

// 	return (
// 		<div className="flex flex-col gap-2 h-screen items-center justify-center ">
// 			<Card className="overflow-hidden p-0">
// 				<CardContent className="grid p-0 md:grid-cols-2">
// 					<Form {...loginForm}>
// 						<form
// 							className="p-6 md:p-8"
// 							onSubmit={loginForm.handleSubmit(onLoginSubmit)}
// 						>
// 							<div className="flex flex-col gap-6">
// 								<div className="flex flex-col items-center text-center">
// 									<h1 className="text-2xl font-bold">Welcome back</h1>
// 									<p className="text-muted-foreground text-balance">
// 										Login to your TDF-Town Development Fund account
// 									</p>
// 								</div>
// 								<TextInput
// 									type="email"
// 									name="email"
// 									control={loginForm.control}
// 									label="Email"
// 									required
// 									placeholder="Enter your email"
// 								/>
// 								<TextInput
// 									name="password"
// 									control={loginForm.control}
// 									label="Password"
// 									type="password"
// 									placeholder="Enter your password"
// 									required
// 								/>
// 								<Button type="submit" className="w-full">
// 									Login
// 								</Button>

// 								<div className="text-center text-sm">
// 									Don&apos;t have an account?{" "}
// 									<Link
// 										to="/signup"
// 										className="underline underline-offset-4 text-blue-500"
// 									>
// 										Sign up
// 									</Link>
// 								</div>
// 							</div>
// 						</form>
// 					</Form>
// 					<div className="bg-muted relative hidden md:block">
// 						<img
// 							src="/login.png"
// 							alt="login page"
// 							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
// 						/>
// 					</div>
// 				</CardContent>
// 			</Card>
// 			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
// 				By clicking continue, you agree to our Terms of Service and Privacy
// 				Policy.
// 			</div>
// 			<div className="absolute bottom-2 left-2">
// 				<ModeToggle />
// 			</div>
// 		</div>
// 	);
// }
