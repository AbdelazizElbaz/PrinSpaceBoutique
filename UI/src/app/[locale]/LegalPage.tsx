import { Section } from "@/components/ui"
import { site } from "@/content/site.config"
import type { LegalDoc } from "@/content/types"
import { PhoneLink } from "@/components/PhoneLink"

export function LegalPage({ eyebrow, doc, contactTitle }: { eyebrow: string; doc: LegalDoc; contactTitle: string }) {
  const c = site.company
  return (
    <Section>
      <article className="prose-legal mx-auto max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h2 mt-3">{doc.title}</h1>
        {(doc.updated || doc.intro) && (
          <p>
            {doc.updated} {doc.intro}
          </p>
        )}
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {s.ul && (
              <ul>
                {s.ul.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <h2>{contactTitle}</h2>
        <p>
          {c.legalName} — {c.address} — ICE {c.ice} — RC {c.rc} —{" "}
          <a href={`mailto:${site.contact.email}`} className="underline">{site.contact.email}</a> —{" "}
          <PhoneLink className="underline" />
        </p>
      </article>
    </Section>
  )
}
