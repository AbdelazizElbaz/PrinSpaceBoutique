import Link from "next/link"
import { Section } from "@/components/ui"

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-lg text-center">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="h2 mt-3">Cette page n&apos;existe pas</h1>
        <p className="lead mt-4">Le lien est peut-être périmé. Retournez à l&apos;accueil ou consultez la FAQ.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Accueil</Link>
          <Link href="/faq" className="btn-secondary">FAQ</Link>
        </div>
      </div>
    </Section>
  )
}
