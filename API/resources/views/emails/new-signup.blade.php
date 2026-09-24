<x-mail::message>
# Nouvelle demande d'essai gratuit

**Atelier :** {{ $signup->company }} @if($signup->city)— {{ $signup->city }}@endif
**Forfait :** {{ ucfirst($signup->plan) }} ({{ $signup->billing === 'yearly' ? 'annuel' : 'mensuel' }})
**Contact :** {{ $signup->admin_name }} — {{ $signup->email }} — {{ $signup->phone }}
**Langue :** {{ strtoupper($signup->locale) }}

@if($signup->message)
> {{ $signup->message }}
@endif

À faire : créer le client dans Packspace, lui envoyer ses accès, puis activer l'essai de {{ config('boutique.trial_days') }} jours.
Reçue le {{ $signup->created_at->format('d/m/Y H:i') }} (IP {{ $signup->ip }}).
</x-mail::message>
