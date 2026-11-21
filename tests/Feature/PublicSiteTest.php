<?php

use App\Models\Listing;
use App\Models\SiteSetting;
use Inertia\Testing\AssertableInertia as Assert;

it('serves the public pages through Inertia', function (string $path, string $page) {
    $this->get($path)->assertOk()->assertInertia(fn (Assert $inertia): Assert => $inertia
        ->component('site/'.$page)
        ->where('siteAssetUrl', asset('kampuram-site'))
        ->has('siteRoutes', 6));
})->with([
    'home' => ['/', 'home'],
    'media' => ['/kampuram-media', 'media'],
    'cards' => ['/cards-kendra', 'cards'],
    'books' => ['/kampuram-books', 'books'],
    'digi world' => ['/kampuram-digi-world', 'digi-world'],
    'contact' => ['/contact', 'contact'],
]);

it('keeps previous catalogue links working with their filters', function () {
    $this->get('/kampuram-media.html?filter=videos&q=local')
        ->assertStatus(301)
        ->assertRedirect(route('site.media', ['filter' => 'videos', 'q' => 'local']));
});

it('loads the public layout when navigating from the starter app', function () {
    $this->get('/', ['X-Inertia' => 'true', 'X-Inertia-Version' => 'previous-layout'])
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', route('home'));
});

it('serves live published listings and excludes hidden listings on catalogue pages', function () {
    Listing::query()->delete();

    $publishedAd = Listing::factory()->media()->published()->create([
        'title' => 'Live Summer Campaign',
    ]);
    $hiddenAd = Listing::factory()->media()->hidden()->create([
        'title' => 'Secret Draft Campaign',
    ]);

    $this->get('/kampuram-media')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia): Assert => $inertia
            ->component('site/media')
            ->has('listings', 1)
            ->where('listings.0.heading', 'Live Summer Campaign')
        );
});

it('shares the dynamic WhatsApp number from database settings across public pages', function () {
    $setting = SiteSetting::current();
    $setting->update(['whatsapp_number' => '919876543210']);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia): Assert => $inertia
            ->where('whatsappNumber', '919876543210')
        );
});
