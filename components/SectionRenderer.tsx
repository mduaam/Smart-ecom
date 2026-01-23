import React from 'react';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Features from '@/components/sections/Features';
import FAQ from '@/components/sections/FAQ';
import Content from '@/components/sections/Content';

const SectionRenderer = ({ sections }: { sections: any[] }) => {
    if (!sections) return null;

    return (
        <>
            {sections.map((section) => {
                switch (section._type) {
                    case 'heroSection':
                        return <Hero key={section._key} />; // Hero currently doesn't accept props in the main component, might need refactor if we want dynamic Hero 
                    case 'featuresSection':
                        return <Features key={section._key} data={section} />;
                    case 'pricingSection':
                        // Pricing takes "plans". If the section has plans, passed them. 
                        // In the sanity schema, pricingSection has "title" and "tier".
                        // The existing Pricing component expects "plans" prop which is an array of sanity documents.
                        // We might need to fetch plans or pass them if they are expanded.
                        // For now, let's assume we might need to adjust Pricing component or pass what we have.
                        // Actually, the existing Pricing module fetches plans internally or takes them as props?
                        // Let's check Pricing.tsx again.
                        return <Pricing key={section._key} plans={section.plans} title={section.title} subtitle={section.subtitle} />;
                    case 'faqSection':
                        return <FAQ key={section._key} data={section} />;
                    case 'contentSection':
                        return <Content key={section._key} data={section} />;
                    default:
                        return null;
                }
            })}
        </>
    );
};

export default SectionRenderer;
