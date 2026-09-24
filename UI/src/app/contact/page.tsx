import type { Metadata } from "next"
import { Suspense } from "react"
import { Mail, MessageCircle, Phone } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui"
import { site } from "@/content/site.config"
import { ContactForm } from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact et démonstration",
  description: `Demandez une démo de ${site.brand} ou posez vos questions : e-mail, téléphone, WhatsApp. Réponse dans la journée.`,
}

export default function ContactPage() {
  return (
    <Section>
      <SectionHeading eyebrow="Contact" title="Parlons de votre atelier" lead="Une démo de 20 minutes suffit pour voir si l'outil correspond à votre organisation. Sans engagement." />
      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {[
              { icon: Mail, t: "E-mail", v: site.contact.salesEmail, href: `mailto:${site.contact.salesEmail}` },
              { icon: Phone, t: "Téléphone", v: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, "")}` },
              { icon: MessageCircle, t: "WhatsApp", v: "Écrire sur WhatsApp", href: `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(`Bonjour, je souhaite une démo de ${site.brand}.`)}` },
            ].map((c) => (
              <a key={c.t} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 hover:border-brand-300">
                <c.icon className="mt-0.5 h-5 w-5 text-brand-600" />
                <span>
                  <span className="block text-sm font-semibold text-ink">{c.t}</span>
                  <span className="block text-sm text-slate-600">{c.v}</span>
                </span>
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            {site.contact.hours}. {site.company.legalName}, {site.company.city}.
          </p>
        </div>
        <div className="card lg:col-span-3">
          <Suspense>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </Section>
  )
}
