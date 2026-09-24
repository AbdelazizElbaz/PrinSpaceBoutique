<?php

namespace App\Services;

use RuntimeException;

/** Erreur 422 renvoyée par la plateforme (slug déjà pris, etc.). */
class PlatformValidationException extends RuntimeException
{
    public function __construct(string $message, public array $errors = [])
    {
        parent::__construct($message);
    }
}
