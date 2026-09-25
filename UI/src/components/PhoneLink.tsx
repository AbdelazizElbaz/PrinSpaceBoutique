"use client"

import { useEffect, useState, type ReactNode } from "react"
import { site, whatsappLink } from "@/content/site.config"

// Numéro de téléphone cliquable :
//   - sur mobile : `tel:` → lance un appel ;
//   - sur PC : ouvre WhatsApp (Web ou application) avec le numéro.
// Le rendu serveur utilise `tel:` (fallback sûr), puis on bascule côté client
// selon l'appareil. Le numéro affiché reste en LTR même en arabe.
export function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const ua = navigator.userAgent || ""
    const touch = navigator.maxTouchPoints > 0
    setMobile(/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua) || (touch && window.innerWidth < 900))
  }, [])
  return mobile
}

export function PhoneLink({ className = "", children, message }: { className?: string; children?: ReactNode; message?: string }) {
  const mobile = useIsMobile()
  const tel = `tel:${site.contact.phone.replace(/[^+\d]/g, "")}`
  const wa = whatsappLink(message ?? "")
  return (
    <a href={mobile ? tel : wa} target={mobile ? undefined : "_blank"} rel={mobile ? undefined : "noreferrer"} dir="ltr" className={className}>
      {children ?? site.contact.phone}
    </a>
  )
}

/** Lien WhatsApp (wa.me) : ouvre l'application sur mobile, WhatsApp Web/Desktop sur PC. */
export function WhatsAppLink({ className = "", children, message, title }: { className?: string; children: ReactNode; message: string; title?: string }) {
  return (
    <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className={className} title={title}>
      {children}
    </a>
  )
}
