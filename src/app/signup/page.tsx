"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import NotificationContainer from "@/components/utils/NotificationContainer";
import { useNotification } from "@/hooks/useNotification";

export default function SignupPage() {
    const { notifications, removeNotification, showError, showSuccess } = useNotification();

    const handleSignupStart = () => {
        // You can add loading state here if needed
    };

    const handleSignupSuccess = () => {
        showSuccess("Account created successfully! Please login to continue.");
    };

    const handleSignupError = (error: string) => {
        showError(error);
    };

    return (
        <>
            <AuthLayout>
                <SignupForm
                    onSignupStart={handleSignupStart}
                    onSignupSuccess={handleSignupSuccess}
                    onSignupError={handleSignupError}
                />
            </AuthLayout>

            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
            />
        </>
    );
}
