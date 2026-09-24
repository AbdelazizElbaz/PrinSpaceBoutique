<x-mail::message>
# Nouvelle demande depuis le site

**Type :** {{ $lead->type }}
**Nom :** {{ $lead->name }} @if($lead->company)— {{ $lead->company }}@endif
**E-mail :** {{ $lead->email }}
**Téléphone :** {{ $lead->phone ?: '—' }}
**Ville :** {{ $lead->city ?: '—' }} · **Taille :** {{ $lead->size ?: '—' }}

@if($lead->message)
> {{ $lead->message }}
@endif

Reçue le {{ $lead->created_at->format('d/m/Y H:i') }} (IP {{ $lead->ip }}).
</x-mail::message>
