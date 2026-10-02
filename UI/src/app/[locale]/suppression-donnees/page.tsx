import type { Metadata } from "next"
import { getContent } from "@/content"
import { getDict, isLocale } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"
import { LegalPage } from "../LegalPage"

// Page publique « Suppression de vos données » — URL à renseigner dans la console
// Meta (champ « URL d'instructions pour la suppression des données »). Elle réutilise
// la section #suppression de la politique de confidentialité (une seule source de
// texte, dans les trois langues) : https://www.printios.ma/suppression-donnees

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const { legal } = getContent(locale)
  const section = legal.privacy.sections.find((s) => s.id === "suppression")
  return { title: section?.h.replace(/^\d+\.\s*/, "") ?? legal.privacy.title, alternates: pageAlternates(locale, "/suppression-donnees") }
}

export default async function Page({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const { legal } = getContent(locale)
  const section = legal.privacy.sections.find((s) => s.id === "suppression")
  const doc = {
    title: legal.privacy.title,
    updated: legal.privacy.updated,
    intro: "",
    sections: section ? [{ ...section, h: section.h.replace(/^\d+\.\s*/, "") }] : legal.privacy.sections,
  }
  return <LegalPage eyebrow={legal.eyebrow} doc={doc} contactTitle={legal.contactTitle} />
}
