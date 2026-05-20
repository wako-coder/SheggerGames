<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@sheggergames.com'],
            [
                'name'     => 'Admin',
                'email'    => 'admin@sheggergames.com',
                'password' => Hash::make('admin123'),
            ]
        );
    }
}
