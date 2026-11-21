<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Services\ListingMediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function __construct(
        protected ListingMediaService $mediaService
    ) {}

    /**
     * Display a listing of items for the specified section.
     */
    public function index(Request $request, string $section): Response
    {
        $sectionId = $this->resolveSectionId($section);

        $query = Listing::where('section', $sectionId)->ordered();

        // Optional media filter for Media section
        $mediaFilter = $request->query('filter', 'all');
        if ($sectionId === Listing::SECTION_MEDIA) {
            if ($mediaFilter === 'images') {
                $query->where('media_type', Listing::MEDIA_IMAGE);
            } elseif ($mediaFilter === 'videos') {
                $query->where('media_type', Listing::MEDIA_VIDEO);
            }
        }

        $allSectionListings = Listing::where('section', $sectionId)->ordered()->get(['id']);
        $allIds = $allSectionListings->pluck('id')->values()->all();
        $totalCount = count($allIds);

        $listings = $query->get()->map(function (Listing $item) use ($allIds, $totalCount) {
            $index = array_search($item->id, $allIds, true);

            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'service_formats' => $item->service_formats,
                'price' => $item->price,
                'status' => $item->status,
                'status_label' => $item->isPublished() ? 'Visible' : 'Hidden',
                'media_type' => $item->media_type,
                'media_original_name' => $item->media_original_name,
                'media_url' => $this->resolveMediaUrl($item, 'main'),
                'poster_url' => $this->resolveMediaUrl($item, 'poster'),
                'sort_order' => $item->sort_order,
                'can_move_up' => $index !== false && $index > 0,
                'can_move_down' => $index !== false && $index < ($totalCount - 1),
                'created_at' => $item->created_at?->toIso8601String(),
            ];
        });

        return Inertia::render('admin/listings/index', [
            'section' => $section,
            'sectionLabel' => Listing::SECTION_LABELS[$sectionId],
            'itemName' => Listing::SECTION_ITEM_NAMES[$sectionId],
            'filter' => $mediaFilter,
            'listings' => $listings,
        ]);
    }

    /**
     * Show the form for creating a new listing.
     */
    public function create(Request $request, string $section): Response
    {
        $sectionId = $this->resolveSectionId($section);

        return Inertia::render('admin/listings/form', [
            'mode' => 'create',
            'section' => $section,
            'sectionLabel' => Listing::SECTION_LABELS[$sectionId],
            'itemName' => Listing::SECTION_ITEM_NAMES[$sectionId],
            'listing' => null,
        ]);
    }

    /**
     * Store a newly created listing in storage.
     */
    public function store(Request $request, string $section): RedirectResponse
    {
        $sectionId = $this->resolveSectionId($section);
        $intent = $request->input('intent', 'save_hidden');
        $isPublish = $intent === 'publish';

        $validated = $this->validateListingInput($request, $sectionId, isCreate: true, isPublish: $isPublish);

        $storedMedia = null;
        $storedPosterPath = null;

        if ($request->hasFile('media')) {
            $storedMedia = $this->mediaService->storeMedia($request->file('media'));
        }

        if ($request->hasFile('poster')) {
            $storedPosterPath = $this->mediaService->storePoster($request->file('poster'));
        }

        $nextSort = (Listing::where('section', $sectionId)->max('sort_order') ?? -1) + 1;

        $listing = Listing::create([
            'section' => $sectionId,
            'title' => trim($validated['title']),
            'description' => $validated['description'] ?? null,
            'service_formats' => $sectionId === Listing::SECTION_DIGI_WORLD ? ($validated['service_formats'] ?? null) : null,
            'price' => $sectionId !== Listing::SECTION_DIGI_WORLD ? $validated['price'] : null,
            'media_type' => $storedMedia['media_type'] ?? null,
            'media_path' => $storedMedia['path'] ?? null,
            'media_original_name' => $storedMedia['original_name'] ?? null,
            'media_mime_type' => $storedMedia['mime_type'] ?? null,
            'media_size_bytes' => $storedMedia['size_bytes'] ?? null,
            'poster_path' => $storedPosterPath,
            'status' => $isPublish ? Listing::STATUS_PUBLISHED : Listing::STATUS_HIDDEN,
            'sort_order' => $nextSort,
        ]);

        $itemName = ucfirst(Listing::SECTION_ITEM_NAMES[$sectionId]);
        $actionVerb = $isPublish ? 'published' : 'saved';

        return redirect()->route('admin.listings.index', ['section' => $section])
            ->with('success', "{$itemName} {$actionVerb} successfully.");
    }

    /**
     * Show the form for editing the specified listing.
     */
    public function edit(Request $request, string $section, Listing $listing): Response
    {
        $sectionId = $this->resolveSectionListing($section, $listing);

        return Inertia::render('admin/listings/form', [
            'mode' => 'edit',
            'section' => $section,
            'sectionLabel' => Listing::SECTION_LABELS[$sectionId],
            'itemName' => Listing::SECTION_ITEM_NAMES[$sectionId],
            'listing' => [
                'id' => $listing->id,
                'title' => $listing->title,
                'description' => $listing->description,
                'service_formats' => $listing->service_formats,
                'price' => $listing->price,
                'status' => $listing->status,
                'status_label' => $listing->isPublished() ? 'Visible' : 'Hidden',
                'media_type' => $listing->media_type,
                'media_original_name' => $listing->media_original_name,
                'media_url' => $this->resolveMediaUrl($listing, 'main'),
                'poster_url' => $this->resolveMediaUrl($listing, 'poster'),
            ],
        ]);
    }

    /**
     * Update the specified listing in storage.
     */
    public function update(Request $request, string $section, Listing $listing): RedirectResponse
    {
        $sectionId = $this->resolveSectionListing($section, $listing);

        $intent = $request->input('intent', 'save_changes');
        $oldFilesToDelete = [];

        DB::transaction(function () use ($request, $listing, $sectionId, $intent, &$oldFilesToDelete) {
            /** @var Listing $lockedListing */
            $lockedListing = Listing::where('id', $listing->id)->lockForUpdate()->firstOrFail();

            $isPublish = $intent === 'publish' || ($intent === 'save_changes' && $lockedListing->isPublished());
            $validated = $this->validateListingInput(
                $request,
                $sectionId,
                isCreate: false,
                isPublish: $isPublish,
                existingListing: $lockedListing
            );

            $removeMedia = $request->boolean('remove_media');
            $newMedia = null;
            $newPosterPath = null;

            if ($request->hasFile('media')) {
                $newMedia = $this->mediaService->storeMedia($request->file('media'));
            }

            if ($request->hasFile('poster')) {
                $newPosterPath = $this->mediaService->storePoster($request->file('poster'));
            }

            $updateData = [
                'title' => trim($validated['title']),
                'description' => $validated['description'] ?? null,
                'service_formats' => $sectionId === Listing::SECTION_DIGI_WORLD ? ($validated['service_formats'] ?? null) : null,
                'price' => $sectionId !== Listing::SECTION_DIGI_WORLD ? $validated['price'] : null,
            ];

            if ($intent === 'publish') {
                $updateData['status'] = Listing::STATUS_PUBLISHED;
            } elseif ($intent === 'hide') {
                $updateData['status'] = Listing::STATUS_HIDDEN;
            }

            if ($removeMedia) {
                $oldFilesToDelete[] = $lockedListing->media_path;
                $oldFilesToDelete[] = $lockedListing->poster_path;

                $updateData['media_type'] = null;
                $updateData['media_path'] = null;
                $updateData['media_original_name'] = null;
                $updateData['media_mime_type'] = null;
                $updateData['media_size_bytes'] = null;
                $updateData['poster_path'] = null;
            } elseif ($newMedia) {
                $oldFilesToDelete[] = $lockedListing->media_path;

                $updateData['media_type'] = $newMedia['media_type'];
                $updateData['media_path'] = $newMedia['path'];
                $updateData['media_original_name'] = $newMedia['original_name'];
                $updateData['media_mime_type'] = $newMedia['mime_type'];
                $updateData['media_size_bytes'] = $newMedia['size_bytes'];

                if ($newMedia['media_type'] === Listing::MEDIA_VIDEO) {
                    if ($newPosterPath) {
                        $oldFilesToDelete[] = $lockedListing->poster_path;
                        $updateData['poster_path'] = $newPosterPath;
                    }
                } else {
                    // Changing from video to image clears previous poster
                    $oldFilesToDelete[] = $lockedListing->poster_path;
                    $updateData['poster_path'] = null;
                }
            } elseif ($newPosterPath) {
                $oldFilesToDelete[] = $lockedListing->poster_path;
                $updateData['poster_path'] = $newPosterPath;
            }

            $lockedListing->update($updateData);
        });

        // After transaction commit, safely clean up unreferenced old files
        foreach ($oldFilesToDelete as $path) {
            if ($path) {
                $this->mediaService->deleteFiles($path);
            }
        }

        $itemName = ucfirst(Listing::SECTION_ITEM_NAMES[$sectionId]);
        $message = match ($intent) {
            'publish' => "{$itemName} published successfully.",
            'hide' => "{$itemName} hidden.",
            default => "{$itemName} updated successfully.",
        };

        return redirect()->route('admin.listings.index', ['section' => $section])
            ->with('success', $message);
    }

    /**
     * Change visibility (publish or hide) for the specified listing.
     */
    public function toggleVisibility(Request $request, string $section, Listing $listing): RedirectResponse
    {
        $sectionId = $this->resolveSectionListing($section, $listing);

        $intent = $request->input('intent');
        if (! in_array($intent, ['publish', 'hide'], true)) {
            throw ValidationException::withMessages(['intent' => 'Invalid visibility intent.']);
        }

        DB::transaction(function () use ($listing, $sectionId, $intent) {
            /** @var Listing $lockedListing */
            $lockedListing = Listing::where('id', $listing->id)->lockForUpdate()->firstOrFail();

            if ($intent === 'publish') {
                $this->checkPublishRequirements($lockedListing, $sectionId);
                $lockedListing->update(['status' => Listing::STATUS_PUBLISHED]);
            } else {
                $lockedListing->update(['status' => Listing::STATUS_HIDDEN]);
            }
        });

        $itemName = ucfirst(Listing::SECTION_ITEM_NAMES[$sectionId]);
        $statusText = $intent === 'publish' ? 'published' : 'hidden';

        return redirect()->back()->with('success', "{$itemName} {$statusText}.");
    }

    /**
     * Move listing up or down in sort order.
     */
    public function reorder(Request $request, string $section, Listing $listing): RedirectResponse
    {
        $sectionId = $this->resolveSectionListing($section, $listing);
        $direction = $request->input('direction');

        if (! in_array($direction, ['up', 'down'], true)) {
            throw ValidationException::withMessages(['direction' => 'Invalid direction.']);
        }

        DB::transaction(function () use ($listing, $sectionId, $direction) {
            $items = Listing::where('section', $sectionId)->ordered()->lockForUpdate()->get();

            $currentIndex = $items->search(fn ($item) => $item->id === $listing->id);
            if ($currentIndex === false) {
                return;
            }

            $targetIndex = $direction === 'up' ? $currentIndex - 1 : $currentIndex + 1;
            if ($targetIndex < 0 || $targetIndex >= $items->count()) {
                return;
            }

            // Normalize sort orders: 0, 1, 2...
            $reordered = $items->all();
            $temp = $reordered[$currentIndex];
            $reordered[$currentIndex] = $reordered[$targetIndex];
            $reordered[$targetIndex] = $temp;

            foreach ($reordered as $index => $item) {
                $item->update(['sort_order' => $index]);
            }
        });

        return redirect()->back()->with('success', 'Order updated.');
    }

    /**
     * Permanently delete the confirmed entry and clean up its files.
     */
    public function destroy(Request $request, string $section, Listing $listing): RedirectResponse
    {
        $sectionId = $this->resolveSectionListing($section, $listing);
        $filesToDelete = [];

        DB::transaction(function () use ($listing, &$filesToDelete) {
            /** @var Listing $lockedListing */
            $lockedListing = Listing::where('id', $listing->id)->lockForUpdate()->firstOrFail();

            $filesToDelete = array_filter([$lockedListing->media_path, $lockedListing->poster_path]);
            $lockedListing->delete();
        });

        foreach ($filesToDelete as $path) {
            $this->mediaService->deleteFiles($path);
        }

        $itemName = ucfirst(Listing::SECTION_ITEM_NAMES[$sectionId]);

        return redirect()->route('admin.listings.index', ['section' => $section])
            ->with('success', "{$itemName} permanently deleted.");
    }

    protected function resolveSectionId(string $section): int
    {
        $id = Listing::sectionIdFromSlug($section);
        if (! $id) {
            abort(404, 'Section not found.');
        }

        return $id;
    }

    protected function resolveSectionListing(string $section, Listing $listing): int
    {
        $sectionId = $this->resolveSectionId($section);
        if ($listing->section !== $sectionId) {
            abort(404, 'Listing not found in this section.');
        }

        return $sectionId;
    }

    protected function validateListingInput(
        Request $request,
        int $sectionId,
        bool $isCreate,
        bool $isPublish,
        ?Listing $existingListing = null
    ): array {
        $rules = [
            'title' => ['required', 'string', 'max:255', 'regex:/\S/'],
            'description' => ['nullable', 'string', 'max:2000'],
        ];

        if ($sectionId === Listing::SECTION_DIGI_WORLD) {
            $rules['service_formats'] = ['nullable', 'string', 'max:1000'];
        } else {
            $rules['price'] = ['nullable', 'numeric', 'min:0', 'max:99999999.99', 'decimal:0,2'];
        }

        if ($sectionId === Listing::SECTION_MEDIA) {
            $rules['media'] = ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/webm', 'max:20480'];
            $rules['poster'] = ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp', 'max:5120'];
        } else {
            $rules['media'] = ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp', 'max:5120'];
        }

        $validated = $request->validate($rules);

        // Normalize price: empty string maps to null
        $price = $request->input('price');
        $validated['price'] = ($price !== null && $price !== '') ? (float) $price : null;

        // Image size check for media image if not video
        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $mime = $file->getMimeType() ?: $file->getClientMimeType();
            $isVideo = str_starts_with($mime, 'video/');

            if (! $isVideo && $file->getSize() > 5242880) {
                throw ValidationException::withMessages([
                    'media' => 'The image must not be greater than 5 MB.',
                ]);
            }

            if ($isVideo && $sectionId !== Listing::SECTION_MEDIA) {
                throw ValidationException::withMessages([
                    'media' => 'Videos are only allowed for Kampuram Media.',
                ]);
            }
        }

        if ($isPublish) {
            $hasMedia = $request->hasFile('media') || ($existingListing && $existingListing->media_path && ! $request->boolean('remove_media'));
            $isVideo = false;

            if ($request->hasFile('media')) {
                $mime = $request->file('media')->getMimeType();
                $isVideo = str_starts_with($mime, 'video/');
            } elseif ($existingListing) {
                $isVideo = $existingListing->isVideo();
            }

            if ($sectionId !== Listing::SECTION_DIGI_WORLD && ! $hasMedia) {
                throw ValidationException::withMessages([
                    'media' => 'An image or media file is required to publish.',
                ]);
            }

            if ($isVideo) {
                $hasPoster = $request->hasFile('poster') || ($existingListing && $existingListing->poster_path && ! $request->boolean('remove_media'));
                if (! $hasPoster) {
                    throw ValidationException::withMessages([
                        'poster' => 'A poster image is required to publish a video.',
                    ]);
                }
            }

            if ($sectionId === Listing::SECTION_BOOKS && $request->hasFile('media')) {
                $info = @getimagesize($request->file('media')->getRealPath());
                if ($info && $info[0] < 600) {
                    throw ValidationException::withMessages([
                        'media' => 'Book cover image must be at least 600 pixels wide to publish.',
                    ]);
                }
            }

            if ($sectionId === Listing::SECTION_DIGI_WORLD && empty(trim($validated['description'] ?? ''))) {
                throw ValidationException::withMessages([
                    'description' => 'A description is required to publish a service.',
                ]);
            }
        }

        return $validated;
    }

    protected function checkPublishRequirements(Listing $listing, int $sectionId): void
    {
        if ($sectionId !== Listing::SECTION_DIGI_WORLD && ! $listing->media_path) {
            throw ValidationException::withMessages([
                'status' => 'Cannot publish: an image or media file is required.',
            ]);
        }

        if ($listing->isVideo() && ! $listing->poster_path) {
            throw ValidationException::withMessages([
                'status' => 'Cannot publish: a video poster image is required.',
            ]);
        }

        if ($sectionId === Listing::SECTION_DIGI_WORLD && empty(trim($listing->description ?? ''))) {
            throw ValidationException::withMessages([
                'status' => 'Cannot publish: a service description is required.',
            ]);
        }
    }

    protected function resolveMediaUrl(Listing $listing, string $variant): ?string
    {
        $path = $variant === 'poster' ? $listing->poster_path : $listing->media_path;
        if (! $path) {
            return null;
        }

        return route('admin.media.show', ['listing' => $listing->id, 'variant' => $variant]);
    }
}
