"use client"

import { Mail, MessageCircle, Phone } from "lucide-react"
import { site, whatsappLink } from "@/content/site.config"
import { getDict, type Locale } from "@/i18n"
import { useIsMobile } from "@/components/PhoneLink"

// Cartes de contact : e-mail, téléphone (appel sur mobile / WhatsApp sur PC),
// WhatsApp (message pré-rempli).
export function ContactCards({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const mobile = useIsMobile()
  const msg = t.contact.whatsappMsg(site.brand)
  const tel = `tel:${site.contact.phone.replace(/[^+\d]/g, "")}`
  const cards = [
    { icon: Mail, t: t.contact.email, v: site.contact.salesEmail, href: `mailto:${site.contact.salesEmail}`, ext: false },
    { icon: Phone, t: t.contact.phone, v: site.contact.phone, href: mobile ? tel : whatsappLink(msg), ext: !mobile },
    { icon: MessageCircle, t: t.contact.whatsapp, v: t.contact.writeWhatsapp, href: whatsappLink(msg), ext: true },
  ]
  return (
    <div className="space-y-6">
      {cards.map((c) => (
        <a key={c.t} href={c.href} target={c.ext ? "_blank" : undefined} rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 hover:border-brand-300">
          <c.icon className={`mt-0.5 h-5 w-5 ${c.icon === MessageCircle ? "text-[#25D366]" : "text-brand-600"}`} />
          <span>
            <span className="block text-sm font-semibold text-ink">{c.t}</span>
            <span className="block text-sm text-slate-600" dir="ltr">{c.v}</span>
          </span>
        </a>
      ))}
    </div>
  )
}
