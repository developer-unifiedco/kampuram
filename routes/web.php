<?php

use App\Http\Controllers\PublicSiteController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PublicSiteController::class, 'home'])->name('home');
Route::get('/kampuram-media', [PublicSiteController::class, 'media'])->name('site.media');
Route::get('/cards-kendra', [PublicSiteController::class, 'cards'])->name('site.cards');
Route::get('/kampuram-books', [PublicSiteController::class, 'books'])->name('site.books');
Route::get('/kampuram-digi-world', [PublicSiteController::class, 'digiWorld'])->name('site.digi-world');
Route::get('/contact', [PublicSiteController::class, 'contact'])->name('site.contact');

$legacyPages = [
    '/index.html' => 'home',
    '/kampuram-media.html' => 'site.media',
    '/cards-kendra.html' => 'site.cards',
    '/kampuram-books.html' => 'site.books',
    '/kampuram-digi-world.html' => 'site.digi-world',
    '/contact.html' => 'site.contact',
];

foreach ($legacyPages as $path => $destination) {
    Route::get($path, fn (Request $request): RedirectResponse => redirect()->route($destination, $request->query(), 301));
}

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
