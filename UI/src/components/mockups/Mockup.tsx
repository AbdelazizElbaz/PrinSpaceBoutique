// Illustrations vectorielles « captures d'écran stylisées » de l'application.
// Elles sont dessinées en SVG pour rester nettes à toute taille, sans photo
// à héberger. Remplacez-les par de vraies captures (public/screens/*.png)
// quand vous en aurez : <Image src="/screens/orders.png" …/>.

import type { Feature } from "@/content/features"

type Kind = Feature["mockup"]

const frame = (children: React.ReactNode, w = 640, h = 400) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Aperçu de l'application">
    <defs>
      <linearGradient id="mk-bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#eef4ff" />
        <stop offset="1" stopColor="#f8fafc" />
      </linearGradient>
      <filter id="mk-shadow" x="-5%" y="-5%" width="110%" height="115%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0f172a" floodOpacity=".12" />
      </filter>
    </defs>
    <rect width={w} height={h} rx="16" fill="url(#mk-bg)" />
    {children}
  </svg>
)

const Window = ({ x, y, w, h, title }: { x: number; y: number; w: number; h: number; title: string }) => (
  <g filter="url(#mk-shadow)">
    <rect x={x} y={y} width={w} height={h} rx="10" fill="#fff" stroke="#e2e8f0" />
    <rect x={x} y={y} width={w} height="28" rx="10" fill="#f1f5f9" />
    <rect x={x} y={y + 18} width={w} height="10" fill="#f1f5f9" />
    <circle cx={x + 14} cy={y + 14} r="4" fill="#fca5a5" />
    <circle cx={x + 26} cy={y + 14} r="4" fill="#fcd34d" />
    <circle cx={x + 38} cy={y + 14} r="4" fill="#86efac" />
    <text x={x + 54} y={y + 18} fontSize="10" fill="#64748b" fontFamily="Inter, sans-serif">
      {title}
    </text>
  </g>
)

const Sidebar = ({ x, y, h, items }: { x: number; y: number; h: number; items: string[] }) => (
  <g>
    <rect x={x} y={y} width="110" height={h} fill="#0f172a" />
    <rect x={x + 12} y={y + 14} width="60" height="10" rx="3" fill="#3b66f5" />
    {items.map((it, i) => (
      <g key={it}>
        <rect x={x + 12} y={y + 40 + i * 22} width="86" height="14" rx="4" fill={i === 1 ? "#1e2ead" : "transparent"} />
        <text x={x + 18} y={y + 50 + i * 22} fontSize="8" fill={i === 1 ? "#fff" : "#94a3b8"} fontFamily="Inter, sans-serif">
          {it}
        </text>
      </g>
    ))}
  </g>
)

const Pill = ({ x, y, w, text, color }: { x: number; y: number; w: number; text: string; color: string }) => (
  <g>
    <rect x={x} y={y} width={w} height="14" rx="7" fill={color} opacity=".15" />
    <text x={x + w / 2} y={y + 10} fontSize="7.5" textAnchor="middle" fill={color} fontFamily="Inter, sans-serif" fontWeight="600">
      {text}
    </text>
  </g>
)

const Row = ({ y, cols, colors = [] }: { y: number; cols: string[]; colors?: string[] }) => (
  <g>
    <line x1="150" x2="620" y1={y + 18} y2={y + 18} stroke="#f1f5f9" />
    {cols.map((c, i) => (
      <text key={i} x={[158, 240, 340, 430, 520][i]} y={y + 11} fontSize="8" fill={colors[i] || "#334155"} fontFamily="Inter, sans-serif">
        {c}
      </text>
    ))}
  </g>
)

function Orders() {
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title="Commandes — PrintManagerOS" />
      <Sidebar x={20} y={48} h={332} items={["Tableau de bord", "Commandes", "Clients", "Livraison", "Atelier", "Finance"]} />
      <text x="150" y="70" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Commandes
      </text>
      <rect x="150" y="80" width="200" height="18" rx="6" fill="#f1f5f9" />
      <text x="158" y="92" fontSize="7.5" fill="#94a3b8" fontFamily="Inter, sans-serif">
        Rechercher une commande, un client…
      </text>
      <rect x="540" y="78" width="80" height="20" rx="6" fill="#2547e9" />
      <text x="580" y="91" fontSize="8" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="600">
        + Nouvelle
      </text>
      <rect x="150" y="108" width="470" height="18" fill="#f8fafc" />
      <Row y={108} cols={["Référence", "Client", "Prix commande", "Reste à payer", "Statut"]} colors={["#64748b", "#64748b", "#64748b", "#64748b", "#64748b"]} />
      {[
        ["CMD-2041", "Atelier Nour", "134,00 DH", "84,00 DH", "En production", "#7c3aed"],
        ["CMD-2040", "Sté Amine", "1 250,00 DH", "1 250,00 DH", "Prête", "#0891b2"],
        ["CMD-2039", "Karim B.", "460,00 DH", "0,00 DH", "Livrée", "#059669"],
        ["CMD-2038", "Imprim'Plus", "2 980,00 DH", "980,00 DH", "En livraison", "#d97706"],
        ["CMD-2037", "Hanae L.", "89,00 DH", "89,00 DH", "Nouvelle", "#2547e9"],
        ["CMD-2036", "Sté Amine", "3 120,00 DH", "0,00 DH", "Livrée", "#059669"],
      ].map((r, i) => (
        <g key={r[0]}>
          <Row y={130 + i * 34} cols={[r[0], r[1], r[2], r[3]]} />
          <Pill x={520} y={130 + i * 34 + 2} w={70} text={r[4]} color={r[5]} />
          {i === 0 && (
            <>
              <text x="340" y="153" fontSize="6.5" fill="#94a3b8" fontFamily="Inter, sans-serif">
                Avance : 50,00 DH · + livraison 35 DH
              </text>
              <text x="340" y="161" fontSize="6.5" fill="#dc2626" fontFamily="Inter, sans-serif">
                Ajustement manuel : −46,00 DH
              </text>
            </>
          )}
          {i === 3 && <Pill x={430} y={130 + i * 34 + 14} w={62} text="Écart COD" color="#dc2626" />}
        </g>
      ))}
    </>,
  )
}

function Workshop() {
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title="Atelier — Fichiers prêts" />
      <Sidebar x={20} y={48} h={332} items={["Tableau de bord", "Atelier", "Commandes", "Synchronisation"]} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={150 + i * 155} y="70" width="145" height="290" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
          <text x={160 + i * 155} y="88" fontSize="9" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
            {["À imprimer", "En cours", "Terminé"][i]}
          </text>
          {[0, 1, 2, 3].slice(0, 4 - i).map((j) => (
            <g key={j}>
              <rect x={158 + i * 155} y={100 + j * 60} width="129" height="50" rx="6" fill="#fff" stroke="#e2e8f0" />
              <rect x={166 + i * 155} y={108 + j * 60} width="18" height="22" rx="3" fill="#dbe6fe" />
              <text x={190 + i * 155} y={117 + j * 60} fontSize="7.5" fontWeight="600" fill="#0f172a" fontFamily="Inter, sans-serif">
                CMD-20{40 - j - i * 3} · {["flyer-A5", "bache-3x2", "cartes-350g", "affiche-A2"][j]}.pdf
              </text>
              <text x={190 + i * 155} y={128 + j * 60} fontSize="6.5" fill="#64748b" fontFamily="Inter, sans-serif">
                {["HP Indigo", "Roland grand format", "Xerox", "HP Indigo"][j]} · {["12", "38", "4", "9"][j]} Mo
              </text>
              <rect x={166 + i * 155} y={138 + j * 60} width="113" height="4" rx="2" fill="#e2e8f0" />
              <rect x={166 + i * 155} y={138 + j * 60} width={[113, 60, 113, 20][j]} height="4" rx="2" fill={i === 2 ? "#059669" : "#2547e9"} />
            </g>
          ))}
        </g>
      ))}
    </>,
  )
}

function Delivery() {
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title="Livraison — Ramassage #318 (Ameex)" />
      <Sidebar x={20} y={48} h={332} items={["Commandes", "Livraison", "Ramassages", "Livreurs"]} />
      <text x="150" y="70" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Ramassage #318
      </text>
      <text x="150" y="84" fontSize="7.5" fill="#64748b" fontFamily="Inter, sans-serif">
        Créé par Yassine (vendeur) · Ameex · 6 colis · COD total 4 130,00 DH
      </text>
      <rect x="150" y="96" width="290" height="264" rx="8" fill="#fff" stroke="#e2e8f0" />
      <rect x="160" y="106" width="270" height="26" rx="4" fill="#0f172a" />
      <text x="170" y="122" fontSize="8" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="700">
        BON DE LIVRAISON — AMEEX
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="160" y={140 + i * 70} width="270" height="62" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
          <rect x="168" y={148 + i * 70} width="46" height="46" fill="#0f172a" opacity=".85" />
          <rect x="172" y={152 + i * 70} width="38" height="38" fill="#fff" />
          {[...Array(6)].map((_, k) => (
            <rect key={k} x={176 + (k % 3) * 11} y={156 + Math.floor(k / 3) * 15 + i * 70} width={k % 2 ? 4 : 7} height="12" fill="#0f172a" />
          ))}
          <text x="224" y={158 + i * 70} fontSize="7.5" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
            {["Sté Amine — Casablanca", "Hanae L. — Rabat", "Imprim'Plus — Tanger"][i]}
          </text>
          <text x="224" y={170 + i * 70} fontSize="6.5" fill="#475569" fontFamily="Inter, sans-serif">
            {["CMD-2040 · 1 250,00 DH", "CMD-2037 · 89,00 DH", "CMD-2038 · 980,00 DH"][i]}
          </text>
          <text x="224" y={182 + i * 70} fontSize="6.5" fill="#475569" fontFamily="Inter, sans-serif">
            Réf. transporteur AMX-{88210 + i}
          </text>
        </g>
      ))}
      <rect x="456" y="96" width="164" height="264" rx="8" fill="#fff" stroke="#e2e8f0" />
      <text x="466" y="114" fontSize="9" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Suivi
      </text>
      {[
        ["Créé", "09:12", "#059669"],
        ["Ramassé", "11:40", "#059669"],
        ["En transit", "14:05", "#059669"],
        ["En livraison", "—", "#2547e9"],
        ["Livré · COD", "—", "#cbd5e1"],
      ].map((s, i) => (
        <g key={s[0]}>
          <circle cx="474" cy={134 + i * 34} r="5" fill={s[2]} />
          {i < 4 && <line x1="474" x2="474" y1={139 + i * 34} y2={163 + i * 34} stroke="#e2e8f0" strokeWidth="2" />}
          <text x="486" y={132 + i * 34} fontSize="7.5" fontWeight="600" fill="#0f172a" fontFamily="Inter, sans-serif">
            {s[0]}
          </text>
          <text x="486" y={142 + i * 34} fontSize="6.5" fill="#64748b" fontFamily="Inter, sans-serif">
            {s[1]}
          </text>
        </g>
      ))}
      <rect x="466" y="318" width="144" height="26" rx="6" fill="#2547e9" />
      <text x="538" y="334" fontSize="8" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="600">
        Imprimer le bordereau
      </text>
    </>,
  )
}

function Cod() {
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title="Commande CMD-2038 — Encaissement" />
      <Sidebar x={20} y={48} h={332} items={["Commandes", "Finance", "Relevés", "Dépenses"]} />
      <text x="150" y="70" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        CMD-2038 · Imprim&apos;Plus
      </text>
      {[
        ["Prix brut", "3 026,00 DH", "#334155"],
        ["Ajustement manuel", "−46,00 DH", "#dc2626"],
        ["Prix net", "2 980,00 DH", "#0f172a"],
        ["Livraison", "+ 35,00 DH", "#334155"],
        ["Avance encaissée (espèces)", "− 2 035,00 DH", "#059669"],
        ["Reste à payer (COD attendu)", "980,00 DH", "#0f172a"],
      ].map((r, i) => (
        <g key={r[0]}>
          <text x="160" y={100 + i * 26} fontSize="8.5" fill="#64748b" fontFamily="Inter, sans-serif">
            {r[0]}
          </text>
          <text x="430" y={100 + i * 26} fontSize="9" textAnchor="end" fontWeight={i === 5 ? 700 : 500} fill={r[2]} fontFamily="Inter, sans-serif">
            {r[1]}
          </text>
          <line x1="160" x2="430" y1={108 + i * 26} y2={108 + i * 26} stroke="#f1f5f9" />
        </g>
      ))}
      <rect x="160" y="262" width="270" height="86" rx="8" fill="#fef2f2" stroke="#fecaca" />
      <text x="172" y="282" fontSize="8.5" fontWeight="700" fill="#b91c1c" fontFamily="Inter, sans-serif">
        Écart COD détecté
      </text>
      <text x="172" y="298" fontSize="7.5" fill="#7f1d1d" fontFamily="Inter, sans-serif">
        COD collecté par Ameex : 930,00 DH
      </text>
      <text x="172" y="310" fontSize="7.5" fill="#7f1d1d" fontFamily="Inter, sans-serif">
        Reste à payer : 980,00 DH → écart −50,00 DH
      </text>
      <text x="172" y="330" fontSize="7" fill="#991b1b" fontFamily="Inter, sans-serif">
        À pointer avec le transporteur (export CSV : cod_expected / cod_collected)
      </text>
      <rect x="450" y="90" width="170" height="258" rx="8" fill="#fff" stroke="#e2e8f0" />
      <text x="460" y="108" fontSize="9" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Ce mois
      </text>
      {[
        ["COD attendu", "48 300 DH"],
        ["COD collecté", "47 910 DH"],
        ["Écarts à traiter", "3 commandes"],
        ["Avances encaissées", "21 450 DH"],
      ].map((k, i) => (
        <g key={k[0]}>
          <text x="460" y={132 + i * 48} fontSize="7" fill="#64748b" fontFamily="Inter, sans-serif">
            {k[0]}
          </text>
          <text x="460" y={148 + i * 48} fontSize="13" fontWeight="700" fill={i === 2 ? "#dc2626" : "#0f172a"} fontFamily="Inter, sans-serif">
            {k[1]}
          </text>
        </g>
      ))}
    </>,
  )
}

function Clients() {
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title="Clients — Fiche" />
      <Sidebar x={20} y={48} h={332} items={["Commandes", "Clients", "Fidélité", "Codes promo"]} />
      <circle cx="180" cy="90" r="20" fill="#dbe6fe" />
      <text x="180" y="95" fontSize="12" textAnchor="middle" fontWeight="700" fill="#2547e9" fontFamily="Inter, sans-serif">
        SA
      </text>
      <text x="210" y="86" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Sté Amine
      </text>
      <text x="210" y="100" fontSize="7.5" fill="#64748b" fontFamily="Inter, sans-serif">
        06 61 00 00 00 · Casablanca · client depuis mars 2025
      </text>
      <Pill x={470} y={78} w={120} text="★ 1 240 points fidélité" color="#d97706" />
      {[
        ["Commandes", "38"],
        ["Chiffre d'affaires", "84 720 DH"],
        ["Solde à encaisser", "1 250 DH"],
      ].map((k, i) => (
        <g key={k[0]}>
          <rect x={150 + i * 158} y="120" width="148" height="52" rx="8" fill="#fff" stroke="#e2e8f0" />
          <text x={160 + i * 158} y="138" fontSize="7" fill="#64748b" fontFamily="Inter, sans-serif">
            {k[0]}
          </text>
          <text x={160 + i * 158} y="158" fontSize="14" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
            {k[1]}
          </text>
        </g>
      ))}
      <text x="150" y="196" fontSize="9" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Dernières commandes
      </text>
      {[
        ["CMD-2040", "Cartes de visite ×500", "1 250 DH", "Prête", "#0891b2"],
        ["CMD-2036", "Bâche 3×2 m", "3 120 DH", "Livrée · +312 pts", "#059669"],
        ["CMD-2011", "Flyers A5 ×2000", "890 DH", "Livrée · +89 pts", "#059669"],
        ["CMD-1987", "Roll-up", "650 DH", "Récupérée · +65 pts", "#059669"],
      ].map((r, i) => (
        <g key={r[0]}>
          <Row y={204 + i * 34} cols={[r[0], r[1], r[2]]} />
          <Pill x={470} y={206 + i * 34} w={110} text={r[3]} color={r[4]} />
        </g>
      ))}
    </>,
  )
}

function StoreMock() {
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title="boutique.monatelier.ma" />
      <rect x="20" y="48" width="600" height="60" fill="#0f172a" />
      <text x="40" y="84" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">
        Mon Atelier — Boutique en ligne
      </text>
      <text x="600" y="84" fontSize="8" textAnchor="end" fill="#94a3b8" fontFamily="Inter, sans-serif">
        Panier (2)
      </text>
      {["Cartes de visite", "Flyers A5", "Bâche grand format", "Roll-up", "Stickers", "Affiches A2"].map((p, i) => (
        <g key={p}>
          <rect x={40 + (i % 3) * 190} y={124 + Math.floor(i / 3) * 120} width="172" height="106" rx="8" fill="#fff" stroke="#e2e8f0" />
          <rect x={48 + (i % 3) * 190} y={132 + Math.floor(i / 3) * 120} width="156" height="54" rx="4" fill={["#dbe6fe", "#fde68a", "#bbf7d0", "#fbcfe8", "#c7d2fe", "#fed7aa"][i]} />
          <text x={48 + (i % 3) * 190} y={200 + Math.floor(i / 3) * 120} fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
            {p}
          </text>
          <text x={48 + (i % 3) * 190} y={214 + Math.floor(i / 3) * 120} fontSize="7.5" fill="#2547e9" fontFamily="Inter, sans-serif" fontWeight="600">
            à partir de {[120, 90, 350, 450, 60, 40][i]} DH · options
          </text>
        </g>
      ))}
    </>,
  )
}

function Agent() {
  return frame(
    <>
      <rect x="20" y="20" width="600" height="360" rx="10" fill="#fff" stroke="#e2e8f0" filter="url(#mk-shadow)" />
      <rect x="20" y="20" width="600" height="32" rx="10" fill="#2c5282" />
      <rect x="20" y="40" width="600" height="12" fill="#2c5282" />
      <text x="34" y="41" fontSize="10" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">
        PrintManagerOS Sync
        <tspan fontSize="7" fill="#bee3f8">
          {" "}
          v1.0.6
        </tspan>
      </text>
      <rect x="520" y="28" width="46" height="16" rx="8" fill="#48bb78" />
      <text x="543" y="39" fontSize="7" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="700">
        service
      </text>
      <text x="600" y="40" fontSize="7.5" textAnchor="end" fill="#e2e8f0" fontFamily="Inter, sans-serif">
        POSTE-ATELIER-1
      </text>
      <rect x="20" y="52" width="200" height="328" fill="#f8fafc" />
      <text x="32" y="74" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Dossier d&apos;impression (S3)
      </text>
      {["PrintProd/", "  HP-Indigo/", "  Roland-GF/", "  Xerox/", "  Archives/"].map((f, i) => (
        <g key={f}>
          <rect x="28" y={84 + i * 20} width="184" height="16" rx="3" fill={i === 1 ? "#dbe6fe" : "transparent"} />
          <text x="36" y={95 + i * 20} fontSize="7.5" fill={i === 1 ? "#1d36d6" : "#334155"} fontFamily="Inter, sans-serif">
            📁 {f.trim()}
          </text>
        </g>
      ))}
      <rect x="30" y="344" width="180" height="24" rx="5" fill="#2547e9" />
      <text x="120" y="359" fontSize="7.5" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="600">
        Synchroniser ce dossier…
      </text>
      <text x="236" y="74" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Instances de synchronisation
      </text>
      {[
        ["HP Indigo — production", "PrintProd/HP-Indigo → D:\\Impression\\HP", "Actif · 142 fichiers · 2,1 Go", "#059669"],
        ["Roland grand format", "PrintProd/Roland-GF → D:\\Impression\\Roland", "Actif · 38 fichiers · 6,4 Go", "#059669"],
      ].map((r, i) => (
        <g key={r[0]}>
          <rect x="236" y={84 + i * 58} width="372" height="50" rx="6" fill="#fff" stroke="#e2e8f0" />
          <text x="246" y={100 + i * 58} fontSize="8" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
            {r[0]}
          </text>
          <text x="246" y={112 + i * 58} fontSize="6.5" fill="#64748b" fontFamily="Inter, sans-serif">
            {r[1]}
          </text>
          <text x="246" y={124 + i * 58} fontSize="6.5" fill={r[3]} fontFamily="Inter, sans-serif" fontWeight="600">
            {r[2]}
          </text>
        </g>
      ))}
      <text x="236" y="216" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Fichiers
      </text>
      {[
        ["CMD-2041_flyer-A5.pdf", 100, "#059669", "Terminé"],
        ["CMD-2040_cartes-350g.pdf", 100, "#059669", "Terminé"],
        ["CMD-2038_bache-3x2.tif", 62, "#2547e9", "38 Mo · 62 % · 4 morceaux"],
        ["CMD-2037_affiche-A2.pdf", 15, "#2547e9", "En file"],
      ].map((f, i) => (
        <g key={f[0] as string}>
          <text x="236" y={236 + i * 30} fontSize="7.5" fill="#0f172a" fontFamily="Inter, sans-serif">
            {f[0]}
          </text>
          <text x="608" y={236 + i * 30} fontSize="6.5" textAnchor="end" fill="#64748b" fontFamily="Inter, sans-serif">
            {f[3]}
          </text>
          <rect x="236" y={242 + i * 30} width="372" height="5" rx="2.5" fill="#e2e8f0" />
          <rect x="236" y={242 + i * 30} width={(372 * (f[1] as number)) / 100} height="5" rx="2.5" fill={f[2] as string} />
        </g>
      ))}
    </>,
  )
}

function Dashboard() {
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title="Tableau de bord — Septembre" />
      <Sidebar x={20} y={48} h={332} items={["Tableau de bord", "Commandes", "Clients", "Livraison", "Finance"]} />
      {[
        ["Chiffre d'affaires", "128 450 DH", "+12 %", "#059669"],
        ["Commandes", "412", "+8 %", "#059669"],
        ["En livraison", "37", "", "#2547e9"],
        ["Reste à encaisser", "18 320 DH", "3 écarts", "#dc2626"],
      ].map((k, i) => (
        <g key={k[0]}>
          <rect x={150 + i * 118} y="66" width="108" height="58" rx="8" fill="#fff" stroke="#e2e8f0" />
          <text x={160 + i * 118} y="82" fontSize="6.5" fill="#64748b" fontFamily="Inter, sans-serif">
            {k[0]}
          </text>
          <text x={160 + i * 118} y="100" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
            {k[1]}
          </text>
          <text x={160 + i * 118} y="114" fontSize="6.5" fill={k[3]} fontFamily="Inter, sans-serif" fontWeight="600">
            {k[2]}
          </text>
        </g>
      ))}
      <rect x="150" y="136" width="300" height="224" rx="8" fill="#fff" stroke="#e2e8f0" />
      <text x="160" y="154" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Ventes par jour
      </text>
      {[30, 45, 38, 60, 52, 70, 64, 80, 58, 74, 90, 68, 84, 96].map((h, i) => (
        <rect key={i} x={164 + i * 20} y={340 - h * 1.7} width="12" height={h * 1.7} rx="2" fill={i === 13 ? "#2547e9" : "#bfd3fe"} />
      ))}
      <rect x="462" y="136" width="158" height="224" rx="8" fill="#fff" stroke="#e2e8f0" />
      <text x="472" y="154" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
        Par statut
      </text>
      {[
        ["Nouvelles", 24, "#2547e9"],
        ["En production", 61, "#7c3aed"],
        ["Prêtes", 18, "#0891b2"],
        ["En livraison", 37, "#d97706"],
        ["Livrées", 248, "#059669"],
        ["Retours", 6, "#dc2626"],
      ].map((s, i) => (
        <g key={s[0] as string}>
          <text x="472" y={176 + i * 30} fontSize="7" fill="#334155" fontFamily="Inter, sans-serif">
            {s[0]}
          </text>
          <text x="610" y={176 + i * 30} fontSize="7" textAnchor="end" fill="#0f172a" fontWeight="700" fontFamily="Inter, sans-serif">
            {s[1]}
          </text>
          <rect x="472" y={181 + i * 30} width="138" height="4" rx="2" fill="#f1f5f9" />
          <rect x="472" y={181 + i * 30} width={Math.max(6, ((s[1] as number) / 248) * 138)} height="4" rx="2" fill={s[2] as string} />
        </g>
      ))}
    </>,
  )
}

export function Mockup({ kind, className = "" }: { kind: Kind; className?: string }) {
  const m = { orders: Orders, workshop: Workshop, delivery: Delivery, cod: Cod, clients: Clients, store: StoreMock, agent: Agent, dashboard: Dashboard }[kind]
  return <div className={`overflow-hidden rounded-2xl ${className}`}>{m()}</div>
}
