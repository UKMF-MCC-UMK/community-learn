"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema, LoginSchemaType } from "@/schema/userLoginSchema";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
    onLoginSuccess?: () => void;
    onLoginError?: (error: string) => void;
}

export default function LoginForm({
    onLoginSuccess,
    onLoginError
}: LoginFormProps) {
    const [loginCredentials, setLoginCredentials] = useState<LoginSchemaType>({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        const schemaValidation = loginSchema.safeParse(loginCredentials);

        if (!schemaValidation.success) {
            const errorMessage = schemaValidation.error.issues
                .map((err: { message: string }) => err.message)
                .join(", ");
            onLoginError?.(errorMessage);
            setIsLoading(false);
            return;
        }

        try {
            const res = await signIn("credentials", {
                username: loginCredentials.username,
                password: loginCredentials.password,
                redirect: false,
            });

            if (!res?.ok) {
                const errorMessage = res?.error || "Login failed. Please check your credentials.";
                onLoginError?.(errorMessage);
                setIsLoading(false);
                return;
            }

            onLoginSuccess?.();
            router.push("/dashboard/items");
        } catch (error) {
            console.error(`Login error: ${error}`);
            onLoginError?.("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof LoginSchemaType) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setLoginCredentials(prev => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black text-center">Welcome Back</h2>
            <form onSubmit={handleLogin} className="w-full">
                <div className="mb-4 sm:mb-6">
                    <input
                        value={loginCredentials.username}
                        onChange={handleInputChange("username")}
                        type="text"
                        placeholder="Username"
                        required
                        disabled={isLoading}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 border-b border-b-black bg-transparent focus:outline-none font-bold text-black placeholder-gray-600 text-sm sm:text-base"
                    />
                </div>

                <div className="mb-6 sm:mb-8">
                    <input
                        value={loginCredentials.password}
                        onChange={handleInputChange("password")}
                        type="password"
                        placeholder="Password"
                        required
                        disabled={isLoading}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 border-b border-b-black bg-transparent focus:outline-none font-bold text-black placeholder-gray-600 text-sm sm:text-base"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-4 sm:mt-5 mb-1 py-2 sm:py-2.5 px-3 sm:px-4 text-lg sm:text-xl font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${isLoading
                        ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-700'
                        : 'bg-purple-400 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] sm:hover:translate-x-[2px] sm:hover:translate-y-[2px] cursor-pointer'
                        }`}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>

        </div>
    );
}
