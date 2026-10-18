"use client"

// Présence des visiteurs (console admin « Visiteurs en ligne ») — indépendant du widget de chat : un
// heartbeat toutes les 20 s avec la page courante, la langue, la page d'origine et les dernières pages vues ;
// un signal « hors ligne » (sendBeacon) à la fermeture de l'onglet. Rien n'est envoyé depuis la console admin
// ni depuis un navigateur où elle est ouverte (voir ADMIN_HINT_KEY).

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { chatApi, getGuestToken, hasAdminHint, recordViewedPage } from "@/lib/chatApi"
import type { Locale } from "@/i18n/config"

const HEARTBEAT_MS = 20000

export function VisitorTracker({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/"
  const isAdmin = pathname.includes("/admin")
  const pathRef = useRef(pathname)
  pathRef.current = pathname

  useEffect(() => {
    if (isAdmin) return
    const token = getGuestToken()
    if (!token) return
    let referrer: string | undefined
    try {
      referrer = document.referrer && !document.referrer.includes(window.location.host) ? document.referrer.slice(0, 500) : undefined
    } catch {
      referrer = undefined
    }
    const beat = () => {
      const pages = recordViewedPage(pathRef.current)
      chatApi.heartbeat({ guest_token: token, current_path: pathRef.current, referrer, locale, viewed_pages: pages, is_staff_hint: hasAdminHint() }).catch(() => {})
    }
    beat()
    const interval = setInterval(beat, HEARTBEAT_MS)
    const offline = () => chatApi.offline(token, hasAdminHint())
    window.addEventListener("pagehide", offline)
    return () => {
      clearInterval(interval)
      window.removeEventListener("pagehide", offline)
    }
    // Un seul heartbeat périodique par montage ; le chemin courant est lu via pathRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, locale])

  // Changement de page : heartbeat immédiat pour que la console voie la page courante sans attendre 20 s.
  useEffect(() => {
    if (isAdmin) return
    const token = getGuestToken()
    if (!token) return
    const pages = recordViewedPage(pathname)
    const id = setTimeout(() => chatApi.heartbeat({ guest_token: token, current_path: pathname, locale, viewed_pages: pages, is_staff_hint: hasAdminHint() }).catch(() => {}), 500)
    return () => clearTimeout(id)
  }, [pathname, isAdmin, locale])

  return null
}
