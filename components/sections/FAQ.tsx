import React from 'react';
import { useTranslations } from 'next-intl';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface FAQProps {
    data?: {
        title?: string;
        faqs?: Array<{
            question: string;
            answer: string;
        }>;
    };
}

const FAQ = ({ data }: FAQProps) => {
    const h = useTranslations('FAQ');

    if (!data?.faqs || data.faqs.length === 0) return null;

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-zinc-900 dark:text-white">
                    {data?.title || 'Frequently Asked Questions'}
                </h2>
                <div className="space-y-4">
                    {data.faqs.map((faq, index) => (
                        <Disclosure key={index} as="div" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex w-full justify-between items-center px-6 py-4 text-left font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                        <span>{faq.question}</span>
                                        <ChevronDown
                                            className={`${open ? 'rotate-180' : ''
                                                } h-5 w-5 text-indigo-600 transition-transform`}
                                        />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Disclosure.Panel className="px-6 pb-4 pt-2 text-zinc-600 dark:text-zinc-400">
                                            {faq.answer}
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
