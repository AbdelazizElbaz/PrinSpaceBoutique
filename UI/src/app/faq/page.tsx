import type { Metadata } from "next"
import { Section, SectionHeading, CtaBand } from "@/components/ui"
import { faq, faqFlat } from "@/content/faq"
import { FaqSearch } from "./FaqSearch"

export const metadata: Metadata = {
  title: "FAQ — démarrage, abonnement, livraison et COD, agent d'impression, sécurité",
  description: "Toutes les réponses : essai gratuit, paiement par virement, transporteurs, rapprochement COD, agent de synchronisation, sauvegardes et données.",
}

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqFlat.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Section className="pb-4">
        <SectionHeading eyebrow="FAQ" title="Questions fréquentes" lead="Vous ne trouvez pas votre réponse ? Écrivez-nous, on répond en général dans la journée." />
      </Section>
      <FaqSearch groups={faq} />
      <CtaBand title="Une question précise sur votre atelier ?" text="Prenez 20 minutes avec un conseiller : on regarde votre organisation et on vous dit comment ça se passerait avec nous." />
    </>
  )
}
