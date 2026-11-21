<?php

namespace App\Services;

use App\Models\Listing;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ListingMediaService
{
    protected string $disk = 'local';

    /**
     * Store an uploaded media file and return metadata.
     *
     * @return array{path: string, original_name: string, mime_type: string, size_bytes: int, media_type: int}
     */
    public function storeMedia(UploadedFile $file): array
    {
        $mime = $file->getMimeType() ?: $file->getClientMimeType();
        $isVideo = str_starts_with($mime, 'video/');
        $extension = $file->guessExtension() ?: ($isVideo ? 'mp4' : 'jpg');

        $fileName = Str::random(40).'.'.$extension;
        $path = $file->storeAs('listings/media', $fileName, $this->disk);

        return [
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $mime,
            'size_bytes' => $file->getSize(),
            'media_type' => $isVideo ? Listing::MEDIA_VIDEO : Listing::MEDIA_IMAGE,
        ];
    }

    /**
     * Store an uploaded poster image for video.
     */
    public function storePoster(UploadedFile $file): string
    {
        $extension = $file->guessExtension() ?: 'jpg';
        $fileName = Str::random(40).'.'.$extension;

        return $file->storeAs('listings/posters', $fileName, $this->disk);
    }

    /**
     * Delete files associated with a listing safely after commit.
     */
    public function deleteFiles(?string $mediaPath, ?string $posterPath = null): void
    {
        $pathsToDelete = array_filter([$mediaPath, $posterPath]);

        foreach ($pathsToDelete as $path) {
            if ($this->isSafeToDelete($path)) {
                Storage::disk($this->disk)->delete($path);
            }
        }
    }

    /**
     * Verify that the path belongs to managed upload directories and is not referenced by another listing.
     */
    protected function isSafeToDelete(string $path): bool
    {
        // Must be in listings/ directory
        if (! str_starts_with($path, 'listings/')) {
            return false;
        }

        // Must not be referenced by another listing
        $referenced = Listing::where('media_path', $path)
            ->orWhere('poster_path', $path)
            ->exists();

        return ! $referenced;
    }
}
