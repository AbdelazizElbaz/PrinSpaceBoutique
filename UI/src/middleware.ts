import { NextResponse, type NextRequest } from "next/server"
import { defaultLocale, locales } from "@/i18n/config"

// /ar/... et /en/... passent tels quels ; tout le reste est réécrit vers /fr/...
// (URL publique inchangée). /fr/... explicite est redirigé vers l'URL sans préfixe.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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
  matcher: ["/((?!_next|api|favicon.svg|favicon.ico|robots.txt|sitemap.xml|opengraph-image|screens|.*\\..*).*)"],
}
