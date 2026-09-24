import { ImageResponse } from "next/og"
import { site } from "@/content/site.config"

export const alt = site.brand
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#161c53,#2547e9)", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 34, opacity: 0.85, letterSpacing: 2 }}>{site.brand.toUpperCase()}</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 20, lineHeight: 1.1 }}>Commandes, atelier, livraison et encaissement.</div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.9 }}>Le logiciel des imprimeries. Essai gratuit {site.trialDays} jours.</div>
      </div>
    ),
    size,
  )
}
