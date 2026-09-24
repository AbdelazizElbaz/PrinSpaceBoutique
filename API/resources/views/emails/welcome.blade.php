<x-mail::message>
# Bienvenue sur {{ $brand }}, {{ $signup->admin_name }} !

Votre espace **{{ $signup->company }}** est prêt.

<x-mail::button :url="$appUrl">
Ouvrir mon espace
</x-mail::button>

**Adresse :** {{ $appUrl }}
**Identifiant :** {{ $signup->email }}
**Mot de passe :** celui choisi lors de l'inscription (modifiable dans *Mon compte*).

Votre essai gratuit dure **{{ $trialDays }} jours**. Pour bien démarrer :

1. [Premier paramétrage : atelier, TVA, produits, matériaux]({{ $siteUrl }}/formation#demarrer)
2. [Connecter un transporteur]({{ $siteUrl }}/formation#demarrer)
3. [Installer l'agent d'impression]({{ $siteUrl }}/formation#produire)

Une question ? Répondez simplement à cet e-mail ou consultez la [FAQ]({{ $siteUrl }}/faq).

À bientôt,<br>
L'équipe {{ $brand }}
</x-mail::message>
