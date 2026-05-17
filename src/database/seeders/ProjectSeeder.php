<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        Project::create([
            'name' => '営業',
            'created_by' => $user->id,
        ]);

        Project::create([
            'name' => '開発',
            'created_by' => $user->id,
        ]);

        Project::create([
            'name' => '個人',
            'created_by' => $user->id,
        ]);
    }
}