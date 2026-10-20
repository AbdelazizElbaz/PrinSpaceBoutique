<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Statistiques de fréquentation dans la console admin (demande utilisateur du 20/10/2026 « les statistiques des
 * visiteurs et la liste des visiteurs, IP et ville comme dans le chat ») : compteur de pages vues par visiteur,
 * incrémenté par VisitorController::heartbeat() à chaque changement de page (viewed_pages ne garde que les 12
 * derniers chemins distincts, pas le nombre de vues).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visitor_sessions', function (Blueprint $table) {
            $table->unsignedInteger('page_views')->default(1)->after('viewed_pages');
        });
    }

    public function down(): void
    {
        Schema::table('visitor_sessions', function (Blueprint $table) {
            $table->dropColumn('page_views');
        });
    }
};
