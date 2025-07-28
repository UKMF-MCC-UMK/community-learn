import ProtectedRoute from "@/components/ProtectedRoute";
import MateriListComponent from "@/components/MateriListComponent";

export default function MateriPage() {
    return (
        <ProtectedRoute>
            <MateriListComponent />
        </ProtectedRoute>
    );
}
