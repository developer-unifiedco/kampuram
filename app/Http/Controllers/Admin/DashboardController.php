<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard / section launcher.
     */
    public function index(): Response
    {
        $counts = [];

        foreach (Listing::SECTIONS as $slug => $id) {
            $counts[$slug] = [
                'id' => $id,
                'slug' => $slug,
                'label' => Listing::SECTION_LABELS[$id],
                'itemName' => Listing::SECTION_ITEM_NAMES[$id],
                'total' => Listing::where('section', $id)->count(),
                'published' => Listing::where('section', $id)->where('status', Listing::STATUS_PUBLISHED)->count(),
                'hidden' => Listing::where('section', $id)->where('status', Listing::STATUS_HIDDEN)->count(),
            ];
        }

        $setting = SiteSetting::current();

        return Inertia::render('admin/index', [
            'sections' => $counts,
            'whatsappNumber' => $setting->whatsapp_number,
        ]);
    }
}
