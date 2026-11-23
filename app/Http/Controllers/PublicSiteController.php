<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Inertia\Inertia;
use Inertia\Response;

class PublicSiteController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('site/home');
    }

    public function media(): Response
    {
        $listings = $this->getSectionListings(Listing::SECTION_MEDIA, 'media');

        return Inertia::render('site/media', [
            'listings' => $listings,
        ]);
    }

    public function cards(): Response
    {
        $listings = $this->getSectionListings(Listing::SECTION_CARDS, 'cards');

        return Inertia::render('site/cards', [
            'listings' => $listings,
        ]);
    }

    public function books(): Response
    {
        $listings = $this->getSectionListings(Listing::SECTION_BOOKS, 'books');

        return Inertia::render('site/books', [
            'listings' => $listings,
        ]);
    }

    public function digiWorld(): Response
    {
        $services = Listing::section(Listing::SECTION_DIGI_WORLD)
            ->published()
            ->ordered()
            ->get()
            ->map(function (Listing $item) {
                $mainPath = null;
                if ($item->media_path) {
                    $mainPath = route('media.show', ['listing' => $item->id, 'variant' => 'main'], false);
                }

                $posterPath = null;
                if ($item->poster_path) {
                    $posterPath = route('media.show', ['listing' => $item->id, 'variant' => 'poster'], false);
                }

                $formats = [];
                if (! empty($item->service_formats)) {
                    $formats = array_values(array_filter(array_map('trim', explode("\n", $item->service_formats))));
                }

                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'formats' => $formats,
                    'type' => $item->isVideo() ? 'video' : ($item->isImage() ? 'image' : null),
                    'image' => $item->isVideo() ? ($posterPath ?: $mainPath) : $mainPath,
                    'videoUrl' => $item->isVideo() ? $mainPath : null,
                    'poster' => $posterPath,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('site/digi-world', [
            'services' => $services,
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('site/contact');
    }

    /**
     * Helper to load and format published catalogue listings for Media, Cards, and Books.
     */
    protected function getSectionListings(int $sectionId, string $sectionSlug): array
    {
        return Listing::where('section', $sectionId)
            ->published()
            ->ordered()
            ->get()
            ->map(function (Listing $item) use ($sectionSlug) {
                $filePath = $item->media_path
                    ? route('media.show', ['listing' => $item->id, 'variant' => 'main'], false)
                    : '';

                $posterPath = $item->poster_path
                    ? route('media.show', ['listing' => $item->id, 'variant' => 'poster'], false)
                    : null;

                return [
                    'id' => (string) $item->id,
                    'section' => $sectionSlug,
                    'type' => $item->isVideo() ? 'video' : 'image',
                    'heading' => $item->title,
                    'description' => $item->description,
                    'price' => $item->price !== null ? (float) $item->price : null,
                    'file' => [
                        'path' => $filePath,
                        'originalName' => $item->media_original_name ?: basename($item->media_path ?? ''),
                        'mimeType' => $item->media_mime_type ?: 'image/jpeg',
                        'sizeBytes' => $item->media_size_bytes ?: 0,
                    ],
                    'thumbnail' => $posterPath ? [
                        'path' => $posterPath,
                        'originalName' => 'poster.jpg',
                        'mimeType' => 'image/jpeg',
                        'sizeBytes' => 0,
                    ] : null,
                    'alt' => $item->title,
                    'displayOrder' => $item->sort_order,
                    'status' => 'published',
                    'dateAdded' => $item->created_at?->toIso8601String() ?? now()->toIso8601String(),
                ];
            })
            ->all();
    }
}
