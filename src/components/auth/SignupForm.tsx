"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupSchema, SignupSchema } from "@/schema/signUpSchema";
import { Button } from "@/components/ui/button";

interface SignupFormProps {
    onSignupStart?: () => void;
    onSignupSuccess?: () => void;
    onSignupError?: (error: string) => void;
}

export default function SignupForm({
    onSignupStart,
    onSignupSuccess,
    onSignupError
}: SignupFormProps) {
    const [signupCredentials, setSignupCredentials] = useState<SignupSchema>({
        name: "",
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);
        onSignupStart?.();

        const schemaValidation = signupSchema.safeParse(signupCredentials);

        if (!schemaValidation.success) {
            const errorMessage = schemaValidation.error.issues
                .map((err) => err.message)
                .join(", ");
            onSignupError?.(errorMessage);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupCredentials),
            });

            const data = await res.json();

            if (!res.ok) {
                onSignupError?.(data.error || "Signup failed. Please try again.");
                setIsLoading(false);
                return;
            }

            onSignupSuccess?.();
            router.push("/login");
        } catch (error) {
            console.error(`Signup error: ${error}`);
            onSignupError?.("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof SignupSchema) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSignupCredentials(prev => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black text-center">Create an Account</h2>
            <form onSubmit={handleSignup} className="w-full">
                <div className="mb-4 sm:mb-6">
                    <input
                        value={signupCredentials.name}
                        onChange={handleInputChange("name")}
                        type="text"
                        placeholder="Full Name"
                        required
                        disabled={isLoading}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 border-b border-b-black bg-transparent focus:outline-none font-bold text-black placeholder-gray-600 text-sm sm:text-base"
                    />
                </div>

                <div className="mb-4 sm:mb-6">
                    <input
                        value={signupCredentials.username}
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
                        value={signupCredentials.password}
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
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </form>

            <span className="fira-sans-light mt-4 sm:mt-6 text-center text-black text-sm sm:text-base">
                Already have an account?{" "}
                <Link href="/signup" className="underline fira-sans-medium text-blue-600 hover:text-blue-800">
                    Login here
                </Link>
            </span>
        </div>
    );
}
