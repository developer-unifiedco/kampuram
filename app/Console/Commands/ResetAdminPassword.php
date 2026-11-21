<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResetAdminPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:reset-password
                            {--email= : Email address of the admin}
                            {--password= : New password for the admin account}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset an administrator password with operator assistance';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->option('email') ?: $this->ask('Admin Email');

        if (empty($email)) {
            $this->error('Email address is required.');

            return self::FAILURE;
        }

        $email = strtolower(trim($email));
        $admin = Admin::where('email', $email)->first();

        if (! $admin) {
            $this->error("Admin account not found for: {$email}");

            return self::FAILURE;
        }

        $password = $this->option('password') ?: $this->secret('New Password');

        if (empty($password)) {
            $this->error('Password cannot be empty.');

            return self::FAILURE;
        }

        $admin->forceFill([
            'password' => Hash::make($password),
            'remember_token' => Str::random(60),
        ])->save();

        $this->info("Password successfully reset for admin: {$admin->email}");

        return self::SUCCESS;
    }
}
