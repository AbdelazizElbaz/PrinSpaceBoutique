import { ImageResponse } from "next/og"
import { site } from "@/content/site.config"
import { getDict, isLocale } from "@/i18n"

export const alt = site.brand
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Satori (next/og) exige display:flex sur tout conteneur ayant plusieurs enfants.
export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#161c53,#2547e9)", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 34, opacity: 0.85, letterSpacing: 2 }}>{site.brand.toUpperCase()}</div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, marginTop: 20, lineHeight: 1.1 }}>{t.home.h1a}</div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 24, opacity: 0.9 }}>{`${site.tagline}. ${t.meta.trial(site.trialDays)}`}</div>
      </div>
    ),
    size,
  )
}
