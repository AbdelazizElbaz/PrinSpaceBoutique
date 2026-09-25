"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Globe, Menu, MessageCircle, X } from "lucide-react"
import { Logo } from "./Logo"
import { site, whatsappLink } from "@/content/site.config"
import { getDict, localeNames, localePath, locales, stripLocale, type Locale } from "@/i18n"

export function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const pathname = usePathname()
  const { path: current } = stripLocale(pathname)
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const nav = [
    { href: "/fonctionnalites", label: t.nav.features },
    { href: "/agent", label: t.nav.agent },
    { href: "/tarifs", label: t.nav.pricing },
    { href: "/formation", label: t.nav.training },
    { href: "/faq", label: t.nav.faq },
    { href: "/contact", label: t.nav.contact },
  ]

  const LangSwitch = ({ className = "" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setLangOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 hover:text-ink"
        aria-label={t.nav.language}
        aria-expanded={langOpen}
      >
        <Globe className="h-4 w-4" /> {localeNames[locale]}
      </button>
      {langOpen && (
        <ul className="absolute end-0 z-50 mt-1 min-w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {locales.map((l) => (
            <li key={l}>
              <Link
                href={localePath(l, current)}
                hrefLang={l}
                onClick={() => {
                  setLangOpen(false)
                  setOpen(false)
                }}
                className={`block px-4 py-2 text-sm hover:bg-slate-50 ${l === locale ? "font-semibold text-brand-700" : "text-slate-700"}`}
              >
                {localeNames[l]}
              </Link>
            </li>
          ))}
        </ul>
      )}
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
