'use client';

import { createCustomer } from '@/app/actions/admin/customers';
import CustomerForm from '../_components/CustomerForm';
import { Users } from 'lucide-react';

export default function NewCustomerPage() {
    return (
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-indigo-600" />
                    Add Customer
                </h1>
                <p className="text-zinc-500 mt-2">Create a new customer profile manually.</p>
            </header>

            <CustomerForm
                mode="create"
                onSubmit={createCustomer}
            />
        </main>
    );
}
