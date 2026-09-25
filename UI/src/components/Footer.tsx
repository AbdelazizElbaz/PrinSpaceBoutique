import Link from "next/link"
import { Logo } from "./Logo"
import { site } from "@/content/site.config"
import { getDict, localePath, type Locale } from "@/i18n"
import { PhoneLink, WhatsAppLink } from "./PhoneLink"

export function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const cols = [
    {
      title: t.footer.product,
      links: [
        { href: "/fonctionnalites", label: t.nav.features },
        { href: "/agent", label: t.nav.agent },
        { href: "/tarifs", label: t.nav.pricing },
        { href: "/inscription", label: t.footer.freeTrial },
      ],
    },
    {
      title: t.footer.resources,
      links: [
        { href: "/formation", label: t.footer.trainingVideos },
        { href: "/faq", label: t.nav.faq },
        { href: "/contact", label: t.footer.demo },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { href: "/cgv", label: t.footer.terms },
        { href: "/confidentialite", label: t.footer.privacy },
        { href: "/mentions-legales", label: t.footer.legalNotice },
      ],
    },
  ]
  const lp = (h: string) => (/^https?:/.test(h) ? h : localePath(locale, h))

  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="container-x grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-slate-600">
            {site.tagline}. {t.footer.blurb}
          </p>
          <div className="mt-5 space-y-1 text-sm text-slate-600">
            <p>
              <a className="hover:text-ink" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </p>
            <p>
              <PhoneLink className="hover:text-ink" message={t.common.whatsappMsg(site.brand)} />
              {" · "}
              <WhatsAppLink className="hover:text-ink" message={t.common.whatsappMsg(site.brand)}>
                {t.footer.whatsapp}
              </WhatsAppLink>
            </p>
            <p>
              {site.company.city}, {t.footer.country}
            </p>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-sm font-semibold text-ink">{c.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={lp(l.href)} className="text-sm text-slate-600 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.company.legalName}. {t.footer.rights}
          </p>
          <p>{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
