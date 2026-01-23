import { PortableText } from '@portabletext/react';

interface ContentProps {
    data: {
        content: any;
    };
}

const components = {
    block: {
        h1: ({ children }: any) => <h1 className="text-4xl font-bold mb-6 mt-10">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-3xl font-bold mb-5 mt-8">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-2xl font-bold mb-4 mt-6">{children}</h3>,
        normal: ({ children }: any) => <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</p>,
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-indigo-600 pl-4 italic my-6 bg-zinc-50 dark:bg-zinc-900 py-2 pr-4 rounded-r-lg">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2">{children}</ol>,
    },
    marks: {
        link: ({ children, value }: any) => {
            const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
            return (
                <a
                    href={value.href}
                    rel={rel}
                    className="text-indigo-600 hover:underline font-medium"
                >
                    {children}
                </a>
            );
        },
    },
};

const Content = ({ data }: ContentProps) => {
    if (!data?.content) return null;

    return (
        <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose dark:prose-invert max-w-none">
                    <PortableText value={data.content} components={components} />
                </div>
            </div>
        </section>
    );
};

export default Content;
