<?php

use App\Http\Controllers\Admin\AdminSessionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ListingController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\MediaController;
use Illuminate\Support\Facades\Route;

// Public media route (published only)
Route::get('media/{listing}/{variant}', [MediaController::class, 'showPublic'])
    ->where('variant', 'main|poster')
    ->name('media.show');

// Admin guest routes
Route::middleware('guest:admin')->prefix('admin')->group(function () {
    Route::get('login', [AdminSessionController::class, 'create'])->name('admin.login');
    Route::post('login', [AdminSessionController::class, 'store']);
});

// Admin authenticated routes
Route::middleware('auth:admin')->prefix('admin')->group(function () {
    Route::post('logout', [AdminSessionController::class, 'destroy'])->name('admin.logout');
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Settings
    Route::get('settings', [SettingController::class, 'edit'])->name('admin.settings.edit');
    Route::patch('settings', [SettingController::class, 'update'])->name('admin.settings.update');

    // Media preview for admin
    Route::get('media/{listing}/{variant}', [MediaController::class, 'showAdmin'])
        ->where('variant', 'main|poster')
        ->name('admin.media.show');

    // Section listings
    Route::get('listings/{section}', [ListingController::class, 'index'])->name('admin.listings.index');
    Route::get('listings/{section}/create', [ListingController::class, 'create'])->name('admin.listings.create');
    Route::post('listings/{section}', [ListingController::class, 'store'])->name('admin.listings.store');
    Route::get('listings/{section}/{listing}/edit', [ListingController::class, 'edit'])->name('admin.listings.edit');
    Route::patch('listings/{section}/{listing}', [ListingController::class, 'update'])->name('admin.listings.update');
    Route::patch('listings/{section}/{listing}/visibility', [ListingController::class, 'toggleVisibility'])->name('admin.listings.visibility');
    Route::patch('listings/{section}/{listing}/position', [ListingController::class, 'reorder'])->name('admin.listings.position');
    Route::delete('listings/{section}/{listing}', [ListingController::class, 'destroy'])->name('admin.listings.destroy');
});
