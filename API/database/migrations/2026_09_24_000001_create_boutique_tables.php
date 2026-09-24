<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Demandes de contact / démo
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('type', 20)->default('contact'); // demo | contact | business
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('size', 60)->nullable();
            $table->text('message')->nullable();
            $table->string('plan', 30)->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->string('status', 20)->default('new'); // new | contacted | won | lost
            $table->timestamps();
            $table->index(['status', 'created_at']);
        });

        // Demandes d'essai gratuit (forfait + coordonnées), traitées à la main
        Schema::create('signups', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->string('plan', 30);
            $table->string('billing', 10)->default('monthly'); // monthly | yearly
            $table->string('company');
            $table->string('admin_name');
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->string('city', 100)->nullable();
            $table->text('message')->nullable();
            $table->string('locale', 5)->default('fr');
            $table->string('status', 20)->default('new'); // new | contacted | activated | lost
            $table->text('notes')->nullable(); // suivi interne
            $table->string('ip', 45)->nullable();
            $table->boolean('accept_terms')->default(false);
            $table->timestamps();
            $table->index(['status', 'created_at']);
            $table->index('email');
        });

        // Tables d'infrastructure Laravel (queue database, cache database, failed jobs)
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');
        });
        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('signups');
        Schema::dropIfExists('leads');
    }
};
