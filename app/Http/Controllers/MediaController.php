<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Serve listing media for authenticated admin preview (published or hidden).
     */
    public function showAdmin(Request $request, Listing $listing, string $variant = 'main')
    {
        return $this->serveMedia($listing, $variant, isPublic: false);
    }

    /**
     * Serve listing media for public visitors (only if published).
     */
    public function showPublic(Request $request, Listing $listing, string $variant = 'main')
    {
        if (! $listing->isPublished()) {
            abort(404, 'Media not found or not published.');
        }

        return $this->serveMedia($listing, $variant, isPublic: true);
    }

    /**
     * Internal resolver and response generator.
     */
    protected function serveMedia(Listing $listing, string $variant, bool $isPublic)
    {
        $path = $variant === 'poster' ? $listing->poster_path : $listing->media_path;

        if (! $path || ! Storage::disk('local')->exists($path)) {
            // Check if it's a legacy public asset path (e.g. assets/...)
            if ($path && file_exists(public_path('kampuram-site/'.$path))) {
                return response()->file(public_path('kampuram-site/'.$path));
            }

            abort(404, 'Media file not found.');
        }

        $fullPath = Storage::disk('local')->path($path);
        $mimeType = $variant === 'poster' ? 'image/jpeg' : ($listing->media_mime_type ?: Storage::disk('local')->mimeType($path));

        $headers = [
            'Content-Type' => $mimeType,
            // Prevent stale cache when visibility changes
            'Cache-Control' => $isPublic ? 'no-cache, must-revalidate' : 'private, no-cache',
        ];

        return response()->file($fullPath, $headers);
    }
}
