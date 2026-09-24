<x-mail::message>
# Nouvel essai gratuit

**Atelier :** {{ $signup->company }}
**Espace :** {{ $signup->appUrl() }}
**Forfait :** {{ ucfirst($signup->plan) }} ({{ $signup->billing === 'yearly' ? 'annuel' : 'mensuel' }})
**Administrateur :** {{ $signup->admin_name }} — {{ $signup->email }} — {{ $signup->phone }}

Le déploiement est lancé automatiquement. Suivi dans la console plateforme (tenant `{{ $signup->slug }}`).
Pensez à activer le forfait à réception du virement.
</x-mail::message>
