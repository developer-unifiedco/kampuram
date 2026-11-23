import { AdminLayout } from '@/layouts/admin-layout';
import { AdminListingItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Edit3,
    Eye,
    EyeOff,
    FileVideo,
    Film,
    Image as ImageIcon,
    Plus,
    Store,
} from 'lucide-react';
import { useState } from 'react';

interface ListingsIndexProps {
    section: string;
    sectionLabel: string;
    itemName: string;
    filter: string;
    listings: AdminListingItem[];
}

export default function ListingsIndex({
    section,
    sectionLabel,
    itemName,
    filter,
    listings,
}: ListingsIndexProps) {
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const handleReorder = (item: AdminListingItem, direction: 'up' | 'down') => {
        setActionLoadingId(item.id);
        router.patch(
            route('admin.listings.position', { section, listing: item.id }),
            { direction },
            {
                preserveScroll: true,
                onFinish: () => setActionLoadingId(null),
            }
        );
    };

    const handleToggleVisibility = (item: AdminListingItem) => {
        const nextIntent = item.status === 1 ? 'hide' : 'publish';
        setActionLoadingId(item.id);
        router.patch(
            route('admin.listings.visibility', { section, listing: item.id }),
            { intent: nextIntent },
            {
                preserveScroll: true,
                onFinish: () => setActionLoadingId(null),
            }
        );
    };

    // Thumbnail aspect ratio class based on section
    const thumbnailRatioClass =
        section === 'books'
            ? 'aspect-[3/4]'
            : section === 'cards'
              ? 'aspect-square'
              : 'aspect-[4/3]';

    return (
        <AdminLayout
            title={`${sectionLabel} - Kampuram Admin`}
            breadcrumbs={[{ label: sectionLabel }]}
        >
            <div className="space-y-6">
                {/* Header bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-[#282723]">
                                {sectionLabel}
                            </h1>
                            <span className="rounded-full bg-[#EAE6DE] px-2.5 py-0.5 text-xs font-semibold text-[#5A5750]">
                                {listings.length} {listings.length === 1 ? itemName : itemName + 's'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-[#77746E]">
                            Manage entries, order of display on the website, and live visibility.
                        </p>
                    </div>

                    <Link
                        href={route('admin.listings.create', { section })}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ED6A2F] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#D95821] focus:ring-2 focus:ring-[#ED6A2F] focus:ring-offset-2 focus:outline-hidden"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add {itemName}</span>
                    </Link>
                </div>

                {/* Media & Digi World Section Filters (All / Images / Videos) */}
                {(section === 'media' || section === 'digi-world') && (
                    <div className="flex items-center gap-1.5 border-b border-[#E8E4DD] pb-3 text-xs">
                        <Link
                            href={route('admin.listings.index', { section, filter: 'all' })}
                            className={`rounded-lg px-3 py-1.5 font-medium transition ${
                                filter === 'all'
                                    ? 'bg-[#282723] text-white shadow-xs'
                                    : 'text-[#66625B] hover:bg-[#EFECE6]'
                            }`}
                        >
                            {section === 'digi-world' ? 'All Services' : 'All Media'}
                        </Link>
                        <Link
                            href={route('admin.listings.index', { section, filter: 'images' })}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                                filter === 'images'
                                    ? 'bg-[#282723] text-white shadow-xs'
                                    : 'text-[#66625B] hover:bg-[#EFECE6]'
                            }`}
                        >
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span>Images only</span>
                        </Link>
                        <Link
                            href={route('admin.listings.index', { section, filter: 'videos' })}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                                filter === 'videos'
                                    ? 'bg-[#282723] text-white shadow-xs'
                                    : 'text-[#66625B] hover:bg-[#EFECE6]'
                            }`}
                        >
                            <FileVideo className="h-3.5 w-3.5" />
                            <span>Videos only</span>
                        </Link>
                    </div>
                )}

                {/* Listings List */}
                {listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDD8D0] bg-white py-16 px-4 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F4] text-[#9A968E]">
                            <Store className="h-7 w-7" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-[#282723]">
                            No {itemName}s yet
                        </h3>
                        <p className="mt-1 max-w-sm text-xs text-[#77746E]">
                            Get started by creating your first entry. It will remain hidden until you choose to publish.
                        </p>
                        <Link
                            href={route('admin.listings.create', { section })}
                            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#ED6A2F] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#D95821]"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add {itemName}</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {listings.map((item) => {
                            const isVisible = item.status === 1;
                            const isActionLoading = actionLoadingId === item.id;
                            const displayImage = item.media_type === 2 ? (item.poster_url || item.media_url) : item.media_url;

                            return (
                                <div
                                    key={item.id}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-xs transition hover:border-[#DDD8D0] ${
                                        isVisible ? 'border-[#E8E4DD]' : 'border-[#EAE6DE] opacity-90'
                                    }`}
                                >
                                    {/* Thumbnail + Details */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Thumbnail */}
                                        <div
                                            className={`relative w-16 sm:w-20 shrink-0 overflow-hidden rounded-lg border border-[#E8E4DD] bg-[#FAF8F4] ${thumbnailRatioClass}`}
                                        >
                                            {displayImage ? (
                                                <img
                                                    src={displayImage}
                                                    alt={item.title}
                                                    className={`h-full w-full ${section === 'digi-world' ? 'object-contain bg-[#f0ebe2]' : 'object-cover'}`}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[#A8A49C]">
                                                    <ImageIcon className="h-5 w-5" />
                                                </div>
                                            )}

                                            {item.media_type === 2 && (
                                                <div className="absolute top-1 right-1 rounded-sm bg-black/70 p-0.5 text-white">
                                                    <Film className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Title, price & description */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate text-sm font-bold text-[#282723]">
                                                    {item.title}
                                                </h3>
                                                {/* Visibility pill */}
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                        isVisible
                                                            ? 'bg-emerald-100/80 text-emerald-800'
                                                            : 'bg-[#EAE6DE] text-[#66625B]'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            isVisible ? 'bg-emerald-600' : 'bg-stone-400'
                                                        }`}
                                                    />
                                                    {isVisible ? 'Visible' : 'Hidden'}
                                                </span>
                                            </div>

                                            {/* Price / Note */}
                                            {item.price !== null && item.price !== undefined && (
                                                <div className="mt-0.5 text-xs font-semibold text-[#BD4714]">
                                                    ₹{Number(item.price).toLocaleString('en-IN')}
                                                    {section === 'cards' && (
                                                        <span className="text-[11px] font-normal text-[#88847D]">
                                                            {' '}
                                                            per card
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {item.description && (
                                                <p className="mt-1 line-clamp-1 text-xs text-[#77746E]">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons & Reordering */}
                                    <div className="flex items-center justify-between sm:justify-end gap-2 border-t border-[#F2EFEA] pt-3 sm:border-t-0 sm:pt-0">
                                        {/* Reorder Buttons */}
                                        <div className="flex items-center gap-1 bg-[#FAF8F4] p-1 rounded-lg border border-[#EAE6DE]">
                                            <button
                                                type="button"
                                                onClick={() => handleReorder(item, 'up')}
                                                disabled={!item.can_move_up || isActionLoading}
                                                title="Move up"
                                                className="p-1 rounded-md text-[#66625B] hover:bg-white hover:text-[#282723] hover:shadow-2xs disabled:opacity-30 disabled:pointer-events-none transition"
                                            >
                                                <ArrowUp className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleReorder(item, 'down')}
                                                disabled={!item.can_move_down || isActionLoading}
                                                title="Move down"
                                                className="p-1 rounded-md text-[#66625B] hover:bg-white hover:text-[#282723] hover:shadow-2xs disabled:opacity-30 disabled:pointer-events-none transition"
                                            >
                                                <ArrowDown className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        {/* Toggle Visibility */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleVisibility(item)}
                                            disabled={isActionLoading}
                                            title={isVisible ? 'Hide from website' : 'Publish to website'}
                                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-2xs transition disabled:opacity-50 ${
                                                isVisible
                                                    ? 'border-[#DDD8D0] bg-white text-[#55524B] hover:bg-[#FAF8F4] hover:text-amber-800'
                                                    : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {isVisible ? (
                                                <>
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                    <span>Hide</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                                    <span>Publish</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Edit Link */}
                                        <Link
                                            href={route('admin.listings.edit', {
                                                section,
                                                listing: item.id,
                                            })}
                                            className="inline-flex items-center gap-1 rounded-lg border border-[#DDD8D0] bg-white px-3 py-1.5 text-xs font-semibold text-[#282723] shadow-2xs transition hover:bg-[#FAF8F4] hover:text-[#BD4714]"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                            <span>Edit</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
