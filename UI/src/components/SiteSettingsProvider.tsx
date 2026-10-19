"use client"

import { createContext, useContext, type ReactNode } from "react"
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/siteSettings"

// Réglages du site (prix, coordonnées) fournis par le layout serveur aux composants client (Header, widget de
// chat, cartes de contact, inscription…). Voir lib/siteSettings.ts.
const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS)

export function SiteSettingsProvider({ value, children }: { value: SiteSettings; children: ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
