import Link from "next/link"
import type { ComponentProps } from "react"
import { localePath, type Locale } from "@/i18n/config"

// <Link> qui préfixe automatiquement le chemin avec la langue courante.
export function LocaleLink({ locale, href, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { locale: Locale; href: string }) {
  const external = /^https?:\/\//.test(href)
  return <Link href={external ? href : localePath(locale, href)} {...rest} />
}
