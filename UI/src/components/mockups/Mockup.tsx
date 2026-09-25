// Illustrations vectorielles « captures d'écran stylisées » de l'application,
// TRADUITES selon la langue du site (fr / ar / en). Dessinées en SVG pour
// rester nettes à toute taille, sans photo à héberger. Remplacez-les par de
// vraies captures (public/screens/*.png) quand vous en aurez.

import type { Feature } from "@/content/fr/features"
import type { Locale } from "@/i18n/config"
import { site } from "@/content/site.config"

type Kind = Feature["mockup"]

// ---------------------------------------------------------------------------
// Textes des captures par langue
// ---------------------------------------------------------------------------
const STR = {
  fr: {
    font: "Inter, sans-serif",
    cur: "DH",
    nav: { dashboard: "Tableau de bord", orders: "Commandes", clients: "Clients", delivery: "Livraison", workshop: "Atelier", finance: "Finance", sync: "Synchronisation", pickups: "Ramassages", couriers: "Livreurs", statements: "Relevés", expenses: "Dépenses", loyalty: "Fidélité", promo: "Codes promo" },
    orders: { title: "Commandes", search: "Rechercher une commande, un client…", newBtn: "+ Nouvelle", cols: ["Référence", "Client", "Prix commande", "Reste à payer", "Statut"], detail1: "Avance : 50,00 DH · + livraison 35 DH", detail2: "Ajustement manuel : −46,00 DH", gap: "Écart COD", st: { prod: "En production", ready: "Prête", delivered: "Livrée", shipping: "En livraison", new: "Nouvelle" } },
    workshop: { title: "Atelier — Fichiers prêts", cols: ["À imprimer", "En cours", "Terminé"], machines: ["HP Indigo", "Roland grand format", "Xerox", "HP Indigo"], mb: "Mo" },
    delivery: { title: "Livraison — Ramassage #318 (Ameex)", h: "Ramassage #318", sub: "Créé par Yassine (vendeur) · Ameex · 6 colis · COD total 4 130,00 DH", note: "BON DE LIVRAISON — AMEEX", ref: "Réf. transporteur", tracking: "Suivi", steps: ["Créé", "Ramassé", "En transit", "En livraison", "Livré · COD"], print: "Imprimer le bordereau" },
    cod: { title: "Commande CMD-2038 — Encaissement", rows: ["Prix brut", "Ajustement manuel", "Prix net", "Livraison", "Avance encaissée (espèces)", "Reste à payer (COD attendu)"], gapT: "Écart COD détecté", gap1: "COD collecté par Ameex : 930,00 DH", gap2: "Reste à payer : 980,00 DH → écart −50,00 DH", gap3: "À pointer avec le transporteur (export CSV)", month: "Ce mois", kpis: ["COD attendu", "COD collecté", "Écarts à traiter", "Avances encaissées"], gaps: "3 commandes" },
    clients: { title: "Clients — Fiche", meta: "06 61 00 00 00 · Casablanca · client depuis mars 2025", pts: "★ 1 240 points fidélité", kpis: ["Commandes", "Chiffre d'affaires", "Solde à encaisser"], last: "Dernières commandes", items: ["Cartes de visite ×500", "Bâche 3×2 m", "Flyers A5 ×2000", "Roll-up"], st: ["Prête", "Livrée · +312 pts", "Livrée · +89 pts", "Récupérée · +65 pts"] },
    store: { title: "boutique.monatelier.ma", h: "Mon Atelier — Boutique en ligne", cart: "Panier (2)", products: ["Cartes de visite", "Flyers A5", "Bâche grand format", "Roll-up", "Stickers", "Affiches A2"], from: "à partir de", opts: "options" },
    agent: { service: "service", host: "POSTE-ATELIER-1", folder: "Dossier d'impression", sync: "Synchroniser ce dossier…", instances: "Instances de synchronisation", inst: ["HP Indigo — production", "Roland grand format"], active: "Actif", files: "fichiers", gb: "Go", filesT: "Fichiers", done: "Terminé", queued: "En file", chunks: "38 Mo · 62 % · 4 morceaux" },
    dashboard: { title: "Tableau de bord — Septembre", kpis: ["Chiffre d'affaires", "Commandes", "En livraison", "Reste à encaisser"], gaps: "3 écarts", sales: "Ventes par jour", byStatus: "Par statut", st: ["Nouvelles", "En production", "Prêtes", "En livraison", "Livrées", "Retours"] },
  },
  en: {
    font: "Inter, sans-serif",
    cur: "MAD",
    nav: { dashboard: "Dashboard", orders: "Orders", clients: "Customers", delivery: "Delivery", workshop: "Workshop", finance: "Finance", sync: "Sync", pickups: "Pickups", couriers: "Couriers", statements: "Statements", expenses: "Expenses", loyalty: "Loyalty", promo: "Promo codes" },
    orders: { title: "Orders", search: "Search an order, a customer…", newBtn: "+ New", cols: ["Reference", "Customer", "Order price", "Balance due", "Status"], detail1: "Deposit: 50.00 MAD · + shipping 35 MAD", detail2: "Manual adjustment: −46.00 MAD", gap: "COD gap", st: { prod: "In production", ready: "Ready", delivered: "Delivered", shipping: "Out for delivery", new: "New" } },
    workshop: { title: "Workshop — Ready files", cols: ["To print", "In progress", "Done"], machines: ["HP Indigo", "Roland large format", "Xerox", "HP Indigo"], mb: "MB" },
    delivery: { title: "Delivery — Pickup #318 (Ameex)", h: "Pickup #318", sub: "Created by Yassine (sales) · Ameex · 6 parcels · total COD 4,130.00 MAD", note: "DELIVERY NOTE — AMEEX", ref: "Carrier ref.", tracking: "Tracking", steps: ["Created", "Picked up", "In transit", "Out for delivery", "Delivered · COD"], print: "Print the note" },
    cod: { title: "Order CMD-2038 — Collection", rows: ["Gross price", "Manual adjustment", "Net price", "Shipping", "Deposit collected (cash)", "Balance due (expected COD)"], gapT: "COD gap detected", gap1: "COD collected by Ameex: 930.00 MAD", gap2: "Balance due: 980.00 MAD → gap −50.00 MAD", gap3: "To reconcile with the carrier (CSV export)", month: "This month", kpis: ["Expected COD", "Collected COD", "Gaps to handle", "Deposits collected"], gaps: "3 orders" },
    clients: { title: "Customers — Record", meta: "06 61 00 00 00 · Casablanca · customer since March 2025", pts: "★ 1,240 loyalty points", kpis: ["Orders", "Revenue", "Balance to collect"], last: "Latest orders", items: ["Business cards ×500", "Banner 3×2 m", "Flyers A5 ×2000", "Roll-up"], st: ["Ready", "Delivered · +312 pts", "Delivered · +89 pts", "Picked up · +65 pts"] },
    store: { title: "shop.myworkshop.ma", h: "My Workshop — Online store", cart: "Cart (2)", products: ["Business cards", "Flyers A5", "Large format banner", "Roll-up", "Stickers", "Posters A2"], from: "from", opts: "options" },
    agent: { service: "service", host: "WORKSHOP-PC-1", folder: "Print folder", sync: "Sync this folder…", instances: "Sync instances", inst: ["HP Indigo — production", "Roland large format"], active: "Active", files: "files", gb: "GB", filesT: "Files", done: "Done", queued: "Queued", chunks: "38 MB · 62 % · 4 chunks" },
    dashboard: { title: "Dashboard — September", kpis: ["Revenue", "Orders", "Out for delivery", "To collect"], gaps: "3 gaps", sales: "Sales per day", byStatus: "By status", st: ["New", "In production", "Ready", "Out for delivery", "Delivered", "Returns"] },
  },
  ar: {
    font: "Cairo, Inter, sans-serif",
    cur: "درهم",
    nav: { dashboard: "لوحة القيادة", orders: "الطلبيات", clients: "الزبناء", delivery: "التوصيل", workshop: "الورشة", finance: "المالية", sync: "المزامنة", pickups: "عمليات الجمع", couriers: "الموزّعون", statements: "كشوف الحساب", expenses: "المصاريف", loyalty: "الولاء", promo: "أكواد الخصم" },
    orders: { title: "الطلبيات", search: "ابحث عن طلبية، زبون…", newBtn: "+ جديدة", cols: ["المرجع", "الزبون", "ثمن الطلبية", "المتبقي للدفع", "الحالة"], detail1: "تسبيق: 50,00 درهم · + توصيل 35 درهم", detail2: "تعديل يدوي: −46,00 درهم", gap: "فرق COD", st: { prod: "قيد الإنتاج", ready: "جاهزة", delivered: "مسلَّمة", shipping: "قيد التوصيل", new: "جديدة" } },
    workshop: { title: "الورشة — ملفات جاهزة", cols: ["للطباعة", "قيد التنفيذ", "منتهي"], machines: ["HP Indigo", "Roland حجم كبير", "Xerox", "HP Indigo"], mb: "م.ب" },
    delivery: { title: "التوصيل — عملية جمع #318 (Ameex)", h: "عملية جمع #318", sub: "أنشأها ياسين (بائع) · Ameex · 6 طرود · مجموع COD 4 130,00 درهم", note: "وصل التوصيل — AMEEX", ref: "مرجع الناقل", tracking: "التتبع", steps: ["أُنشئت", "جُمعت", "قيد النقل", "قيد التوصيل", "سُلِّمت · COD"], print: "طباعة الوصل" },
    cod: { title: "الطلبية CMD-2038 — التحصيل", rows: ["الثمن الإجمالي", "تعديل يدوي", "الثمن الصافي", "التوصيل", "تسبيق محصَّل (نقداً)", "المتبقي للدفع (COD المنتظر)"], gapT: "تم رصد فرق COD", gap1: "COD المحصَّل من Ameex: 930,00 درهم", gap2: "المتبقي للدفع: 980,00 درهم ← فرق −50,00 درهم", gap3: "للمطابقة مع الناقل (تصدير CSV)", month: "هذا الشهر", kpis: ["COD المنتظر", "COD المحصَّل", "فروقات للمعالجة", "تسبيقات محصَّلة"], gaps: "3 طلبيات" },
    clients: { title: "الزبناء — بطاقة", meta: "06 61 00 00 00 · الدار البيضاء · زبون منذ مارس 2025", pts: "★ 1 240 نقطة ولاء", kpis: ["الطلبيات", "رقم المعاملات", "رصيد للتحصيل"], last: "آخر الطلبيات", items: ["بطاقات زيارة ×500", "لافتة 3×2 م", "مطويات A5 ×2000", "Roll-up"], st: ["جاهزة", "مسلَّمة · +312 نقطة", "مسلَّمة · +89 نقطة", "مستلَمة · +65 نقطة"] },
    store: { title: "boutique.monatelier.ma", h: "ورشتي — المتجر الإلكتروني", cart: "السلة (2)", products: ["بطاقات زيارة", "مطويات A5", "لافتة حجم كبير", "Roll-up", "ملصقات", "ملصقات إعلانية A2"], from: "ابتداءً من", opts: "خيارات" },
    agent: { service: "خدمة", host: "POSTE-ATELIER-1", folder: "مجلد الطباعة", sync: "مزامنة هذا المجلد…", instances: "نسخ المزامنة", inst: ["HP Indigo — إنتاج", "Roland حجم كبير"], active: "نشط", files: "ملفات", gb: "ج.ب", filesT: "الملفات", done: "منتهي", queued: "في الانتظار", chunks: "38 م.ب · 62 % · 4 أجزاء" },
    dashboard: { title: "لوحة القيادة — شتنبر", kpis: ["رقم المعاملات", "الطلبيات", "قيد التوصيل", "المتبقي للتحصيل"], gaps: "3 فروقات", sales: "المبيعات حسب اليوم", byStatus: "حسب الحالة", st: ["جديدة", "قيد الإنتاج", "جاهزة", "قيد التوصيل", "مسلَّمة", "مرتجعات"] },
  },
} as const

type S = (typeof STR)["fr"] | (typeof STR)["en"] | (typeof STR)["ar"]

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

const Window = ({ x, y, w, h, title, f }: { x: number; y: number; w: number; h: number; title: string; f: string }) => (
  <g filter="url(#mk-shadow)">
    <rect x={x} y={y} width={w} height={h} rx="10" fill="#fff" stroke="#e2e8f0" />
    <rect x={x} y={y} width={w} height="28" rx="10" fill="#f1f5f9" />
    <rect x={x} y={y + 18} width={w} height="10" fill="#f1f5f9" />
    <circle cx={x + 14} cy={y + 14} r="4" fill="#fca5a5" />
    <circle cx={x + 26} cy={y + 14} r="4" fill="#fcd34d" />
    <circle cx={x + 38} cy={y + 14} r="4" fill="#86efac" />
    <text x={x + 54} y={y + 18} fontSize="10" fill="#64748b" fontFamily={f}>
      {title}
    </text>
  </g>
)

const Sidebar = ({ x, y, h, items, f }: { x: number; y: number; h: number; items: string[]; f: string }) => (
  <g>
    <rect x={x} y={y} width="110" height={h} fill="#0f172a" />
    <rect x={x + 12} y={y + 14} width="60" height="10" rx="3" fill="#3b66f5" />
    {items.map((it, i) => (
      <g key={it}>
        <rect x={x + 12} y={y + 40 + i * 22} width="86" height="14" rx="4" fill={i === 1 ? "#1e2ead" : "transparent"} />
        <text x={x + 18} y={y + 50 + i * 22} fontSize="8" fill={i === 1 ? "#fff" : "#94a3b8"} fontFamily={f}>
          {it}
        </text>
      </g>
    ))}
  </g>
)

const Pill = ({ x, y, w, text, color, f }: { x: number; y: number; w: number; text: string; color: string; f: string }) => (
  <g>
    <rect x={x} y={y} width={w} height="14" rx="7" fill={color} opacity=".15" />
    <text x={x + w / 2} y={y + 10} fontSize="7.5" textAnchor="middle" fill={color} fontFamily={f} fontWeight="600">
      {text}
    </text>
  </g>
)

const Row = ({ y, cols, colors = [], f }: { y: number; cols: string[]; colors?: string[]; f: string }) => (
  <g>
    <line x1="150" x2="620" y1={y + 18} y2={y + 18} stroke="#f1f5f9" />
    {cols.map((c, i) => (
      <text key={i} x={[158, 240, 340, 430, 520][i]} y={y + 11} fontSize="8" fill={colors[i] || "#334155"} fontFamily={f}>
        {c}
      </text>
    ))}
  </g>
)

function Orders(s: S) {
  const f = s.font
  const o = s.orders
  const gray = ["#64748b", "#64748b", "#64748b", "#64748b", "#64748b"]
  const rows = [
    ["CMD-2041", "Atelier Nour", `134,00 ${s.cur}`, `84,00 ${s.cur}`, o.st.prod, "#7c3aed"],
    ["CMD-2040", "Sté Amine", `1 250,00 ${s.cur}`, `1 250,00 ${s.cur}`, o.st.ready, "#0891b2"],
    ["CMD-2039", "Karim B.", `460,00 ${s.cur}`, `0,00 ${s.cur}`, o.st.delivered, "#059669"],
    ["CMD-2038", "Imprim'Plus", `2 980,00 ${s.cur}`, `980,00 ${s.cur}`, o.st.shipping, "#d97706"],
    ["CMD-2037", "Hanae L.", `89,00 ${s.cur}`, `89,00 ${s.cur}`, o.st.new, "#2547e9"],
    ["CMD-2036", "Sté Amine", `3 120,00 ${s.cur}`, `0,00 ${s.cur}`, o.st.delivered, "#059669"],
  ]
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title={`${o.title} — ${site.brand}`} f={f} />
      <Sidebar x={20} y={48} h={332} items={[s.nav.dashboard, s.nav.orders, s.nav.clients, s.nav.delivery, s.nav.workshop, s.nav.finance]} f={f} />
      <text x="150" y="70" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {o.title}
      </text>
      <rect x="150" y="80" width="200" height="18" rx="6" fill="#f1f5f9" />
      <text x="158" y="92" fontSize="7.5" fill="#94a3b8" fontFamily={f}>
        {o.search}
      </text>
      <rect x="540" y="78" width="80" height="20" rx="6" fill="#2547e9" />
      <text x="580" y="91" fontSize="8" textAnchor="middle" fill="#fff" fontFamily={f} fontWeight="600">
        {o.newBtn}
      </text>
      <rect x="150" y="108" width="470" height="18" fill="#f8fafc" />
      <Row y={108} cols={[...o.cols]} colors={gray} f={f} />
      {rows.map((r, i) => (
        <g key={r[0]}>
          <Row y={130 + i * 34} cols={[r[0], r[1], r[2], r[3]]} f={f} />
          <Pill x={520} y={130 + i * 34 + 2} w={70} text={r[4]} color={r[5]} f={f} />
          {i === 0 && (
            <>
              <text x="340" y="153" fontSize="6.5" fill="#94a3b8" fontFamily={f}>
                {o.detail1}
              </text>
              <text x="340" y="161" fontSize="6.5" fill="#dc2626" fontFamily={f}>
                {o.detail2}
              </text>
            </>
          )}
          {i === 3 && <Pill x={430} y={130 + i * 34 + 14} w={62} text={o.gap} color="#dc2626" f={f} />}
        </g>
      ))}
    </>,
  )
}

function Workshop(s: S) {
  const f = s.font
  const w = s.workshop
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title={w.title} f={f} />
      <Sidebar x={20} y={48} h={332} items={[s.nav.dashboard, s.nav.workshop, s.nav.orders, s.nav.sync]} f={f} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={150 + i * 155} y="70" width="145" height="290" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
          <text x={160 + i * 155} y="88" fontSize="9" fontWeight="700" fill="#0f172a" fontFamily={f}>
            {w.cols[i]}
          </text>
          {[0, 1, 2, 3].slice(0, 4 - i).map((j) => (
            <g key={j}>
              <rect x={158 + i * 155} y={100 + j * 60} width="129" height="50" rx="6" fill="#fff" stroke="#e2e8f0" />
              <rect x={166 + i * 155} y={108 + j * 60} width="18" height="22" rx="3" fill="#dbe6fe" />
              <text x={190 + i * 155} y={117 + j * 60} fontSize="7.5" fontWeight="600" fill="#0f172a" fontFamily={f}>
                CMD-20{40 - j - i * 3} · {["flyer-A5", "bache-3x2", "cartes-350g", "affiche-A2"][j]}.pdf
              </text>
              <text x={190 + i * 155} y={128 + j * 60} fontSize="6.5" fill="#64748b" fontFamily={f}>
                {w.machines[j]} · {["12", "38", "4", "9"][j]} {w.mb}
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

function Delivery(s: S) {
  const f = s.font
  const d = s.delivery
  const times = ["09:12", "11:40", "14:05", "—", "—"]
  const colors = ["#059669", "#059669", "#059669", "#2547e9", "#cbd5e1"]
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title={d.title} f={f} />
      <Sidebar x={20} y={48} h={332} items={[s.nav.orders, s.nav.delivery, s.nav.pickups, s.nav.couriers]} f={f} />
      <text x="150" y="70" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {d.h}
      </text>
      <text x="150" y="84" fontSize="7.5" fill="#64748b" fontFamily={f}>
        {d.sub}
      </text>
      <rect x="150" y="96" width="290" height="264" rx="8" fill="#fff" stroke="#e2e8f0" />
      <rect x="160" y="106" width="270" height="26" rx="4" fill="#0f172a" />
      <text x="170" y="122" fontSize="8" fill="#fff" fontFamily={f} fontWeight="700">
        {d.note}
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="160" y={140 + i * 70} width="270" height="62" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
          <rect x="168" y={148 + i * 70} width="46" height="46" fill="#0f172a" opacity=".85" />
          <rect x="172" y={152 + i * 70} width="38" height="38" fill="#fff" />
          {[...Array(6)].map((_, k) => (
            <rect key={k} x={176 + (k % 3) * 11} y={156 + Math.floor(k / 3) * 15 + i * 70} width={k % 2 ? 4 : 7} height="12" fill="#0f172a" />
          ))}
          <text x="224" y={158 + i * 70} fontSize="7.5" fontWeight="700" fill="#0f172a" fontFamily={f}>
            {["Sté Amine — Casablanca", "Hanae L. — Rabat", "Imprim'Plus — Tanger"][i]}
          </text>
          <text x="224" y={170 + i * 70} fontSize="6.5" fill="#475569" fontFamily={f}>
            {[`CMD-2040 · 1 250,00 ${s.cur}`, `CMD-2037 · 89,00 ${s.cur}`, `CMD-2038 · 980,00 ${s.cur}`][i]}
          </text>
          <text x="224" y={182 + i * 70} fontSize="6.5" fill="#475569" fontFamily={f}>
            {d.ref} AMX-{88210 + i}
          </text>
        </g>
      ))}
      <rect x="456" y="96" width="164" height="264" rx="8" fill="#fff" stroke="#e2e8f0" />
      <text x="466" y="114" fontSize="9" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {d.tracking}
      </text>
      {d.steps.map((st, i) => (
        <g key={st}>
          <circle cx="474" cy={134 + i * 34} r="5" fill={colors[i]} />
          {i < 4 && <line x1="474" x2="474" y1={139 + i * 34} y2={163 + i * 34} stroke="#e2e8f0" strokeWidth="2" />}
          <text x="486" y={132 + i * 34} fontSize="7.5" fontWeight="600" fill="#0f172a" fontFamily={f}>
            {st}
          </text>
          <text x="486" y={142 + i * 34} fontSize="6.5" fill="#64748b" fontFamily={f}>
            {times[i]}
          </text>
        </g>
      ))}
      <rect x="466" y="318" width="144" height="26" rx="6" fill="#2547e9" />
      <text x="538" y="334" fontSize="8" textAnchor="middle" fill="#fff" fontFamily={f} fontWeight="600">
        {d.print}
      </text>
    </>,
  )
}

function Cod(s: S) {
  const f = s.font
  const c = s.cod
  const vals = [`3 026,00 ${s.cur}`, `−46,00 ${s.cur}`, `2 980,00 ${s.cur}`, `+ 35,00 ${s.cur}`, `− 2 035,00 ${s.cur}`, `980,00 ${s.cur}`]
  const cols = ["#334155", "#dc2626", "#0f172a", "#334155", "#059669", "#0f172a"]
  const kv = [`48 300 ${s.cur}`, `47 910 ${s.cur}`, c.gaps, `21 450 ${s.cur}`]
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title={c.title} f={f} />
      <Sidebar x={20} y={48} h={332} items={[s.nav.orders, s.nav.finance, s.nav.statements, s.nav.expenses]} f={f} />
      <text x="150" y="70" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily={f}>
        CMD-2038 · Imprim&apos;Plus
      </text>
      {c.rows.map((r, i) => (
        <g key={r}>
          <text x="160" y={100 + i * 26} fontSize="8.5" fill="#64748b" fontFamily={f}>
            {r}
          </text>
          <text x="430" y={100 + i * 26} fontSize="9" textAnchor="end" fontWeight={i === 5 ? 700 : 500} fill={cols[i]} fontFamily={f}>
            {vals[i]}
          </text>
          <line x1="160" x2="430" y1={108 + i * 26} y2={108 + i * 26} stroke="#f1f5f9" />
        </g>
      ))}
      <rect x="160" y="262" width="270" height="86" rx="8" fill="#fef2f2" stroke="#fecaca" />
      <text x="172" y="282" fontSize="8.5" fontWeight="700" fill="#b91c1c" fontFamily={f}>
        {c.gapT}
      </text>
      <text x="172" y="298" fontSize="7.5" fill="#7f1d1d" fontFamily={f}>
        {c.gap1}
      </text>
      <text x="172" y="310" fontSize="7.5" fill="#7f1d1d" fontFamily={f}>
        {c.gap2}
      </text>
      <text x="172" y="330" fontSize="7" fill="#991b1b" fontFamily={f}>
        {c.gap3}
      </text>
      <rect x="450" y="90" width="170" height="258" rx="8" fill="#fff" stroke="#e2e8f0" />
      <text x="460" y="108" fontSize="9" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {c.month}
      </text>
      {c.kpis.map((k, i) => (
        <g key={k}>
          <text x="460" y={132 + i * 48} fontSize="7" fill="#64748b" fontFamily={f}>
            {k}
          </text>
          <text x="460" y={148 + i * 48} fontSize="13" fontWeight="700" fill={i === 2 ? "#dc2626" : "#0f172a"} fontFamily={f}>
            {kv[i]}
          </text>
        </g>
      ))}
    </>,
  )
}

function Clients(s: S) {
  const f = s.font
  const c = s.clients
  const kv = ["38", `84 720 ${s.cur}`, `1 250 ${s.cur}`]
  const prices = [`1 250 ${s.cur}`, `3 120 ${s.cur}`, `890 ${s.cur}`, `650 ${s.cur}`]
  const colors = ["#0891b2", "#059669", "#059669", "#059669"]
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title={c.title} f={f} />
      <Sidebar x={20} y={48} h={332} items={[s.nav.orders, s.nav.clients, s.nav.loyalty, s.nav.promo]} f={f} />
      <circle cx="180" cy="90" r="20" fill="#dbe6fe" />
      <text x="180" y="95" fontSize="12" textAnchor="middle" fontWeight="700" fill="#2547e9" fontFamily={f}>
        SA
      </text>
      <text x="210" y="86" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily={f}>
        Sté Amine
      </text>
      <text x="210" y="100" fontSize="7.5" fill="#64748b" fontFamily={f}>
        {c.meta}
      </text>
      <Pill x={470} y={78} w={120} text={c.pts} color="#d97706" f={f} />
      {c.kpis.map((k, i) => (
        <g key={k}>
          <rect x={150 + i * 158} y="120" width="148" height="52" rx="8" fill="#fff" stroke="#e2e8f0" />
          <text x={160 + i * 158} y="138" fontSize="7" fill="#64748b" fontFamily={f}>
            {k}
          </text>
          <text x={160 + i * 158} y="158" fontSize="14" fontWeight="700" fill="#0f172a" fontFamily={f}>
            {kv[i]}
          </text>
        </g>
      ))}
      <text x="150" y="196" fontSize="9" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {c.last}
      </text>
      {["CMD-2040", "CMD-2036", "CMD-2011", "CMD-1987"].map((ref, i) => (
        <g key={ref}>
          <Row y={204 + i * 34} cols={[ref, c.items[i], prices[i]]} f={f} />
          <Pill x={470} y={206 + i * 34} w={110} text={c.st[i]} color={colors[i]} f={f} />
        </g>
      ))}
    </>,
  )
}

function StoreMock(s: S) {
  const f = s.font
  const st = s.store
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title={st.title} f={f} />
      <rect x="20" y="48" width="600" height="60" fill="#0f172a" />
      <text x="40" y="84" fontSize="14" fontWeight="700" fill="#fff" fontFamily={f}>
        {st.h}
      </text>
      <text x="600" y="84" fontSize="8" textAnchor="end" fill="#94a3b8" fontFamily={f}>
        {st.cart}
      </text>
      {st.products.map((p, i) => (
        <g key={p}>
          <rect x={40 + (i % 3) * 190} y={124 + Math.floor(i / 3) * 120} width="172" height="106" rx="8" fill="#fff" stroke="#e2e8f0" />
          <rect x={48 + (i % 3) * 190} y={132 + Math.floor(i / 3) * 120} width="156" height="54" rx="4" fill={["#dbe6fe", "#fde68a", "#bbf7d0", "#fbcfe8", "#c7d2fe", "#fed7aa"][i]} />
          <text x={48 + (i % 3) * 190} y={200 + Math.floor(i / 3) * 120} fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily={f}>
            {p}
          </text>
          <text x={48 + (i % 3) * 190} y={214 + Math.floor(i / 3) * 120} fontSize="7.5" fill="#2547e9" fontFamily={f} fontWeight="600">
            {st.from} {[120, 90, 350, 450, 60, 40][i]} {s.cur} · {st.opts}
          </text>
        </g>
      ))}
    </>,
  )
}

function Agent(s: S) {
  const f = s.font
  const a = s.agent
  const inst = [
    [a.inst[0], "PrintProd/HP-Indigo → D:\\Impression\\HP", `${a.active} · 142 ${a.files} · 2,1 ${a.gb}`],
    [a.inst[1], "PrintProd/Roland-GF → D:\\Impression\\Roland", `${a.active} · 38 ${a.files} · 6,4 ${a.gb}`],
  ]
  const files: [string, number, string, string][] = [
    ["CMD-2041_flyer-A5.pdf", 100, "#059669", a.done],
    ["CMD-2040_cartes-350g.pdf", 100, "#059669", a.done],
    ["CMD-2038_bache-3x2.tif", 62, "#2547e9", a.chunks],
    ["CMD-2037_affiche-A2.pdf", 15, "#2547e9", a.queued],
  ]
  return frame(
    <>
      <rect x="20" y="20" width="600" height="360" rx="10" fill="#fff" stroke="#e2e8f0" filter="url(#mk-shadow)" />
      <rect x="20" y="20" width="600" height="32" rx="10" fill="#2c5282" />
      <rect x="20" y="40" width="600" height="12" fill="#2c5282" />
      <text x="34" y="41" fontSize="10" fontWeight="700" fill="#fff" fontFamily={f}>
        {site.agentName}
        <tspan fontSize="7" fill="#bee3f8">
          {" "}
          v1.0.6
        </tspan>
      </text>
      <rect x="520" y="28" width="46" height="16" rx="8" fill="#48bb78" />
      <text x="543" y="39" fontSize="7" textAnchor="middle" fill="#fff" fontFamily={f} fontWeight="700">
        {a.service}
      </text>
      <text x="600" y="40" fontSize="7.5" textAnchor="end" fill="#e2e8f0" fontFamily={f}>
        {a.host}
      </text>
      <rect x="20" y="52" width="200" height="328" fill="#f8fafc" />
      <text x="32" y="74" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {a.folder}
      </text>
      {["PrintProd/", "HP-Indigo/", "Roland-GF/", "Xerox/", "Archives/"].map((fo, i) => (
        <g key={fo}>
          <rect x="28" y={84 + i * 20} width="184" height="16" rx="3" fill={i === 1 ? "#dbe6fe" : "transparent"} />
          <text x="36" y={95 + i * 20} fontSize="7.5" fill={i === 1 ? "#1d36d6" : "#334155"} fontFamily={f}>
            📁 {fo}
          </text>
        </g>
      ))}
      <rect x="30" y="344" width="180" height="24" rx="5" fill="#2547e9" />
      <text x="120" y="359" fontSize="7.5" textAnchor="middle" fill="#fff" fontFamily={f} fontWeight="600">
        {a.sync}
      </text>
      <text x="236" y="74" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {a.instances}
      </text>
      {inst.map((r, i) => (
        <g key={r[0]}>
          <rect x="236" y={84 + i * 58} width="372" height="50" rx="6" fill="#fff" stroke="#e2e8f0" />
          <text x="246" y={100 + i * 58} fontSize="8" fontWeight="700" fill="#0f172a" fontFamily={f}>
            {r[0]}
          </text>
          <text x="246" y={112 + i * 58} fontSize="6.5" fill="#64748b" fontFamily={f}>
            {r[1]}
          </text>
          <text x="246" y={124 + i * 58} fontSize="6.5" fill="#059669" fontFamily={f} fontWeight="600">
            {r[2]}
          </text>
        </g>
      ))}
      <text x="236" y="216" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {a.filesT}
      </text>
      {files.map((fl, i) => (
        <g key={fl[0]}>
          <text x="236" y={236 + i * 30} fontSize="7.5" fill="#0f172a" fontFamily={f}>
            {fl[0]}
          </text>
          <text x="608" y={236 + i * 30} fontSize="6.5" textAnchor="end" fill="#64748b" fontFamily={f}>
            {fl[3]}
          </text>
          <rect x="236" y={242 + i * 30} width="372" height="5" rx="2.5" fill="#e2e8f0" />
          <rect x="236" y={242 + i * 30} width={(372 * fl[1]) / 100} height="5" rx="2.5" fill={fl[2]} />
        </g>
      ))}
    </>,
  )
}

function Dashboard(s: S) {
  const f = s.font
  const d = s.dashboard
  const kv = [`128 450 ${s.cur}`, "412", "37", `18 320 ${s.cur}`]
  const kd = ["+12 %", "+8 %", "", d.gaps]
  const kc = ["#059669", "#059669", "#2547e9", "#dc2626"]
  const counts = [24, 61, 18, 37, 248, 6]
  const cc = ["#2547e9", "#7c3aed", "#0891b2", "#d97706", "#059669", "#dc2626"]
  return frame(
    <>
      <Window x={20} y={20} w={600} h={360} title={d.title} f={f} />
      <Sidebar x={20} y={48} h={332} items={[s.nav.dashboard, s.nav.orders, s.nav.clients, s.nav.delivery, s.nav.finance]} f={f} />
      {d.kpis.map((k, i) => (
        <g key={k}>
          <rect x={150 + i * 118} y="66" width="108" height="58" rx="8" fill="#fff" stroke="#e2e8f0" />
          <text x={160 + i * 118} y="82" fontSize="6.5" fill="#64748b" fontFamily={f}>
            {k}
          </text>
          <text x={160 + i * 118} y="100" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily={f}>
            {kv[i]}
          </text>
          <text x={160 + i * 118} y="114" fontSize="6.5" fill={kc[i]} fontFamily={f} fontWeight="600">
            {kd[i]}
          </text>
        </g>
      ))}
      <rect x="150" y="136" width="300" height="224" rx="8" fill="#fff" stroke="#e2e8f0" />
      <text x="160" y="154" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {d.sales}
      </text>
      {[30, 45, 38, 60, 52, 70, 64, 80, 58, 74, 90, 68, 84, 96].map((h, i) => (
        <rect key={i} x={164 + i * 20} y={340 - h * 1.7} width="12" height={h * 1.7} rx="2" fill={i === 13 ? "#2547e9" : "#bfd3fe"} />
      ))}
      <rect x="462" y="136" width="158" height="224" rx="8" fill="#fff" stroke="#e2e8f0" />
      <text x="472" y="154" fontSize="8.5" fontWeight="700" fill="#0f172a" fontFamily={f}>
        {d.byStatus}
      </text>
      {d.st.map((st, i) => (
        <g key={st}>
          <text x="472" y={176 + i * 30} fontSize="7" fill="#334155" fontFamily={f}>
            {st}
          </text>
          <text x="610" y={176 + i * 30} fontSize="7" textAnchor="end" fill="#0f172a" fontWeight="700" fontFamily={f}>
            {counts[i]}
          </text>
          <rect x="472" y={181 + i * 30} width="138" height="4" rx="2" fill="#f1f5f9" />
          <rect x="472" y={181 + i * 30} width={Math.max(6, (counts[i] / 248) * 138)} height="4" rx="2" fill={cc[i]} />
        </g>
      ))}
    </>,
  )
}

export function Mockup({ kind, className = "", locale = "fr" }: { kind: Kind; className?: string; locale?: Locale }) {
  const s: S = STR[locale] ?? STR.fr
  const m = { orders: Orders, workshop: Workshop, delivery: Delivery, cod: Cod, clients: Clients, store: StoreMock, agent: Agent, dashboard: Dashboard }[kind]
  return <div className={`overflow-hidden rounded-2xl ${className}`}>{m(s)}</div>
}
