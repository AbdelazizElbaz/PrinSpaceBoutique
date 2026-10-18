<x-mail::message>
# Nouveau message dans le chat du site

**De :** {{ $conversation->displayName() }}@if($conversation->guest_phone) · {{ $conversation->guest_phone }}@endif

**Localisation :** {{ $conversation->city ?: '—' }}, {{ $conversation->country ?: '—' }} (IP {{ $conversation->ip_address ?: '—' }})

> {{ $message->body }}

<x-mail::button :url="$adminUrl">
Répondre dans la console
</x-mail::button>

Reçu le {{ $message->created_at->format('d/m/Y H:i') }}.
</x-mail::message>
