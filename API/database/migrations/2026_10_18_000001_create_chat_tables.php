<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Chat en direct avec les visiteurs du site + suivi de présence — demande utilisateur du 18/10/2026 :
 * « reprendre la fonctionnalité de chat du Store dans le site PrintIOS, avec l'IP, le pays, chatter avec
 * celui qui est connecté ; à l'ouverture du site on lui dit bonjour dans le chat ». Portage de
 * PackSpaceStore (store_chat_* / store_visitor_sessions), sans comptes clients : un visiteur est identifié
 * par un jeton opaque généré par le navigateur (localStorage), voir UI ChatWidget.tsx.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Réglages clé/valeur (message d'accueil, intervalle de polling…), voir App\Models\SiteSetting.
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Jetons de la console admin du site (mot de passe unique ADMIN_PASSWORD → jeton Bearer, voir
        // Admin\AdminAuthController). sha256 du jeton, jamais le jeton en clair.
        Schema::create('admin_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->string('label', 100)->nullable();
            $table->string('last_ip', 45)->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        // Présence : une ligne par visiteur (jeton), mise à jour par heartbeat (voir VisitorController).
        Schema::create('visitor_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('guest_token', 64)->unique();
            $table->string('current_path', 500)->nullable();
            $table->string('referrer', 500)->nullable();
            $table->string('locale', 5)->nullable();
            $table->string('user_agent', 250)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('xff_header', 500)->nullable();
            $table->string('city', 120)->nullable();
            $table->string('country', 120)->nullable();
            $table->string('country_code', 2)->nullable();
            $table->string('geo_error', 255)->nullable();
            $table->json('viewed_pages')->nullable();
            $table->timestamp('first_seen_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
            $table->index('last_seen_at');
        });

        // Une conversation par visiteur ; ville/pays/IP = instantané pris à la création (le visiteur peut
        // revenir d'ailleurs, l'historique garde le contexte d'origine).
        Schema::create('chat_conversations', function (Blueprint $table) {
            $table->id();
            $table->string('guest_token', 64)->unique();
            $table->string('guest_name', 150)->nullable();
            $table->string('guest_phone', 60)->nullable();
            $table->string('locale', 5)->nullable();
            $table->string('city', 120)->nullable();
            $table->string('country', 120)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamp('visitor_typing_at')->nullable();
            $table->timestamp('admin_typing_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            // Dernier e-mail « nouveau message » envoyé à l'équipe (anti-rafale, voir ChatController::store).
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();
            $table->index('last_message_at');
        });

        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('chat_conversations')->cascadeOnDelete();
            $table->string('sender', 10); // visitor | admin
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['conversation_id', 'id']);
        });

        Schema::create('chat_canned_responses', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->text('body');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_canned_responses');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_conversations');
        Schema::dropIfExists('visitor_sessions');
        Schema::dropIfExists('admin_tokens');
        Schema::dropIfExists('site_settings');
    }
};
