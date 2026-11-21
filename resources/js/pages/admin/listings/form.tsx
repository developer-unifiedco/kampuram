import InputError from '@/components/input-error';
import { AdminLayout } from '@/layouts/admin-layout';
import { AdminListingItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
    FileVideo,
    Film,
    Image as ImageIcon,
    Save,
    Sparkles,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { ChangeEvent, FormEventHandler, useEffect, useRef, useState } from 'react';

interface ListingFormProps {
    mode: 'create' | 'edit';
    section: string;
    sectionLabel: string;
    itemName: string;
    listing: AdminListingItem | null;
}

export default function ListingForm({
    mode,
    section,
    sectionLabel,
    itemName,
    listing,
}: ListingFormProps) {
    const isEdit = mode === 'edit';
    const isVisible = listing?.status === 1;

    // Form state
    const { data, setData, errors, processing, progress } = useForm({
        _method: isEdit ? 'PATCH' : 'POST',
        title: listing?.title || '',
        description: listing?.description || '',
        service_formats: listing?.service_formats || '',
        price: listing?.price !== null && listing?.price !== undefined ? String(listing.price) : '',
        media: null as File | null,
        poster: null as File | null,
        remove_media: false as boolean,
        intent: isVisible ? 'save_changes' : 'save_hidden',
    });

    // Local object URLs for previewing newly chosen files
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(listing?.media_url || null);
    const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(listing?.poster_url || null);
    const [selectedMediaType, setSelectedMediaType] = useState<number | null>(listing?.media_type || null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);

    // Clean up object URLs on change or unmount
    useEffect(() => {
        return () => {
            if (mediaPreviewUrl && mediaPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(mediaPreviewUrl);
            }
            if (posterPreviewUrl && posterPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(posterPreviewUrl);
            }
        };
    }, []);

    const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revoke prior blob URL
        if (mediaPreviewUrl && mediaPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(mediaPreviewUrl);
        }

        const isVideo = file.type.startsWith('video/');
        const newUrl = URL.createObjectURL(file);
        setMediaPreviewUrl(newUrl);
        setSelectedMediaType(isVideo ? 2 : 1);
        setData((prev) => ({ ...prev, media: file, remove_media: false }));

        // Attempt automated poster grab for video if supported
        if (isVideo && !data.poster) {
            captureVideoFrame(newUrl);
        }
    };

    const handlePosterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (posterPreviewUrl && posterPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(posterPreviewUrl);
        }

        const newUrl = URL.createObjectURL(file);
        setPosterPreviewUrl(newUrl);
        setData('poster', file);
    };

    const captureVideoFrame = (videoUrl: string) => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.currentTime = 0.5;

        video.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const posterFile = new File([blob], 'poster-preview.jpg', {
                                type: 'image/jpeg',
                            });
                            const posterUrl = URL.createObjectURL(blob);
                            setPosterPreviewUrl(posterUrl);
                            setData('poster', posterFile);
                        }
                    },
                    'image/jpeg',
                    0.85
                );
            }
        };
    };

    const handleRemoveMedia = () => {
        if (mediaPreviewUrl && mediaPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(mediaPreviewUrl);
        }
        if (posterPreviewUrl && posterPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(posterPreviewUrl);
        }
        setMediaPreviewUrl(null);
        setPosterPreviewUrl(null);
        setSelectedMediaType(null);
        setData((prev) => ({
            ...prev,
            media: null,
            poster: null,
            remove_media: true,
        }));
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (posterInputRef.current) posterInputRef.current.value = '';
    };

    const submitWithIntent = (intent: string) => {
        const url = isEdit
            ? route('admin.listings.update', { section, listing: listing!.id })
            : route('admin.listings.store', { section });

        // Use router.post with multipart data including _method override for PATCH
        router.post(
            url,
            {
                ...data,
                intent,
                _method: isEdit ? 'PATCH' : 'POST',
            },
            {
                forceFormData: true,
                preserveScroll: true,
            }
        );
    };

    const handleDelete = () => {
        if (!listing) return;
        setDeleting(true);
        router.delete(route('admin.listings.destroy', { section, listing: listing.id }), {
            onFinish: () => {
                setDeleting(false);
                setDeleteModalOpen(false);
            },
        });
    };

    // Format preview price
    const previewPriceFormatted = data.price
        ? `₹${Number(data.price).toLocaleString('en-IN')}`
        : null;

    // Aspect ratio preview class
    const previewRatioClass =
        section === 'books'
            ? 'aspect-[3/4]'
            : section === 'cards'
              ? 'aspect-square'
              : 'aspect-[4/3]';

    return (
        <AdminLayout
            title={`${isEdit ? 'Edit' : 'Add'} ${itemName} - Kampuram Admin`}
            breadcrumbs={[
                { label: sectionLabel, href: route('admin.listings.index', { section }) },
                { label: `${isEdit ? 'Edit' : 'Add'} ${itemName}` },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('admin.listings.index', { section })}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDD8D0] bg-white text-[#55524B] shadow-2xs transition hover:bg-[#FAF8F4]"
                                title="Back to listing"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight text-[#282723]">
                                {isEdit ? `Edit ${itemName}` : `Add New ${itemName}`}
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-[#77746E]">
                            Fill in the details below. You can preview the customer card before saving.
                        </p>
                    </div>

                    {isEdit && (
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                isVisible
                                    ? 'bg-emerald-100/90 text-emerald-800'
                                    : 'bg-[#EAE6DE] text-[#66625B]'
                            }`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    isVisible ? 'bg-emerald-600' : 'bg-stone-400'
                                }`}
                            />
                            {isVisible ? 'Currently Visible' : 'Currently Hidden'}
                        </span>
                    )}
                </div>

                {/* Main 2-column layout: Form on Left, Live Preview on Right */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left Column: Form (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="rounded-2xl border border-[#E8E4DD] bg-white p-6 shadow-xs sm:p-8">
                            <div className="space-y-5">
                                {/* Title */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-xs font-semibold tracking-wider text-[#55524B] uppercase"
                                    >
                                        {section === 'digi-world' ? 'Service Name' : 'Title'} *
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        maxLength={255}
                                        required
                                        className="mt-1.5 block w-full rounded-xl border border-[#DDD8D0] bg-[#FAF8F4]/50 py-2.5 px-3.5 text-sm text-[#282723] transition focus:border-[#ED6A2F] focus:bg-white focus:ring-2 focus:ring-[#ED6A2F]/20 focus:outline-hidden"
                                        placeholder={
                                            section === 'digi-world'
                                                ? 'e.g. Social media ads'
                                                : section === 'cards'
                                                  ? 'e.g. Royal Gold Floral Invitation'
                                                  : section === 'books'
                                                    ? 'e.g. The Story of Kerala'
                                                    : 'e.g. Café opening creative'
                                        }
                                    />
                                    <InputError message={errors.title} className="mt-1.5" />
                                </div>

                                {/* Description / Author */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-xs font-semibold tracking-wider text-[#55524B] uppercase"
                                    >
                                        {section === 'books'
                                            ? 'Author or Description'
                                            : 'Description'}
                                        {section === 'digi-world' ? ' *' : ' (Optional)'}
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        maxLength={2000}
                                        className="mt-1.5 block w-full rounded-xl border border-[#DDD8D0] bg-[#FAF8F4]/50 py-2.5 px-3.5 text-sm text-[#282723] transition focus:border-[#ED6A2F] focus:bg-white focus:ring-2 focus:ring-[#ED6A2F]/20 focus:outline-hidden"
                                        placeholder={
                                            section === 'books'
                                                ? 'e.g. Authored by M. Mukundan. A gripping narrative...'
                                                : 'Provide a brief summary for customers...'
                                        }
                                    />
                                    <InputError message={errors.description} className="mt-1.5" />
                                </div>

                                {/* Price (Media, Cards, Books only) */}
                                {section !== 'digi-world' && (
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="block text-xs font-semibold tracking-wider text-[#55524B] uppercase"
                                        >
                                            Price in Rupees (₹) (Optional)
                                        </label>
                                        <div className="relative mt-1.5">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-[#8A867E]">
                                                ₹
                                            </span>
                                            <input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="99999999.99"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className="block w-full rounded-xl border border-[#DDD8D0] bg-[#FAF8F4]/50 py-2.5 pr-3 pl-8 text-sm text-[#282723] transition focus:border-[#ED6A2F] focus:bg-white focus:ring-2 focus:ring-[#ED6A2F]/20 focus:outline-hidden"
                                                placeholder="e.g. 1500"
                                            />
                                        </div>
                                        <p className="mt-1 text-[11px] text-[#8A867E]">
                                            Leave empty if pricing is on request.
                                            {section === 'cards' && ' For cards, "per card" is shown automatically.'}
                                        </p>
                                        <InputError message={errors.price} className="mt-1.5" />
                                    </div>
                                )}

                                {/* Digi World Examples / Service Formats */}
                                {section === 'digi-world' && (
                                    <div>
                                        <label
                                            htmlFor="service_formats"
                                            className="block text-xs font-semibold tracking-wider text-[#55524B] uppercase"
                                        >
                                            Examples of Formats / Sub-services (Optional)
                                        </label>
                                        <textarea
                                            id="service_formats"
                                            rows={3}
                                            value={data.service_formats}
                                            onChange={(e) => setData('service_formats', e.target.value)}
                                            maxLength={1000}
                                            className="mt-1.5 block w-full rounded-xl border border-[#DDD8D0] bg-[#FAF8F4]/50 py-2.5 px-3.5 text-sm text-[#282723] font-mono text-xs transition focus:border-[#ED6A2F] focus:bg-white focus:ring-2 focus:ring-[#ED6A2F]/20 focus:outline-hidden"
                                            placeholder="Promotional posts&#10;Event announcements&#10;Social media creatives"
                                        />
                                        <p className="mt-1 text-[11px] text-[#8A867E]">
                                            Enter one bullet point per line.
                                        </p>
                                        <InputError message={errors.service_formats} className="mt-1.5" />
                                    </div>
                                )}

                                {/* Media File Upload */}
                                <div className="border-t border-[#F0ECE6] pt-5">
                                    <label className="block text-xs font-semibold tracking-wider text-[#55524B] uppercase">
                                        {section === 'books'
                                            ? 'Cover Image'
                                            : section === 'media'
                                              ? 'Artwork Image or Motion Video'
                                              : 'Card / Showcase Image'}
                                        {section !== 'digi-world' && ' (Required to publish)'}
                                    </label>

                                    {/* Upload box */}
                                    <div className="mt-2">
                                        {mediaPreviewUrl && !data.remove_media ? (
                                            <div className="flex items-center justify-between rounded-xl border border-[#E8E4DD] bg-[#FAF8F4] p-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-[#DDD8D0] text-[#BD4714]">
                                                        {selectedMediaType === 2 ? (
                                                            <FileVideo className="h-5 w-5" />
                                                        ) : (
                                                            <ImageIcon className="h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-semibold text-[#282723]">
                                                            {data.media?.name ||
                                                                listing?.media_original_name ||
                                                                'Attached Media File'}
                                                        </div>
                                                        <div className="text-[11px] text-[#8A867E]">
                                                            {selectedMediaType === 2 ? 'Video' : 'Image'}
                                                            {data.media &&
                                                                ` • ${(data.media.size / 1024 / 1024).toFixed(2)} MB`}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="rounded-lg border border-[#DDD8D0] bg-white px-2.5 py-1 text-xs font-medium text-[#45423B] shadow-2xs hover:bg-[#FAF8F4]"
                                                    >
                                                        Replace
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveMedia}
                                                        className="rounded-lg border border-rose-200 bg-white p-1 text-rose-600 shadow-2xs hover:bg-rose-50"
                                                        title="Remove media"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DDD8D0] bg-[#FAF8F4]/50 py-8 px-4 text-center transition hover:border-[#ED6A2F] hover:bg-[#FAF8F4]"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#8A867E] shadow-2xs group-hover:text-[#ED6A2F]">
                                                    <Upload className="h-5 w-5" />
                                                </div>
                                                <p className="mt-2 text-xs font-semibold text-[#282723]">
                                                    Click to select {section === 'media' ? 'an image or video' : 'an image'}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-[#8A867E]">
                                                    {section === 'media'
                                                        ? 'JPG, PNG, WebP up to 5 MB • MP4, WebM up to 20 MB'
                                                        : 'JPG, PNG, WebP up to 5 MB'}
                                                    {section === 'books' && ' • Minimum 600px width'}
                                                </p>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleMediaChange}
                                            accept={
                                                section === 'media'
                                                    ? 'image/jpeg,image/png,image/webp,video/mp4,video/webm'
                                                    : 'image/jpeg,image/png,image/webp'
                                            }
                                            className="hidden"
                                        />
                                        <InputError message={errors.media} className="mt-1.5" />
                                    </div>

                                    {/* Upload Progress */}
                                    {progress && (
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-[#8A867E]">
                                                <span>Uploading media...</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#EAE6DE]">
                                                <div
                                                    className="h-full bg-[#ED6A2F] transition-all"
                                                    style={{ width: `${progress.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Video Poster Image Input (For Media section videos) */}
                                    {selectedMediaType === 2 && (
                                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Film className="h-4 w-4 text-amber-800" />
                                                    <span className="text-xs font-bold text-amber-900">
                                                        Video Poster Thumbnail *
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => posterInputRef.current?.click()}
                                                    className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-900 shadow-2xs hover:bg-amber-50"
                                                >
                                                    {posterPreviewUrl ? 'Change Poster' : 'Choose Poster'}
                                                </button>
                                            </div>
                                            <p className="mt-1 text-[11px] text-amber-800">
                                                A poster image is required for published videos. An initial frame was captured automatically, or you can select a custom image (JPG, PNG, WebP up to 5 MB).
                                            </p>
                                            <input
                                                ref={posterInputRef}
                                                type="file"
                                                onChange={handlePosterChange}
                                                accept="image/jpeg,image/png,image/webp"
                                                className="hidden"
                                            />
                                            <InputError message={errors.poster} className="mt-1.5" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Action Buttons */}
                            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#F0ECE6] pt-6">
                                {isEdit && isVisible ? (
                                    <>
                                        {/* Visible item: Save changes or Hide */}
                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => submitWithIntent('save_changes')}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#ED6A2F] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#D95821] focus:ring-2 focus:ring-[#ED6A2F] focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>{processing ? 'Saving...' : 'Save changes'}</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => submitWithIntent('hide')}
                                            className="inline-flex items-center gap-2 rounded-xl border border-[#DDD8D0] bg-white px-4 py-2.5 text-xs font-semibold text-[#55524B] shadow-2xs transition hover:bg-[#FAF8F4] hover:text-amber-800 disabled:opacity-50"
                                        >
                                            <EyeOff className="h-4 w-4" />
                                            <span>Hide from website</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* New or Hidden item: Save hidden or Publish */}
                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => submitWithIntent('publish')}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#16834A] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#126B3D] focus:ring-2 focus:ring-[#16834A] focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>{processing ? 'Publishing...' : 'Publish to website'}</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => submitWithIntent('save_hidden')}
                                            className="inline-flex items-center gap-2 rounded-xl border border-[#DDD8D0] bg-white px-4 py-2.5 text-xs font-semibold text-[#55524B] shadow-2xs transition hover:bg-[#FAF8F4] disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>{processing ? 'Saving...' : 'Save as hidden'}</span>
                                        </button>
                                    </>
                                )}

                                <Link
                                    href={route('admin.listings.index', { section })}
                                    className="ml-auto text-xs font-medium text-[#77746E] hover:text-[#282723]"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>

                        {/* Edit Mode: Permanent Deletion Section */}
                        {isEdit && (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-rose-950">Danger Zone</h3>
                                        <p className="mt-0.5 text-xs text-rose-800/80">
                                            Permanently delete this entry and its associated media files from the server.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setDeleteModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-3.5 py-2 text-xs font-semibold text-rose-700 shadow-2xs hover:bg-rose-50 hover:text-rose-800"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete permanently</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Live Website Preview (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#55524B] uppercase">
                                    <Sparkles className="h-3.5 w-3.5 text-[#ED6A2F]" />
                                    <span>Live Customer Preview</span>
                                </div>
                                <span className="text-[11px] text-[#8A867E]">
                                    {sectionLabel} format
                                </span>
                            </div>

                            {/* Card Container styled like public site */}
                            <div className="overflow-hidden rounded-2xl border border-[#E8E4DD] bg-white shadow-md">
                                {/* Media Image / Video Frame */}
                                <div
                                    className={`relative w-full overflow-hidden bg-[#FAF8F4] ${previewRatioClass}`}
                                >
                                    {selectedMediaType === 2 ? (
                                        posterPreviewUrl ? (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={posterPreviewUrl}
                                                    alt="Video poster"
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#282723] shadow-lg">
                                                        <Film className="h-6 w-6 ml-0.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : mediaPreviewUrl ? (
                                            <video
                                                ref={videoRef}
                                                src={mediaPreviewUrl}
                                                controls
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[#A8A49C]">
                                                <Film className="h-10 w-10" />
                                            </div>
                                        )
                                    ) : mediaPreviewUrl && !data.remove_media ? (
                                        <img
                                            src={mediaPreviewUrl}
                                            alt={data.title || 'Preview'}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[#A8A49C]">
                                            <ImageIcon className="h-10 w-10" />
                                            <span className="text-[11px]">No image selected</span>
                                        </div>
                                    )}

                                    {/* Tag */}
                                    <div className="absolute top-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#BD4714] uppercase shadow-xs">
                                        {sectionLabel}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5">
                                    <h4 className="text-base font-bold text-[#282723]">
                                        {data.title || 'Untitled Item'}
                                    </h4>

                                    {/* Price */}
                                    {section !== 'digi-world' && previewPriceFormatted && (
                                        <div className="mt-1 text-sm font-bold text-[#BD4714]">
                                            {previewPriceFormatted}
                                            {section === 'cards' && (
                                                <span className="text-xs font-normal text-[#77746E]">
                                                    {' '}
                                                    per card
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Description */}
                                    {data.description && (
                                        <p className="mt-2 text-xs leading-relaxed text-[#77746E]">
                                            {data.description}
                                        </p>
                                    )}

                                    {/* Digi World Formats */}
                                    {section === 'digi-world' && data.service_formats && (
                                        <ul className="mt-3 space-y-1 text-xs text-[#55524B]">
                                            {data.service_formats
                                                .split('\n')
                                                .filter((line) => line.trim())
                                                .map((format, idx) => (
                                                    <li key={idx} className="flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#ED6A2F]" />
                                                        <span>{format}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}

                                    {/* WhatsApp enquiry button */}
                                    <div className="mt-5 border-t border-[#F0ECE6] pt-4">
                                        <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#16834A] py-2.5 text-xs font-semibold text-white shadow-xs">
                                            <span>Enquire on WhatsApp</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Permanent Deletion Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-[#DDD8D0] bg-white p-6 shadow-xl">
                        <div className="flex items-center gap-3 text-rose-600">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-[#282723]">Delete Permanently?</h3>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-[#77746E]">
                            Are you sure you want to permanently delete{' '}
                            <strong className="text-[#282723]">"{listing?.title}"</strong>? This will remove the listing and its uploaded media files. This action cannot be undone.
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setDeleteModalOpen(false)}
                                className="rounded-xl border border-[#DDD8D0] bg-white px-4 py-2 text-xs font-semibold text-[#55524B] shadow-2xs hover:bg-[#FAF8F4]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete permanently'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
