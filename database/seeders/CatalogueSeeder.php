<?php

namespace Database\Seeders;

use App\Models\Listing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CatalogueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cataloguePath = resource_path('js/lib/site/catalogue.json');

        if (! File::exists($cataloguePath)) {
            return;
        }

        $data = json_decode(File::get($cataloguePath), true);
        $listings = $data['listings'] ?? [];

        foreach ($listings as $index => $item) {
            $sectionSlug = $item['section'] ?? 'media';
            $sectionId = Listing::sectionIdFromSlug($sectionSlug);

            if (! $sectionId) {
                continue;
            }

            $mediaType = ($item['type'] ?? 'image') === 'video' ? Listing::MEDIA_VIDEO : Listing::MEDIA_IMAGE;
            $status = ($item['status'] ?? 'published') === 'published' ? Listing::STATUS_PUBLISHED : Listing::STATUS_HIDDEN;

            Listing::firstOrCreate(
                ['title' => $item['heading'], 'section' => $sectionId],
                [
                    'description' => $item['description'] ?? null,
                    'service_formats' => null,
                    'price' => $item['price'] ?? null,
                    'media_type' => $mediaType,
                    'media_path' => $item['file']['path'] ?? null,
                    'media_original_name' => $item['file']['originalName'] ?? null,
                    'media_mime_type' => $item['file']['mimeType'] ?? null,
                    'media_size_bytes' => $item['file']['sizeBytes'] ?? null,
                    'poster_path' => $item['thumbnail']['path'] ?? null,
                    'status' => $status,
                    'sort_order' => $item['displayOrder'] ?? $index,
                ]
            );
        }

        // Seed Digi World initial services if not yet present
        $digiServices = [
            [
                'title' => 'Social media ads',
                'description' => 'Creative posters for offers, announcements, events and product promotions. Share the message and where you plan to post it.',
                'service_formats' => "Promotional posts\nEvent announcements\nSocial media creatives",
                'media_path' => 'assets/advertising-creatives.jpg',
                'media_original_name' => 'advertising-creatives.jpg',
                'media_mime_type' => 'image/jpeg',
                'media_size_bytes' => 150000,
                'status' => Listing::STATUS_PUBLISHED,
                'sort_order' => 0,
            ],
            [
                'title' => 'Graphic design',
                'description' => 'Design for the information you want people to notice or keep. Send your text, logo and required size to discuss the layout.',
                'service_formats' => "Posters, banners & notices\nBrochures\nVisiting cards",
                'media_path' => 'assets/digi/print-design.svg',
                'media_original_name' => 'print-design.svg',
                'media_mime_type' => 'image/svg+xml',
                'media_size_bytes' => 12000,
                'status' => Listing::STATUS_PUBLISHED,
                'sort_order' => 1,
            ],
            [
                'title' => 'Video production',
                'description' => 'Short promotional and informational videos for businesses, products and local campaigns.',
                'service_formats' => "Reels & shorts\nProduct videos\nAd campaigns",
                'media_path' => 'assets/advertising-creatives.jpg',
                'media_original_name' => 'advertising-creatives.jpg',
                'media_mime_type' => 'image/jpeg',
                'media_size_bytes' => 150000,
                'status' => Listing::STATUS_PUBLISHED,
                'sort_order' => 2,
            ],
        ];

        foreach ($digiServices as $service) {
            Listing::firstOrCreate(
                ['title' => $service['title'], 'section' => Listing::SECTION_DIGI_WORLD],
                [
                    'description' => $service['description'],
                    'service_formats' => $service['service_formats'],
                    'price' => null,
                    'media_type' => Listing::MEDIA_IMAGE,
                    'media_path' => $service['media_path'],
                    'media_original_name' => $service['media_original_name'],
                    'media_mime_type' => $service['media_mime_type'],
                    'media_size_bytes' => $service['media_size_bytes'],
                    'poster_path' => null,
                    'status' => $service['status'],
                    'sort_order' => $service['sort_order'],
                ]
            );
        }
    }
}
