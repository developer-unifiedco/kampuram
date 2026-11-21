<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SiteSetting::firstOrCreate(
            ['id' => SiteSetting::SITE_SETTINGS_ID],
            ['whatsapp_number' => '919388002975']
        );
    }
}
