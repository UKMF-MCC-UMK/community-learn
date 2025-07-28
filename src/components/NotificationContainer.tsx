"use client";

import { Notification, NotificationType } from '@/hooks/useNotification';

interface NotificationContainerProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}

const getNotificationStyles = (type: NotificationType): string => {
    const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-sm";

    switch (type) {
        case 'success':
            return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
        case 'error':
            return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
        case 'warning':
            return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
        case 'info':
            return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
        default:
            return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
};

export default function NotificationContainer({
    notifications,
    onRemove
}: NotificationContainerProps) {
    if (notifications.length === 0) return null;

    return (
        <div className="notification-container">
            {notifications.map((notification, index) => (
                <div
                    key={notification.id}
                    className={getNotificationStyles(notification.type)}
                    style={{
                        top: `${1 + index * 5}rem`,
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => onRemove(notification.id)}
                            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close notification"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
