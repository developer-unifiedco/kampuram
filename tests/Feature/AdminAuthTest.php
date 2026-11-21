<?php

use App\Models\Admin;
use App\Models\User;

test('admin login screen can be rendered', function () {
    $response = $this->get(route('admin.login'));

    $response->assertOk();
});

test('admin can authenticate using the login screen', function () {
    $admin = Admin::factory()->create([
        'email' => 'owner@kampuram.com',
        'password' => bcrypt('secret-password'),
    ]);

    $response = $this->post(route('admin.login'), [
        'email' => 'owner@kampuram.com',
        'password' => 'secret-password',
    ]);

    $this->assertAuthenticatedAs($admin, 'admin');
    $response->assertRedirect(route('admin.dashboard'));
});

test('admin cannot authenticate with invalid password', function () {
    Admin::factory()->create([
        'email' => 'owner@kampuram.com',
        'password' => bcrypt('secret-password'),
    ]);

    $response = $this->post(route('admin.login'), [
        'email' => 'owner@kampuram.com',
        'password' => 'wrong-password',
    ]);

    $this->assertGuest('admin');
    $response->assertSessionHasErrors('email');
});

test('admin logout invalidates session and redirects to login', function () {
    $admin = Admin::factory()->create();

    $response = $this->actingAs($admin, 'admin')
        ->post(route('admin.logout'));

    $this->assertGuest('admin');
    $response->assertRedirect(route('admin.login'));
});

test('unauthenticated users cannot access admin dashboard', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('admin.login'));
});

test('standard web user cannot access admin dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'web')
        ->get(route('admin.dashboard'));

    $response->assertRedirect(route('admin.login'));
});
