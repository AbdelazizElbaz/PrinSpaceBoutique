import type { Metadata } from "next"
import { Suspense } from "react"
import { Section } from "@/components/ui"
import { site } from "@/content/site.config"
import { SignupWizard } from "./SignupWizard"

export const metadata: Metadata = {
  title: `Essai gratuit ${site.trialDays} jours — créez votre espace`,
  description: `Créez votre espace ${site.brand} en 2 minutes : choix du forfait, sous-domaine, administrateur. Sans carte bancaire.`,
  robots: { index: true, follow: false },
}

export default function SignupPage() {
  return (
    <Section className="py-10 sm:py-14">
      <Suspense>
        <SignupWizard />
      </Suspense>
    </Section>
  )
}
