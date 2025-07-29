import ProtectedRoute from "@/components/utils/ProtectedRoute";
import CreateMateriComponent from "@/components/materi/CreateMateriComponent";

export default function CreateMateriPage() {
    return (
        <ProtectedRoute>
            <CreateMateriComponent />
        </ProtectedRoute>
    );
}
