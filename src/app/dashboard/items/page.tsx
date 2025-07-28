import ProtectedRoute from "@/components/ProtectedRoute";
import { redirect } from "next/navigation";

export default function ItemsPage() {
    // Redirect ke materi page karena items sudah diganti dengan materi
    redirect('/dashboard/materi');
}
