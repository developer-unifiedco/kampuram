<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Show the settings form.
     */
    public function edit(): Response
    {
        $setting = SiteSetting::current();

        return Inertia::render('admin/settings', [
            'whatsappNumber' => $setting->whatsapp_number,
        ]);
    }

    /**
     * Update the WhatsApp setting.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'whatsapp_number' => ['required', 'string'],
        ]);

        $raw = $request->string('whatsapp_number')->toString();
        $digits = SiteSetting::normalizeNumber($raw);

        // International format validation: 7 to 15 digits
        if (! $digits || strlen($digits) < 7 || strlen($digits) > 15) {
            throw ValidationException::withMessages([
                'whatsapp_number' => 'Please enter a valid international phone number with country code (e.g. 919388002975).',
            ]);
        }

        $setting = SiteSetting::current();
        $setting->update(['whatsapp_number' => $digits]);

        return redirect()->route('admin.settings.edit')->with('success', 'WhatsApp number updated.');
    }
}
