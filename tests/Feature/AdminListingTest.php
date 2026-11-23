<?php

use App\Models\Admin;
use App\Models\Listing;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
    $this->admin = Admin::factory()->create();
});

test('admin can view listings in a section', function () {
    Listing::factory()->media()->create(['title' => 'Ad 1']);
    Listing::factory()->media()->create(['title' => 'Ad 2']);

    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.listings.index', ['section' => 'media']));

    $response->assertOk();
});

test('admin can create a hidden listing without media', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.listings.store', ['section' => 'media']), [
            'title' => 'New Sample Creative',
            'description' => 'A creative ad description',
            'price' => '1500.00',
            'intent' => 'save_hidden',
        ]);

    $response->assertRedirect(route('admin.listings.index', ['section' => 'media']));
    $this->assertDatabaseHas('listings', [
        'title' => 'New Sample Creative',
        'section' => Listing::SECTION_MEDIA,
        'status' => Listing::STATUS_HIDDEN,
    ]);
});

test('admin can create a published listing with media', function () {
    $file = UploadedFile::fake()->image('creative.jpg', 800, 600)->size(500);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.listings.store', ['section' => 'media']), [
            'title' => 'Published Creative',
            'description' => 'A published ad description',
            'price' => '2500',
            'media' => $file,
            'intent' => 'publish',
        ]);

    $response->assertRedirect(route('admin.listings.index', ['section' => 'media']));
    $this->assertDatabaseHas('listings', [
        'title' => 'Published Creative',
        'section' => Listing::SECTION_MEDIA,
        'status' => Listing::STATUS_PUBLISHED,
        'media_type' => Listing::MEDIA_IMAGE,
    ]);
});

test('admin can create and publish a digi-world service with video', function () {
    $video = UploadedFile::fake()->create('service.mp4', 1000, 'video/mp4');
    $poster = UploadedFile::fake()->image('poster.jpg', 800, 600)->size(300);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.listings.store', ['section' => 'digi-world']), [
            'title' => 'Dynamic Video Production',
            'description' => 'High quality promotional videos',
            'service_formats' => "Commercials\nReels",
            'media' => $video,
            'poster' => $poster,
            'intent' => 'publish',
        ]);

    $response->assertRedirect(route('admin.listings.index', ['section' => 'digi-world']));
    $this->assertDatabaseHas('listings', [
        'title' => 'Dynamic Video Production',
        'section' => Listing::SECTION_DIGI_WORLD,
        'status' => Listing::STATUS_PUBLISHED,
        'media_type' => Listing::MEDIA_VIDEO,
    ]);
});

test('cannot publish media listing without an upload', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.listings.store', ['section' => 'media']), [
            'title' => 'Published Creative',
            'description' => 'A published ad description',
            'price' => '2500',
            'intent' => 'publish',
        ]);

    $response->assertSessionHasErrors('media');
});

test('wrong section parameter for listing returns 404', function () {
    $bookListing = Listing::factory()->books()->create();

    // Trying to view a Book listing under the media route
    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.listings.edit', ['section' => 'media', 'listing' => $bookListing->id]));

    $response->assertNotFound();
});

test('admin can toggle listing visibility', function () {
    $file = UploadedFile::fake()->image('card.jpg', 800, 800)->size(500);

    $listing = Listing::factory()->cards()->create([
        'status' => Listing::STATUS_PUBLISHED,
        'media_path' => $file->store('listings/media', 'local'),
    ]);

    // Hide
    $response = $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.listings.visibility', ['section' => 'cards', 'listing' => $listing->id]), [
            'intent' => 'hide',
        ]);

    $response->assertRedirect();
    expect($listing->fresh()->isPublished())->toBeFalse();

    // Publish
    $response = $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.listings.visibility', ['section' => 'cards', 'listing' => $listing->id]), [
            'intent' => 'publish',
        ]);

    $response->assertRedirect();
    expect($listing->fresh()->isPublished())->toBeTrue();
});

test('admin can reorder listings up and down', function () {
    $item1 = Listing::factory()->media()->create(['title' => 'Item 1', 'sort_order' => 0]);
    $item2 = Listing::factory()->media()->create(['title' => 'Item 2', 'sort_order' => 1]);

    // Move item 2 up
    $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.listings.position', ['section' => 'media', 'listing' => $item2->id]), [
            'direction' => 'up',
        ]);

    expect($item2->fresh()->sort_order)->toBe(0);
    expect($item1->fresh()->sort_order)->toBe(1);
});

test('admin can delete a listing and clean up storage files', function () {
    $file = UploadedFile::fake()->image('item.jpg')->size(200);
    $path = $file->store('listings/media', 'local');

    $listing = Listing::factory()->media()->create([
        'media_path' => $path,
    ]);

    Storage::disk('local')->assertExists($path);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.listings.destroy', ['section' => 'media', 'listing' => $listing->id]));

    $response->assertRedirect(route('admin.listings.index', ['section' => 'media']));
    $this->assertDatabaseMissing('listings', ['id' => $listing->id]);
    Storage::disk('local')->assertMissing($path);
});
