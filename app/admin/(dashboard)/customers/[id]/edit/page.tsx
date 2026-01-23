'use client';

import { use, useState, useEffect } from 'react';
import { updateCustomer, getCustomerDetails } from '@/app/actions/admin/customers';
import CustomerForm from '../../_components/CustomerForm';
import { Users, Loader2 } from 'lucide-react';

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCustomerDetails(id).then((res) => {
            if (res.data) {
                setCustomer(res.data);
            }
            setLoading(false);
        });
    }, [id]);

    const handleUpdate = async (data: any) => {
        return await updateCustomer(id, data);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!customer) {
        return <div className="p-12 text-center text-red-500">Customer not found</div>;
    }

    return (
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-indigo-600" />
                    Edit Customer
                </h1>
                <p className="text-zinc-500 mt-2">Update customer details.</p>
            </header>

            <CustomerForm
                mode="edit"
                initialData={customer}
                onSubmit={handleUpdate}
            />
        </main>
    );
}
