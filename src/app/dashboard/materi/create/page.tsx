import ProtectedRoute from "@/components/ProtectedRoute";
import CreateMateriComponent from "@/components/CreateMateriComponent";

export default function CreateMateriPage() {
    return (
        <ProtectedRoute>
            <CreateMateriComponent />
        </ProtectedRoute>
    );
}
