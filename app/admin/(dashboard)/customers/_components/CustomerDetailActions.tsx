'use client';

import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { deleteCustomer } from '@/app/actions/admin/customers';

export default function CustomerDetailActions({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this customer? This will also unlink their orders.')) {
            const res = await deleteCustomer(id);
            if (res.error) {
                alert(res.error);
            } else {
                router.push('/admin/customers');
                router.refresh(); // Refresh to update list
            }
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={() => router.push(`/admin/customers/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
                <Edit className="w-4 h-4" />
                Edit Customer
            </button>
            <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                Delete
            </button>
        </div>
    );
}
