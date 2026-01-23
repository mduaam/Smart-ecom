'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Save, Trash2, AlertTriangle } from 'lucide-react';
import { updateCustomer, deleteCustomer } from '@/app/actions/admin/customers';
import { useRouter } from 'next/navigation';

interface CustomerEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customer: {
        id: string;
        full_name: string;
        email: string;
        phone: string;
        billing_address: string;
        shipping_address: string;
    };
}

export default function CustomerEditDialog({ isOpen, onClose, customer }: CustomerEditDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        billing_address: customer.billing_address || '',
        shipping_address: customer.shipping_address || ''
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await updateCustomer(customer.id, formData);
        setIsLoading(false);

        if (res.error) {
            alert('Error updating customer: ' + res.error); // Simple alert for now
        } else {
            onClose();
            router.refresh();
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        const res = await deleteCustomer(customer.id);
        setIsLoading(false);

        if (res.error) {
            alert('Error deleting customer: ' + res.error);
        } else {
            onClose();
            router.push('/admin/customers');
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all border border-zinc-200 dark:border-zinc-800">
                                <div className="flex justify-between items-start mb-6">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-zinc-900 dark:text-white">
                                        Edit Customer
                                    </Dialog.Title>
                                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-500">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                            Billing Address
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={formData.billing_address}
                                            onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                            Shipping Address
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={formData.shipping_address}
                                            onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                                        />
                                    </div>

                                    <div className="pt-6 flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 mt-6">
                                        {!showDeleteConfirm ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 font-bold transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Customer
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-red-600 mr-2">Are you sure?</span>
                                                <button
                                                    type="button"
                                                    onClick={handleDelete}
                                                    disabled={isLoading}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                                                >
                                                    Yes, Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-bold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
                                            >
                                                <Save className="w-4 h-4" />
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
