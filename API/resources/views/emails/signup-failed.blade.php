<x-mail::message>
# Échec de création d'un espace

**Atelier :** {{ $signup->company }} · **Slug :** `{{ $signup->slug }}` · **Forfait :** {{ $signup->plan }}
**Contact :** {{ $signup->admin_name }} — {{ $signup->email }} — {{ $signup->phone }}

**Erreur :** {{ $signup->error }}

À traiter manuellement depuis la console plateforme (relancer le déploiement ou créer le tenant), puis recontacter le client.
</x-mail::message>
