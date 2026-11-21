import { AdminLayout } from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, ExternalLink, Image as ImageIcon, Layers, MessageSquare, Phone, Plus, Sparkles, Store } from 'lucide-react';

interface SectionInfo {
    id: number;
    slug: string;
    label: string;
    itemName: string;
    total: number;
    published: number;
    hidden: number;
}

interface DashboardProps {
    sections: Record<string, SectionInfo>;
    whatsappNumber: string;
}

const sectionMeta: Record<string, { desc: string; icon: typeof Store; accent: string; bg: string }> = {
    media: {
        desc: 'Advertising creatives, motion ads and campaign media.',
        icon: ImageIcon,
        accent: '#BD4714',
        bg: '#FBF0E9',
    },
    cards: {
        desc: 'Wedding invitation card designs and sample prices.',
        icon: Layers,
        accent: '#9A2A65',
        bg: '#FDF0F6',
    },
    books: {
        desc: 'Book catalogue, literary publications, author descriptions and covers.',
        icon: BookOpen,
        accent: '#233256',
        bg: '#EEF2FA',
    },
    'digi-world': {
        desc: 'Digital media services, social media ads, graphic design and video production.',
        icon: Sparkles,
        accent: '#1B6A47',
        bg: '#EDF7F2',
    },
};

export default function AdminDashboard({ sections, whatsappNumber }: DashboardProps) {
    return (
        <AdminLayout title="Businesses - Kampuram Admin">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#282723]">Catalogue Management</h1>
                        <p className="text-sm text-[#77746E]">
                            Choose a business to manage listings, add new items, or adjust visibility.
                        </p>
                    </div>

                    <Link
                        href={route('admin.settings.edit')}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#DDD8D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#45423B] shadow-xs transition hover:bg-[#F7F5F0] hover:text-[#BD4714]"
                    >
                        <Phone className="h-3.5 w-3.5 text-[#16834A]" />
                        <span>WhatsApp: +{whatsappNumber}</span>
                    </Link>
                </div>

                {/* Businesses 4-grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {Object.entries(sections).map(([slug, section]) => {
                        const meta = sectionMeta[slug] || {
                            desc: 'Catalogue items',
                            icon: Store,
                            accent: '#ED6A2F',
                            bg: '#FAF8F4',
                        };
                        const IconComponent = meta.icon;

                        return (
                            <div
                                key={slug}
                                className="group relative flex flex-col justify-between rounded-2xl border border-[#E8E4DD] bg-white p-6 shadow-xs transition hover:border-[#DDD8D0] hover:shadow-md"
                            >
                                <div>
                                    {/* Icon & Title */}
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-xl"
                                            style={{ backgroundColor: meta.bg, color: meta.accent }}
                                        >
                                            <IconComponent className="h-5 w-5" />
                                        </div>

                                        <span className="rounded-full bg-[#FAF8F4] px-2.5 py-1 text-xs font-semibold text-[#66625B] border border-[#ECE8E1]">
                                            {section.total} {section.total === 1 ? section.itemName : section.itemName + 's'}
                                        </span>
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold text-[#282723] group-hover:text-[#BD4714] transition-colors">
                                        {section.label}
                                    </h2>
                                    <p className="mt-1 text-xs leading-relaxed text-[#77746E]">{meta.desc}</p>

                                    {/* Counts */}
                                    <div className="mt-4 flex items-center gap-4 border-t border-[#F0ECE6] pt-3 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="font-medium text-[#282723]">{section.published}</span>
                                            <span className="text-[#88847D]">visible</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-stone-300" />
                                            <span className="font-medium text-[#282723]">{section.hidden}</span>
                                            <span className="text-[#88847D]">hidden</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 flex items-center gap-2 pt-2">
                                    <Link
                                        href={route('admin.listings.index', { section: slug })}
                                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#282723] py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3E3C38]"
                                    >
                                        <span>Manage {section.itemName}s</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>

                                    <Link
                                        href={route('admin.listings.create', { section: slug })}
                                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#DDD8D0] bg-white px-3 py-2.5 text-xs font-semibold text-[#45423B] transition hover:border-[#ED6A2F] hover:bg-[#FAF8F4] hover:text-[#BD4714]"
                                        title={`Add ${section.itemName}`}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* WhatsApp Setting Quick Banner */}
                <div className="rounded-2xl border border-[#E8E4DD] bg-white p-6 shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#282723]">WhatsApp Enquiry Destination</h3>
                                <p className="mt-0.5 text-xs text-[#77746E]">
                                    All public enquiry buttons, service consultations and floating chat connect to{' '}
                                    <strong className="text-[#282723]">+{whatsappNumber}</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DDD8D0] bg-white px-3 py-2 text-xs font-semibold text-[#55524B] shadow-xs transition hover:bg-[#FAF8F4] hover:text-[#16834A]"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Test WhatsApp</span>
                            </a>

                            <Link
                                href={route('admin.settings.edit')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED6A2F] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#D95821]"
                            >
                                <span>Change number</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
