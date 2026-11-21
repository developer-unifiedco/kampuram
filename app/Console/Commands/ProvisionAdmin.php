<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ProvisionAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:provision
                            {--name= : Name of the admin}
                            {--email= : Email address of the admin}
                            {--password= : Password for the admin account}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Provision or update an administrator account';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = $this->option('name') ?: $this->ask('Admin Name');
        $email = $this->option('email') ?: $this->ask('Admin Email');
        $password = $this->option('password') ?: $this->secret('Admin Password');

        if (empty($name) || empty($email) || empty($password)) {
            $this->error('Name, email, and password are all required.');

            return self::FAILURE;
        }

        $email = strtolower(trim($email));

        $admin = Admin::updateOrCreate(
            ['email' => $email],
            [
                'name' => trim($name),
                'password' => Hash::make($password),
                'remember_token' => Str::random(60),
            ]
        );

        $this->info("Admin account successfully provisioned for: {$admin->email}");

        return self::SUCCESS;
    }
}
