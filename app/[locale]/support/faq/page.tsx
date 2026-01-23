import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getFAQs, getLocalizedContent } from '@/lib/sanity-utils';
import { Link } from '@/navigation';
import { ArrowLeft, ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import DirectAnswer from '@/components/seo/DirectAnswer';
import { generateFAQPageSchema, FAQItem } from '@/lib/seo-schemas';

interface FAQPageProps {
    params: Promise<{
        locale: string;
    }>;
}

// SEO Metadata
export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
    const { locale } = await params;

    const titles: Record<string, string> = {
        'en': 'IPTV Smarters Pro FAQ - Common Questions & Answers',
        'es': 'Preguntas Frecuentes IPTV Smarters - Soporte y Ayuda',
        'fr': 'FAQ IPTV Smarters Pro - Questions Fréquemment Posées',
        'nl': 'IPTV Smarters Pro Veelgestelde Vragen - FAQ'
    };

    const descriptions: Record<string, string> = {
        'en': 'Find answers to common IPTV Smarters Pro questions. Troubleshoot installation issues, buffering problems, login errors, and more. Expert solutions included.',
        'es': 'Encuentre respuestas a preguntas comunes sobre IPTV Smarters Pro. Aprenda sobre instalación, soluciones de buffering y gestión de suscripciones.',
        'fr': 'Trouvez des réponses aux questions courantes sur IPTV Smarters Pro. Apprenez-en plus sur l\'installation, les problèmes de mise en mémoire tampon et les abonnements.',
        'nl': 'Vind antwoorden op veelgestelde vragen over IPTV Smarters Pro. Leer meer over installatie, buffering oplossingen en abonnement beheer.'
    };

    return {
        title: titles[locale] || titles['en'],
        description: descriptions[locale] || descriptions['en'],
        keywords: [
            'iptv smarters faq',
            'iptv buffering fix',
            'smarters pro help',
            'iptv subscription questions',
            'how to use smarters pro'
        ],
        openGraph: {
            title: titles[locale] || titles['en'],
            description: descriptions[locale] || descriptions['en'],
            type: 'website'
        }
    };
}

const FAQPage = async ({ params }: FAQPageProps) => {
    const { locale } = await params;
    const t = await getTranslations('Support');
    const seo = await getTranslations('SEO.DirectAnswers');

    // Fetch FAQs from Sanity
    const faqs = await getFAQs();

    // Fallback FAQs if Sanity is empty (Localized)
    const fallbackFAQs = [
        {
            question: {
                en: 'How do I activate my subscription?',
                fr: 'Comment activer mon abonnement ?',
                es: '¿Cómo activo mi suscripción?',
                nl: 'Hoe activeer ik mijn abonnement?'
            },
            answer: {
                en: 'After purchasing, you will receive an activation code via email. Simply enter this code in the Smarters Pro app under Settings > Activate.',
                fr: 'Après l\'achat, vous recevrez un code d\'activation par e-mail. Entrez simplement ce code dans l\'application Smarters Pro sous Paramètres > Activer.',
                es: 'Después de la compra, recibirá un código de activación por correo electrónico. Simplemente ingrese este código en la aplicación Smarters Pro bajo Configuración > Activar.',
                nl: 'Na aankoop ontvangt u een activeringscode per e-mail. Voer deze code in de Smarters Pro app in onder Instellingen > Activeren.'
            }
        },
        {
            question: {
                en: 'Can I use my subscription on multiple devices?',
                fr: 'Puis-je utiliser mon abonnement sur plusieurs appareils ?',
                es: '¿Puedo usar mi suscripción en varios dispositivos?',
                nl: 'Kan ik mijn abonnement op meerdere apparaten gebruiken?'
            },
            answer: {
                en: 'Yes! Depending on your plan, you can use your subscription on 1-5 devices simultaneously. Check your plan details for specific limits.',
                fr: 'Oui ! Selon votre forfait, vous pouvez utiliser votre abonnement sur 1 à 5 appareils simultanément. Consultez les détails de votre forfait pour les limites spécifiques.',
                es: '¡Sí! Dependiendo de su plan, puede usar su suscripción en 1-5 dispositivos simultáneamente. Consulte los detalles de su plan para conocer los límites específicos.',
                nl: 'Ja! Afhankelijk van uw abonnement kunt u uw abonnement op 1-5 apparaten tegelijkertijd gebruiken. Controleer uw abonnementsdetails voor specifieke limieten.'
            }
        },
        {
            question: {
                en: 'What should I do if the stream is buffering?',
                fr: 'Que faire si le flux se met en mémoire tampon ?',
                es: '¿Qué debo hacer si la transmisión se está almacenando en búfer?',
                nl: 'Wat moet ik doen als de stream buffert?'
            },
            answer: {
                en: 'Buffering is usually caused by internet speed. We recommend a minimum of 10 Mbps for SD and 25 Mbps for HD streaming. Try restarting your router or switching to a wired connection.',
                fr: 'La mise en mémoire tampon est généralement causée par la vitesse d\'Internet. Nous recommandons un minimum de 10 Mbps pour la SD et 25 Mbps pour le streaming HD. Essayez de redémarrer votre routeur ou de passer à une connexion filaire.',
                es: 'El buffering suele ser causado por la velocidad de Internet. Recomendamos un mínimo de 10 Mbps para SD y 25 Mbps para transmisión HD. Intente reiniciar su enrutador o cambiar a una conexión por cable.',
                nl: 'Buffering wordt meestal veroorzaakt door internetsnelheid. We raden minimaal 10 Mbps aan voor SD en 25 Mbps voor HD-streaming. Probeer uw router opnieuw op te starten of over te schakelen naar een bekabelde verbinding.'
            }
        },
        {
            question: {
                en: 'How do I cancel my subscription?',
                fr: 'Comment annuler mon abonnement ?',
                es: '¿Cómo cancelo mi suscripción?',
                nl: 'Hoe annuleer ik mijn abonnement?'
            },
            answer: {
                en: 'You can cancel your subscription anytime from your Account Dashboard. Go to Account > Subscriptions > Manage > Cancel. You will retain access until the end of your billing period.',
                fr: 'Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Allez dans Compte > Abonnements > Gérer > Annuler.',
                es: 'Puede cancelar su suscripción en cualquier momento desde su Panel de Cuenta. Vaya a Cuenta > Suscripciones > Administrar > Cancelar.',
                nl: 'U kunt uw abonnement op elk moment annuleren vanuit uw Accountdashboard. Ga naar Account > Abonnementen > Beheren > Annuleren.'
            }
        },
        {
            question: {
                en: 'Is there a free trial available?',
                fr: 'Existe-t-il un essai gratuit ?',
                es: '¿Hay una prueba gratuita disponible?',
                nl: 'Is er een gratis proefversie beschikbaar?'
            },
            answer: {
                en: 'We offer a 7-day money-back guarantee on all plans. If you\'re not satisfied, contact support within 7 days for a full refund.',
                fr: 'Nous offrons une garantie de remboursement de 7 jours sur tous les forfaits. Si vous n\'êtes pas satisfait, contactez le support dans les 7 jours pour un remboursement complet.',
                es: 'Ofrecemos una garantía de devolución de dinero de 7 días en todos los planes. Si no está satisfecho, contacte al soporte dentro de los 7 días para un reembolso completo.',
                nl: 'We bieden een geld-terug-garantie van 7 dagen op alle abonnementen. Als u niet tevreden bent, neem dan binnen 7 dagen contact op met de ondersteuning voor een volledige terugbetaling.'
            }
        },
        {
            question: {
                en: 'What payment methods do you accept?',
                fr: 'Quels modes de paiement acceptez-vous ?',
                es: '¿Qué métodos de pago aceptan?',
                nl: 'Welke betaalmethoden accepteren jullie?'
            },
            answer: {
                en: 'We accept all major credit cards, PayPal, and cryptocurrency payments through our secure payment gateway.',
                fr: 'Nous acceptons toutes les principales cartes de crédit, PayPal et les paiements en crypto-monnaie via notre passerelle de paiement sécurisée.',
                es: 'Aceptamos las principales tarjetas de crédito, PayPal y pagos con criptomonedas a través de nuestra pasarela de pago segura.',
                nl: 'We accepteren alle grote creditcards, PayPal en cryptocurrency-betalingen via onze beveiligde betalingsgateway.'
            }
        },
        {
            question: {
                en: 'Is IPTV Smarters Pro legal?',
                fr: 'IPTV Smarters Pro est-il légal ?',
                es: '¿Es legal IPTV Smarters Pro?',
                nl: 'Is IPTV Smarters Pro legaal?'
            },
            answer: {
                en: 'IPTV Smarters Pro is a legal application. It\'s simply a media player. The legality depends on the IPTV service provider you use. Using licensed IPTV services is completely legal. We recommend only using legitimate IPTV providers with proper broadcasting rights.',
                fr: 'IPTV Smarters Pro est une application légale. C\'est simplement un lecteur multimédia. La légalité dépend du fournisseur de services IPTV que vous utilisez. L\'utilisation de services IPTV sous licence est totalement légale.',
                es: 'IPTV Smarters Pro es una aplicación legal. Es simplemente un reproductor multimedia. La legalidad depende del proveedor de servicios IPTV que utilice. El uso de servicios IPTV con licencia es completamente legal.',
                nl: 'IPTV Smarters Pro is een legale applicatie. Het is gewoon een mediaspeler. De legaliteit hangt af van de IPTV-serviceprovider die u gebruikt. Het gebruik van gelicentieerde IPTV-services is volledig legaal.'
            }
        },
    ];

    // Generate FAQPage Schema for SEO
    const faqSchema = generateFAQPageSchema(
        (faqs.length > 0 ? faqs : fallbackFAQs).map((faq: any) => ({
            question: getLocalizedContent(faq.question, locale),
            answer: getLocalizedContent(faq.answer, locale)
        }))
    );

    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <StructuredData data={faqSchema} />
            <main className="pt-20">\n                {/* Hero Section */}
                <div className="relative bg-zinc-900 py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>

                    <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm font-medium mb-6">
                            <HelpCircle className="w-4 h-4" />
                            Support Center
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Everything you need to know about our services, subscription, and troubleshooting.
                        </p>
                    </div>
                </div>

                {/* Direct Answer Section */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                    <DirectAnswer answer={seo('faq')} />
                </div>

                {/* FAQ Content */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    <div className="space-y-4">
                        {/* Combine Real & Fallback FAQs logic */}
                        {(faqs.length > 0 ? faqs : fallbackFAQs).map((faq: any, index: number) => (
                            <details
                                key={index}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500 transition-all shadow-sm"
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white pr-8 leading-snug">
                                        {/* Handle both sanity format (localized obj) and fallback format (localized obj) */}
                                        {getLocalizedContent(faq.question, locale)}
                                    </h3>
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 transition-colors">
                                        <ChevronDown className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
                                    </div>
                                </summary>
                                <div className="px-8 pb-8 pt-2">
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base border-l-2 border-indigo-100 dark:border-zinc-700 pl-4">
                                        {getLocalizedContent(faq.answer, locale)}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* Still Have Questions */}
                    <div className="mt-20 bg-indigo-600 rounded-3xl p-10 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500/40 via-transparent to-transparent"></div>
                        <div className="relative z-10">
                            <MessageCircle className="w-12 h-12 mx-auto mb-6 text-indigo-200" />
                            <h3 className="text-3xl font-bold mb-4">
                                Still need help?
                            </h3>
                            <p className="text-indigo-100 mb-8 max-w-lg mx-auto text-lg">
                                Can't find the answer you're looking for? Our chat support team is available 24/7.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/support/tickets/new"
                                    className="px-8 py-3.5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                                >
                                    Open Support Ticket
                                </Link>
                                <a
                                    href="mailto:support@iptvsmarters.pro"
                                    className="px-8 py-3.5 bg-indigo-700 text-white rounded-xl font-bold hover:bg-indigo-800 transition-colors border border-indigo-500"
                                >
                                    Email Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FAQPage;
