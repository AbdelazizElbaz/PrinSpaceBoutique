<?php

use Illuminate\Support\Facades\Schedule;

// Relance le suivi des inscriptions en cours (au cas où le polling du site
// se serait arrêté avant la fin du déploiement) et envoie l'e-mail de bienvenue.
Schedule::command('signups:sync')->everyMinute();
