import { NextResponse, type NextRequest } from "next/server"
import { defaultLocale, locales } from "@/i18n/config"
import { site } from "@/content/site.config"

// /ar/... et /en/... passent tels quels ; tout le reste est réécrit vers /fr/...
// (URL publique inchangée). /fr/... explicite est redirigé vers l'URL sans préfixe.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // www.<domaine> → <domaine> (308) : une seule version du site pour Google, pas de contenu dupliqué.
  // Derrière le Worker Cloudflare, l'hôte public arrive dans X-Forwarded-Host.
  const publicHost = (req.headers.get("x-forwarded-host") ?? req.nextUrl.hostname).toLowerCase()
  if (publicHost === `www.${site.domain}`) {
    const url = req.nextUrl.clone()
    url.protocol = "https:"
    url.host = site.domain
    url.port = ""
    return NextResponse.redirect(url, 308)
  }

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/"
    return NextResponse.redirect(url, 308)
  }

  // Langue courante transmise aux composants serveur qui n'ont pas accès aux
  // params de route (not-found) via l'en-tête x-locale.
  const found = locales.find((l) => l !== defaultLocale && (pathname === `/${l}` || pathname.startsWith(`/${l}/`)))
  const headers = new Headers(req.headers)
  headers.set("x-locale", found ?? defaultLocale)
  if (found) return NextResponse.next({ request: { headers } })

  const url = req.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  // Tout sauf les fichiers statiques, l'API interne Next et les métadonnées générées
  matcher: ["/((?!_next|api|favicon.svg|favicon.ico|robots.txt|sitemap.xml|screens|.*\\..*).*)"],
}
