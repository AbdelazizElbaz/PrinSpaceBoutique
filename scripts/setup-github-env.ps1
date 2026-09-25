# -----------------------------------------------------------------------------
# Crée l'environnement GitHub "PrintIOS" avec ses variables et ses secrets,
# pour le workflow .github/workflows/Deploy.yml.
#
# Prérequis : GitHub CLI installé (winget install GitHub.cli) et connecté
#             (gh auth login). À lancer depuis la racine du dépôt :
#             powershell -ExecutionPolicy Bypass -File .\scripts\setup-github-env.ps1
#
# Les VALEURS des secrets sont demandées à l'écran (saisie masquée), jamais
# écrites dans ce fichier. Relancer le script met simplement à jour les valeurs.
# -----------------------------------------------------------------------------
$ErrorActionPreference = "Stop"
$repo = "AbdelazizElbaz/PrinSpaceBoutique"
$env_ = "PrintIOS"

function Ask($label, $default) {
  $v = Read-Host "$label [$default]"
  if ([string]::IsNullOrWhiteSpace($v)) { return $default }
  return $v
}
function AskSecret($label) {
  $s = Read-Host "$label (saisie masquée)" -AsSecureString
  return [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))
}

gh auth status | Out-Null
Write-Host "`n== Environnement '$env_' sur $repo ==`n" -ForegroundColor Cyan
gh api -X PUT "repos/$repo/environments/$env_" | Out-Null

# ---------- Variables (non sensibles) ----------
$vars = [ordered]@{
  AWS_REGION        = Ask "AWS_REGION (région Lightsail)" "eu-west-3"
  LIGHTSAIL_SERVICE = Ask "LIGHTSAIL_SERVICE (nom du service container)" "printios"
  SITE_URL          = Ask "SITE_URL" "https://printios.ma"
  DB_HOST           = Ask "DB_HOST (hôte MySQL)" ""
  DB_PORT           = Ask "DB_PORT" "3306"
  DB_DATABASE       = Ask "DB_DATABASE" "printios_boutique"
  DB_USERNAME       = Ask "DB_USERNAME" "printios"
  MAIL_HOST         = Ask "MAIL_HOST (serveur SMTP)" ""
  MAIL_PORT         = Ask "MAIL_PORT" "587"
  MAIL_USERNAME     = Ask "MAIL_USERNAME" ""
  MAIL_FROM_ADDRESS = Ask "MAIL_FROM_ADDRESS" "noreply@printios.ma"
  NOTIFY_EMAIL      = Ask "NOTIFY_EMAIL (reçoit leads et demandes d'essai)" "commercial@printios.ma"
}
foreach ($k in $vars.Keys) {
  gh variable set $k --env $env_ --repo $repo --body $vars[$k] | Out-Null
  Write-Host "  var    $k = $($vars[$k])"
}

# ---------- Secrets (saisie masquée) ----------
Write-Host "`n== Secrets (collez les valeurs, rien ne s'affiche) ==" -ForegroundColor Cyan
$secrets = [ordered]@{}
$secrets.AWS_ACCESS_KEY_ID     = AskSecret "AWS_ACCESS_KEY_ID"
$secrets.AWS_SECRET_ACCESS_KEY = AskSecret "AWS_SECRET_ACCESS_KEY"

# APP_KEY : généré ici si vide (équivalent de php artisan key:generate --show)
$appKey = AskSecret "APP_KEY (laisser vide pour en générer un)"
if ([string]::IsNullOrWhiteSpace($appKey)) {
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $appKey = "base64:" + [Convert]::ToBase64String($bytes)
  Write-Host "  APP_KEY généré."
}
$secrets.APP_KEY       = $appKey
$secrets.DB_PASSWORD   = AskSecret "DB_PASSWORD"
$secrets.MAIL_PASSWORD = AskSecret "MAIL_PASSWORD"

foreach ($k in $secrets.Keys) {
  if ([string]::IsNullOrWhiteSpace($secrets[$k])) { Write-Host "  secret $k : ignoré (vide)" -ForegroundColor Yellow; continue }
  $secrets[$k] | gh secret set $k --env $env_ --repo $repo | Out-Null
  Write-Host "  secret $k : OK"
}

Write-Host "`nTerminé. Vérifiez : https://github.com/$repo/settings/environments" -ForegroundColor Green
Write-Host "Puis lancez le déploiement : gh workflow run Deploy --repo $repo   (ou Actions → Deploy → Run workflow)"
