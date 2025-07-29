import DashboardComponent from "@/components/dashboard/DashboardComponent";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <DashboardComponent />
        </ProtectedRoute>
    );
}
