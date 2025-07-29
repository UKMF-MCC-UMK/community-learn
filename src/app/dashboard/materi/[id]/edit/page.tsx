import EditMateriComponent from '@/components/materi/EditMateriComponent';
import ProtectedRoute from '@/components/utils/ProtectedRoute';

export default async function EditMateriPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <ProtectedRoute>
            <EditMateriComponent materiId={id} />
        </ProtectedRoute>
    );
}