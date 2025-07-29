import ProtectedRoute from "@/components/utils/ProtectedRoute";
import MateriListComponent from "@/components/materi/MateriListComponent";

export default function MateriPage() {
    return (
        <ProtectedRoute>
            <MateriListComponent />
        </ProtectedRoute>
    );
}
