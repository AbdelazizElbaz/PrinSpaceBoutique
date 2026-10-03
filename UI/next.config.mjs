import path from "node:path"
import { fileURLToPath } from "node:url"

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: { unoptimized: true },
  poweredByHeader: false,
  // Navigateurs récents uniquement (voir browserslist) : on retire le module de polyfills de Next,
  // signalé par Lighthouse (« ancien JavaScript », ~12 Kio).
  webpack(config, { isServer, webpack }) {
    if (!isServer) {
      // Next fait `require("../build/polyfills/polyfill-module")` (chemin relatif) : un alias ne suffit pas.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/build[\/]polyfills[\/]polyfill-module/, path.join(dirname, "src/lib/empty-polyfill.js"))
      )
    }
    return config
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
      { source: "/favicon.svg", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ]
  },
}
export default nextConfig
