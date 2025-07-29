"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import NotificationContainer from "@/components/utils/NotificationContainer";
import { useNotification } from "@/hooks/useNotification";

export default function LoginPage() {
    const { notifications, removeNotification, showError, showSuccess } = useNotification();

    const handleLoginSuccess = () => {
        showSuccess("Login successful! Redirecting...");
    };

    const handleLoginError = (error: string) => {
        showError(error);
    };

    return (
        <>
            <AuthLayout>
                <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onLoginError={handleLoginError}
                />
            </AuthLayout>

            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
            />
        </>
    );
}
