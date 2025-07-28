import DashboardComponent from "@/components/DashboardComponent";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <DashboardComponent />
        </ProtectedRoute>
    );
}
