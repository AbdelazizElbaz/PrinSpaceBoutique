"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "./Logo"
import { site } from "@/content/site.config"

const nav = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/agent", label: "Agent d'impression" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/formation", label: "Formation" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" aria-label={site.brand}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                path.startsWith(n.href) ? "text-brand-700" : "text-slate-600 hover:text-ink"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <a href={site.links.login} className="btn-ghost">
            Se connecter
          </a>
          <Link href="/inscription" className="btn-primary">
            Essai gratuit {site.trialDays} jours
          </Link>
        </div>
        <button
          className="rounded-md p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <a href={site.links.login} className="btn-secondary">
                Se connecter
              </a>
              <Link href="/inscription" onClick={() => setOpen(false)} className="btn-primary">
                Essai gratuit {site.trialDays} jours
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
