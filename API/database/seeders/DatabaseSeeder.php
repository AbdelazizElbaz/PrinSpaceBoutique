<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Rien à seeder : les forfaits vivent dans config/boutique.php (site) et
        // dans la table centrale `plans` de Packspace (console plateforme).
    }
}
