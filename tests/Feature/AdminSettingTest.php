<?php

use App\Models\Admin;
use App\Models\SiteSetting;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('admin can view settings form', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.settings.edit'));

    $response->assertOk();
});

test('admin can update whatsapp number with valid digits', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.settings.update'), [
            'whatsapp_number' => '+91 98765 43210',
        ]);

    $response->assertRedirect(route('admin.settings.edit'));
    $response->assertSessionHas('success');

    expect(SiteSetting::current()->whatsapp_number)->toBe('919876543210');
});

test('validation rejects invalid whatsapp number', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.settings.update'), [
            'whatsapp_number' => '123', // too short
        ]);

    $response->assertSessionHasErrors('whatsapp_number');
});
