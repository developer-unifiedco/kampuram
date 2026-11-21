<?php

use App\Models\Admin;
use App\Models\Listing;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
    $this->admin = Admin::factory()->create();
});

test('guest can access published media', function () {
    $file = UploadedFile::fake()->image('card.jpg')->size(200);
    $path = $file->store('listings/media', 'local');

    $listing = Listing::factory()->cards()->published()->create([
        'media_path' => $path,
        'media_mime_type' => 'image/jpeg',
    ]);

    $response = $this->get(route('media.show', ['listing' => $listing->id, 'variant' => 'main']));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'image/jpeg');
    expect($response->headers->get('Cache-Control'))->toContain('no-cache');
});

test('guest cannot access hidden media', function () {
    $file = UploadedFile::fake()->image('card.jpg')->size(200);
    $path = $file->store('listings/media', 'local');

    $listing = Listing::factory()->cards()->hidden()->create([
        'media_path' => $path,
    ]);

    $response = $this->get(route('media.show', ['listing' => $listing->id, 'variant' => 'main']));

    $response->assertNotFound();
});

test('admin can preview hidden media', function () {
    $file = UploadedFile::fake()->image('card.jpg')->size(200);
    $path = $file->store('listings/media', 'local');

    $listing = Listing::factory()->cards()->hidden()->create([
        'media_path' => $path,
        'media_mime_type' => 'image/jpeg',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.media.show', ['listing' => $listing->id, 'variant' => 'main']));

    $response->assertOk();
});
