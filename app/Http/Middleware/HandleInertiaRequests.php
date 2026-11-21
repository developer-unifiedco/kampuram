<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        $version = parent::version($request);

        // The public and starter pages boot with different layouts and stylesheets.
        return $this->isPublicSite($request) ? $version.':site' : $version;
    }

    public function rootView(Request $request): string
    {
        return $this->isPublicSite($request) ? 'site' : $this->rootView;
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if ($this->isPublicSite($request)) {
            $pageKey = str($request->route()->getName())->after('site.')->toString();

            return [
                ...parent::share($request),
                'siteAssetUrl' => asset('kampuram-site'),
                'sitePage' => File::json(resource_path('js/lib/site/pages.json'))[$pageKey] ?? null,
                'whatsappNumber' => SiteSetting::current()->whatsapp_number,
                'siteRoutes' => [
                    'home' => route('home'),
                    'media' => route('site.media'),
                    'cards' => route('site.cards'),
                    'books' => route('site.books'),
                    'digi-world' => route('site.digi-world'),
                    'contact' => route('site.contact'),
                ],
            ];
        }

        if ($request->is('admin*')) {
            $admin = $request->user('admin');

            return array_merge(parent::share($request), [
                'name' => config('app.name'),
                'auth' => [
                    'admin' => $admin ? [
                        'id' => $admin->id,
                        'name' => $admin->name,
                        'email' => $admin->email,
                    ] : null,
                ],
                'flash' => [
                    'success' => fn () => $request->session()->get('success'),
                    'error' => fn () => $request->session()->get('error'),
                ],
            ]);
        }

        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }

    private function isPublicSite(Request $request): bool
    {
        return $request->routeIs('home', 'site.*');
    }
}
