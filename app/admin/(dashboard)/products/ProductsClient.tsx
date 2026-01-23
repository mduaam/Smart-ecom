'use client';

import { useState, useEffect } from 'react';
import {
    Search, Plus, MoreVertical, Edit, Trash, Star, Zap,
    Package, X, Loader2, Save, ShoppingBag, Layers, Box, Tag, UploadCloud, Image as ImageIcon
} from 'lucide-react';
import { updatePlan, createPlan, createProduct, updateProduct, uploadProductImage } from '@/app/actions/admin/products';
import { useRouter } from 'next/navigation';

interface Variant {
    name: string;
    value: string;
    sku?: string;
    price?: number;
    stock?: number;
}

interface Item {
    _id: string;
    _type: 'plan' | 'product';
    name: { en: string };
    price: number;
    currency: string;
    // Plan specific
    duration?: string;
    stripeProductId?: string;
    isPopular?: boolean;
    screens?: number;
    // Product specific
    img?: string;
    description?: { en: string };
    stock?: number;
    variants?: Variant[];
}

export default function ProductsClient({ initialItems }: { initialItems: Item[] }) {
    const router = useRouter();
    const [items, setItems] = useState<Item[]>(initialItems || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'plan' | 'product'>('product');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Variants State specific for form
    const [tempVariants, setTempVariants] = useState<Variant[]>([]);
    const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    useEffect(() => {
        if (editingItem && editingItem._type === 'product') {
            if (editingItem.variants) setTempVariants(editingItem.variants);
            // Can't easily pre-fill image ID from read-only "img" URL without passing it differently.
            // For now, let's assume if editing, we might not show existing image in upload preview unless we parse it.
            // But we can reset it.
            setUploadedImageId(null);
        } else {
            setTempVariants([]);
            setUploadedImageId(null);
        }
    }, [editingItem]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadProductImage(formData);

        setIsUploading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setUploadedImageId(result.assetId);
        }
    };

    const filteredItems = items.filter(item =>
        item._type === activeTab &&
        (item.name?.en?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (item: Item) => {
        setEditingItem(item);
        setIsModalOpen(true);
        setError(null);
    };

    const handleCreateClick = () => {
        setEditingItem(null);
        setTempVariants([]);
        setIsModalOpen(true);
        setError(null);
    };

    const addVariant = () => {
        setTempVariants([...tempVariants, { name: 'Size', value: 'M', sku: '', price: 0, stock: 10 }]);
    };

    const removeVariant = (index: number) => {
        setTempVariants(tempVariants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        const newVariants = [...tempVariants];
        // @ts-ignore
        newVariants[index][field] = value;
        setTempVariants(newVariants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const type = editingItem ? editingItem._type : activeTab;

        try {
            let result;
            if (type === 'plan') {
                const planData = {
                    name: formData.get('name') as string,
                    price: parseFloat(formData.get('price') as string),
                    currency: formData.get('currency') as string,
                    duration: formData.get('duration') as string,
                    screens: parseInt(formData.get('screens') as string),
                    isPopular: formData.get('isPopular') === 'on'
                };

                if (editingItem) {
                    result = await updatePlan(editingItem._id, planData);
                } else {
                    result = await createPlan(planData);
                }
            } else {
                // Product
                const productData = {
                    name: formData.get('name') as string,
                    price: parseFloat(formData.get('price') as string),
                    currency: formData.get('currency') as string,
                    description: formData.get('description') as string,
                    stock: parseInt(formData.get('stock') as string) || 0,
                    image: uploadedImageId, // Pass the asset ID
                    variants: tempVariants
                };

                if (editingItem) {
                    result = await updateProduct(editingItem._id, productData);
                } else {
                    result = await createProduct(productData);
                }
            }

            if (result?.error) {
                setError(result.error);
            } else {
                setIsModalOpen(false);
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="w-full xl:w-96 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    />
                </div>

                <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
                    <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => setActiveTab('product')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'product'
                                ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white'
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            <Box className="w-4 h-4" /> Physical Products
                        </button>
                        <button
                            onClick={() => setActiveTab('plan')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'plan'
                                ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white'
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            <Layers className="w-4 h-4" /> Subscriptions
                        </button>
                    </div>

                    <button
                        onClick={handleCreateClick}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        New {activeTab === 'plan' ? 'Plan' : 'Product'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest min-w-[300px]">Item Name</th>
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Price</th>
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    {activeTab === 'plan' ? 'Duration' : 'Stock'}
                                </th>
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    {item._type === 'plan' ? <Zap className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-zinc-900 dark:text-white text-base">
                                                        {item.name?.en}
                                                    </div>
                                                    <div className="text-xs text-zinc-500 font-mono mt-0.5">
                                                        {item._id.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 font-bold">
                                            {item.price.toFixed(2)} <span className="text-xs text-zinc-500 uppercase">{item.currency}</span>
                                        </td>
                                        <td className="py-5 px-8">
                                            {item._type === 'plan' ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
                                                    {item.duration} · {item.screens} Screen{item.screens !== 1 && 's'}
                                                </span>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex self-start items-center px-2.5 py-1 rounded-full text-xs font-bold ${(item.stock || 0) > 0
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                        {(item.stock || 0) > 0 ? `In Stock (${item.stock})` : 'Out of Stock'}
                                                    </span>
                                                    {item.variants && item.variants.length > 0 && (
                                                        <span className="text-xs text-zinc-500">{item.variants.length} Variants</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-colors">
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-16 text-center text-zinc-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Package className="w-8 h-8 opacity-20" />
                                            <p>No items found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                {editingItem ? 'Edit' : 'New'} {activeTab === 'plan' ? 'Subscription Plan' : 'Product'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-zinc-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {(editingItem?._type === 'plan' || (!editingItem && activeTab === 'plan')) ? (
                                // PLAN FORM
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Plan Name</label>
                                            <input name="name" defaultValue={editingItem?.name?.en} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Price</label>
                                            <input name="price" type="number" step="0.01" defaultValue={editingItem?.price} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Currency</label>
                                            <select name="currency" defaultValue={editingItem?.currency || 'usd'} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                                <option value="usd">USD</option>
                                                <option value="eur">EUR</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Duration</label>
                                            <select name="duration" defaultValue={editingItem?.duration || '1-month'} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                                <option value="1-month">1 Month</option>
                                                <option value="6-months">6 Months</option>
                                                <option value="12-months">12 Months</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Screens</label>
                                            <select name="screens" defaultValue={editingItem?.screens || 1} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                                <option value="1">1 Screen</option>
                                                <option value="2">2 Screens</option>
                                                <option value="3">3 Screens</option>
                                                <option value="4">4 Screens</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-3">
                                            <input type="checkbox" name="isPopular" defaultChecked={editingItem?.isPopular} className="w-5 h-5 rounded text-indigo-600" />
                                            <span className="text-sm font-medium">Mark as Popular</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // PRODUCT FORM
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Product Name</label>
                                            <input name="name" defaultValue={editingItem?.name?.en} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Base Price</label>
                                            <input name="price" type="number" step="0.01" defaultValue={editingItem?.price} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Currency</label>
                                            <select name="currency" defaultValue={editingItem?.currency || 'usd'} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                                <option value="usd">USD</option>
                                                <option value="eur">EUR</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
                                            <textarea name="description" defaultValue={editingItem?.description?.en} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 min-h-[100px]" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Product Image</label>
                                            <div className="mt-2 flex items-center justify-center w-full">
                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-300 dark:border-zinc-700 border-dashed rounded-xl cursor-pointer bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        {isUploading ? (
                                                            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                                                        ) : uploadedImageId ? (
                                                            <div className="flex items-center gap-2 text-green-600">
                                                                <ImageIcon className="w-8 h-8" />
                                                                <span className="text-sm font-medium">Image Uploaded!</span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                                                                <p className="text-xs text-zinc-500 font-bold">Click to upload image</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Global Stock</label>
                                            <input name="stock" type="number" defaultValue={editingItem?.stock || 0} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                                        </div>

                                        {/* Variants Section */}
                                        <div className="col-span-2 border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-2">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-bold flex items-center gap-2"><Tag className="w-4 h-4" /> Product Variants</h3>
                                                <button type="button" onClick={addVariant} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">+ Add Variant</button>
                                            </div>

                                            <div className="space-y-3">
                                                {tempVariants.map((variant, idx) => (
                                                    <div key={idx} className="flex gap-2 items-start p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 relative group">
                                                        <div className="grid grid-cols-2 gap-2 flex-1">
                                                            <input
                                                                placeholder="Name (Size)"
                                                                value={variant.name}
                                                                onChange={e => updateVariant(idx, 'name', e.target.value)}
                                                                className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                                                            />
                                                            <input
                                                                placeholder="Value (XL)"
                                                                value={variant.value}
                                                                onChange={e => updateVariant(idx, 'value', e.target.value)}
                                                                className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                                                            />
                                                            <input
                                                                placeholder="Uniq SKU"
                                                                value={variant.sku || ''}
                                                                onChange={e => updateVariant(idx, 'sku', e.target.value)}
                                                                className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    placeholder="Price"
                                                                    type="number"
                                                                    value={variant.price || 0}
                                                                    onChange={e => updateVariant(idx, 'price', parseFloat(e.target.value))}
                                                                    className="w-1/2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                                                                />
                                                                <input
                                                                    placeholder="Stock"
                                                                    type="number"
                                                                    value={variant.stock || 0}
                                                                    onChange={e => updateVariant(idx, 'stock', parseFloat(e.target.value))}
                                                                    className="w-1/2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button type="button" onClick={() => removeVariant(idx)} className="p-1 hover:bg-red-100 text-red-500 rounded">
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {tempVariants.length === 0 && (
                                                    <div className="text-center text-xs text-zinc-400 py-4 italic">No variants added</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {editingItem ? 'Save Changes' : 'Create Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
