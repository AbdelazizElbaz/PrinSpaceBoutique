# -----------------------------------------------------------------------------
# Crée l'environnement GitHub "PrintIOS" avec ses variables et ses secrets,
# pour le workflow .github/workflows/Deploy.yml.
#
# Prérequis : GitHub CLI installé et connecté (gh auth login).
# Lancer depuis la racine du dépôt :
#   powershell -ExecutionPolicy Bypass -File .\scripts\setup-github-env.ps1
#
# Les valeurs par défaut viennent de l'installation Packspace existante
# (API2\.env du dépôt Packspace01) : même région AWS, même serveur MySQL
# Lightsail, mêmes clés AWS et mot de passe MySQL — lus LOCALEMENT, jamais
# affichés, envoyés uniquement dans les secrets GitHub. Relancer le script
# met simplement à jour les valeurs.
# -----------------------------------------------------------------------------
$ErrorActionPreference = "Stop"
$repo = "AbdelazizElbaz/PrinSpaceBoutique"
$env_ = "PrintIOS"
$packspaceEnv = Join-Path $PSScriptRoot "..\..\Packspace0120260729\API2\.env"

function Ask($label, $default) {
  $v = Read-Host "$label [$default]"
  if ([string]::IsNullOrWhiteSpace($v)) { return $default }
  return $v
}
function AskSecret($label) {
  $s = Read-Host "$label (saisie masquée, Entrée pour garder la valeur Packspace)" -AsSecureString
  return [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))
}
# Lit une clé dans un fichier .env (valeur brute, guillemets retirés)
function EnvGet($file, $key) {
  if (-not (Test-Path $file)) { return "" }
  $line = Get-Content $file | Where-Object { $_ -match "^\s*$key\s*=" } | Select-Object -First 1
  if (-not $line) { return "" }
  $v = ($line -split "=", 2)[1].Trim()
  return $v.Trim('"').Trim("'")
}

gh auth status | Out-Null
Write-Host "`n== Environnement '$env_' sur $repo ==" -ForegroundColor Cyan
if (Test-Path $packspaceEnv) { Write-Host "Valeurs par défaut lues dans : $packspaceEnv" -ForegroundColor DarkGray }
else { Write-Host "Fichier Packspace API2\.env introuvable : saisie manuelle." -ForegroundColor Yellow }
gh api -X PUT "repos/$repo/environments/$env_" | Out-Null

# ---------- Variables (non sensibles) ----------
$vars = [ordered]@{
  AWS_REGION        = Ask "AWS_REGION (région Lightsail)" ((EnvGet $packspaceEnv "AWS_DEFAULT_REGION") | ForEach-Object { if ($_) { $_ } else { "eu-west-3" } })
  LIGHTSAIL_SERVICE = Ask "LIGHTSAIL_SERVICE (nom du service container)" "printios"
  SITE_URL          = Ask "SITE_URL" "https://printios.ma"
  DB_HOST           = Ask "DB_HOST (MySQL Lightsail Packspace)" (EnvGet $packspaceEnv "DB_HOST")
  DB_PORT           = Ask "DB_PORT" "3306"
  DB_DATABASE       = Ask "DB_DATABASE (base dédiée à créer sur ce serveur)" "printios_boutique"
  DB_USERNAME       = Ask "DB_USERNAME" (EnvGet $packspaceEnv "DB_USERNAME")
  MAIL_HOST         = Ask "MAIL_HOST (serveur SMTP — ex. email-smtp.eu-west-3.amazonaws.com pour Amazon SES)" ""
  MAIL_PORT         = Ask "MAIL_PORT" "587"
  MAIL_USERNAME     = Ask "MAIL_USERNAME (identifiant SMTP)" ""
  MAIL_FROM_ADDRESS = Ask "MAIL_FROM_ADDRESS" "noreply@printios.ma"
  NOTIFY_EMAIL      = Ask "NOTIFY_EMAIL (reçoit leads et demandes d'essai)" "commercial@printios.ma"
}
foreach ($k in $vars.Keys) {
  gh variable set $k --env $env_ --repo $repo --body $vars[$k] | Out-Null
  Write-Host "  var    $k = $($vars[$k])"
}

# ---------- Secrets ----------
Write-Host "`n== Secrets (rien ne s'affiche ; Entrée = réutiliser la valeur trouvée dans Packspace) ==" -ForegroundColor Cyan
$secrets = [ordered]@{}

$v = AskSecret "AWS_ACCESS_KEY_ID";     if (-not $v) { $v = EnvGet $packspaceEnv "AWS_ACCESS_KEY_ID" };     $secrets.AWS_ACCESS_KEY_ID = $v
$v = AskSecret "AWS_SECRET_ACCESS_KEY"; if (-not $v) { $v = EnvGet $packspaceEnv "AWS_SECRET_ACCESS_KEY" }; $secrets.AWS_SECRET_ACCESS_KEY = $v
$v = AskSecret "DB_PASSWORD";           if (-not $v) { $v = EnvGet $packspaceEnv "DB_PASSWORD" };           $secrets.DB_PASSWORD = $v
$v = AskSecret "MAIL_PASSWORD (mot de passe SMTP)"; $secrets.MAIL_PASSWORD = $v

# APP_KEY : généré ici (équivalent de php artisan key:generate --show)
$appKey = AskSecret "APP_KEY (laisser vide pour en générer un)"
if ([string]::IsNullOrWhiteSpace($appKey)) {
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $appKey = "base64:" + [Convert]::ToBase64String($bytes)
  Write-Host "  APP_KEY généré."
}
$secrets.APP_KEY = $appKey

foreach ($k in $secrets.Keys) {
  if ([string]::IsNullOrWhiteSpace($secrets[$k])) { Write-Host "  secret $k : IGNORÉ (vide) — à renseigner plus tard" -ForegroundColor Yellow; continue }
  $secrets[$k] | gh secret set $k --env $env_ --repo $repo | Out-Null
  Write-Host "  secret $k : OK"
}

Write-Host "`nTerminé. Vérifiez : https://github.com/$repo/settings/environments" -ForegroundColor Green
Write-Host "Reste à faire côté AWS : créer la base '$($vars.DB_DATABASE)' sur le serveur MySQL (même utilisateur), le service Lightsail '$($vars.LIGHTSAIL_SERVICE)' et le domaine."
Write-Host "Puis : gh workflow run Deploy --repo $repo   (ou Actions → Deploy → Run workflow)"
