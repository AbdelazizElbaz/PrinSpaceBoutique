"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, MessageCircle, X } from "lucide-react"
import { Logo } from "./Logo"
import { site, whatsappLink } from "@/content/site.config"
import { getDict, localePath, locales, stripLocale, type Locale } from "@/i18n"

export function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const pathname = usePathname()
  const { path: current } = stripLocale(pathname)
  const [open, setOpen] = useState(false)

  const nav = [
    { href: "/fonctionnalites", label: t.nav.features },
    { href: "/agent", label: t.nav.agent },
    { href: "/tarifs", label: t.nav.pricing },
    { href: "/formation", label: t.nav.training },
    { href: "/faq", label: t.nav.faq },
    { href: "/contact", label: t.nav.contact },
  ]

  // Même bascule que Packspace (pilule segmentée FR | AR | EN, langue active
  // en surbrillance), au lieu d'un menu déroulant.
  const LangSwitch = ({ className = "" }: { className?: string }) => (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs ${className}`}
      role="group"
      aria-label={t.nav.language}
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={localePath(l, current)}
          hrefLang={l}
          onClick={() => setOpen(false)}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
            l === locale ? "bg-white text-ink shadow-sm" : "text-slate-500 hover:text-ink"
          }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href={localePath(locale, "/")} aria-label={site.brand}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={localePath(locale, n.href)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${current.startsWith(n.href) ? "text-brand-700" : "text-slate-600 hover:text-ink"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-1 lg:flex">
          <LangSwitch />
          <a href={whatsappLink(t.common.whatsappMsg(site.brand))} target="_blank" rel="noreferrer" className="btn-ghost" title={t.common.whatsapp}>
            <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
          </a>
          <Link href={localePath(locale, "/inscription")} className="btn-primary">
            {t.nav.trial(site.trialDays)}
          </Link>
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <LangSwitch />
          <button className="rounded-md p-2 text-slate-700" onClick={() => setOpen((v) => !v)} aria-label={t.nav.menu} aria-expanded={open}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {nav.map((n) => (
              <Link key={n.href} href={localePath(locale, n.href)} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <a href={whatsappLink(t.common.whatsappMsg(site.brand))} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-white hover:bg-[#1ebe5d]">
                <MessageCircle className="h-4 w-4" /> {t.common.whatsapp}
              </a>
              <Link href={localePath(locale, "/inscription")} onClick={() => setOpen(false)} className="btn-primary">
                {t.nav.trial(site.trialDays)}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
