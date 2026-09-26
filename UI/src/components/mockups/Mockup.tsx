// Maquettes HTML « captures d'écran » de l'application, reproduisant le style
// réel de PrintIOS (barre latérale blanche + item actif bleu, bascule FR/AR,
// cartes arrondies, tableaux à en-têtes gris, badges de statut), avec des
// données GÉNÉRÉES (aucune donnée client réelle) et TRADUITES fr / ar / en.
// Rendu en HTML/Tailwind : net à toute taille, aucune image à héberger, RTL
// natif pour l'arabe.

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


// ---------------------------------------------------------------------------
// Briques communes (style de l'application)
// ---------------------------------------------------------------------------
type Tone = "green" | "blue" | "amber" | "red" | "slate" | "violet"
const TONE: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
}
const Badge = ({ tone = "slate", children }: { tone?: Tone; children: React.ReactNode }) => (
  <span className={`inline-flex items-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9px] font-medium ring-1 ring-inset ${TONE[tone]}`}>{children}</span>
)
const Btn = ({ primary = false, children }: { primary?: boolean; children: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-medium ${primary ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{children}</span>
)
const Card = ({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${className}`}>
    {title && <p className="mb-2 text-[10px] font-semibold text-slate-800">{title}</p>}
    {children}
  </div>
)
const Th = ({ children, right = false }: { children: React.ReactNode; right?: boolean }) => (
  <th className={`px-2 py-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-500 ${right ? "text-end" : "text-start"}`}>{children}</th>
)
const Td = ({ children, right = false, className = "" }: { children: React.ReactNode; right?: boolean; className?: string }) => (
  <td className={`px-2 py-1.5 align-top text-[9px] text-slate-700 ${right ? "text-end" : "text-start"} ${className}`}>{children}</td>
)

const LogoMark = () => (
  <span className="inline-flex items-center gap-1.5">
    <svg viewBox="0 0 40 40" className="h-4 w-4" aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="9" fill="#2547e9" />
      <path d="M13 12h9.5a4.5 4.5 0 0 1 0 9H13z" fill="#fff" opacity=".95" />
      <path d="M13 21h6v7h-6z" fill="#fff" opacity=".7" />
      <path d="M23 24l5 4-5 4v-2.5h-4v-3h4z" fill="#a5f3fc" />
    </svg>
    <span className="text-[10px] font-bold tracking-tight text-slate-900">{site.brand}</span>
  </span>
)

/** Coque de l'application : barre latérale + barre du haut + contenu. */
function AppShell({ s, locale, active, title, subtitle, children }: { s: S; locale: Locale; active: keyof S["nav"]; title: string; subtitle?: string; children: React.ReactNode }) {
  const nav: (keyof S["nav"])[] = ["dashboard", "workshop", "orders", "delivery", "clients", "finance", "sync"]
  const rtl = locale === "ar"
  return (
    <div dir={rtl ? "rtl" : "ltr"} className="flex h-[400px] w-full overflow-hidden bg-slate-50 text-slate-800" style={{ fontFamily: s.font }}>
      <aside className="hidden w-[132px] shrink-0 flex-col border-e border-slate-200 bg-white sm:flex">
        <div className="flex h-9 items-center px-3"><LogoMark /></div>
        <nav className="mt-1 space-y-0.5 px-2">
          {nav.map((k) => (
            <div key={k} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[9px] font-medium ${k === active ? "bg-blue-600 text-white" : "text-slate-600"}`}>
              <span className={`h-3 w-3 rounded ${k === active ? "bg-white/30" : "bg-slate-200"}`} />
              {s.nav[k]}
              {k !== active && <span className="ms-auto text-slate-300">›</span>}
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-9 items-center justify-between border-b border-slate-200 bg-white px-3">
          <span className="text-[9px] text-slate-400">≡</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-[8px]">
              <span className={`rounded-full px-1.5 py-0.5 ${locale === "ar" ? "text-slate-500" : "bg-white font-semibold shadow-sm"}`}>FR</span>
              <span className={`rounded-full px-1.5 py-0.5 ${locale === "ar" ? "bg-white font-semibold shadow-sm" : "text-slate-500"}`}>AR</span>
            </span>
            <span className="relative h-3.5 w-3.5 rounded-full border border-slate-300"><span className="absolute -end-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" /></span>
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-400 to-violet-500" />
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-hidden p-3">
          <p className="text-[13px] font-bold text-slate-900">{title}</p>
          {subtitle && <p className="mb-2 text-[9px] text-slate-500">{subtitle}</p>}
          {children}
        </main>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écrans
// ---------------------------------------------------------------------------
const money = (s: S, v: string) => `${v} ${s.cur}`

function Orders(s: S, locale: Locale) {
  const o = s.orders
  const rows = [
    { id: "ORD-199", c: "Karim Idrissi", n: 1, st: o.st.prod, tone: "blue" as Tone, p: "120,00", r: "120,00", pay: o.st.new, payTone: "red" as Tone },
    { id: "ORD-198", c: "Nadia Tazi", n: 1, st: o.st.prod, tone: "blue" as Tone, p: "495,00", r: "495,00", pay: o.st.new, payTone: "red" as Tone, gap: true },
    { id: "ORD-196", c: "Sara Benali", n: 2, st: o.st.delivered, tone: "green" as Tone, p: "200,00", r: "0,00", pay: "COD", payTone: "green" as Tone, sub: o.detail2 },
    { id: "ORD-195", c: "Sara Benali", n: 1, st: o.st.shipping, tone: "amber" as Tone, p: "350,00", r: "0,00", pay: "COD", payTone: "green" as Tone },
    { id: "ORD-193", c: "Hind Alaoui", n: 1, st: o.st.ready, tone: "violet" as Tone, p: "139,00", r: "139,00", pay: o.st.new, payTone: "red" as Tone, sub: o.detail1 },
    { id: "ORD-189", c: "Sara Benali", n: 1, st: o.st.ready, tone: "violet" as Tone, p: "240,00", r: "40,00", pay: "Virement", payTone: "amber" as Tone },
  ]
  return (
    <AppShell s={s} locale={locale} active="orders" title={o.title} subtitle={o.search}>
      <Card>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Btn primary>{o.newBtn}</Btn>
          <span className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-[8px] text-slate-400">{o.search}</span>
          <Btn>20 – 26 / 09</Btn>
        </div>
        <table className="w-full border-collapse">
          <thead className="bg-slate-50"><tr>{o.cols.map((c) => <Th key={c}>{c}</Th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <Td><span className="font-mono font-semibold text-slate-900">{r.id}</span>{r.gap && <span className="ms-1"><Badge tone="red">{o.gap}</Badge></span>}</Td>
                <Td>{r.c}<span className="block text-[8px] text-slate-400">{r.n} art.</span></Td>
                <Td><span className="font-semibold">{money(s, r.p)}</span>{r.sub && <span className="block text-[8px] text-slate-400">{r.sub}</span>}</Td>
                <Td><span className={r.r === "0,00" ? "text-emerald-600" : "font-semibold text-slate-900"}>{money(s, r.r)}</span><span className="ms-1"><Badge tone={r.payTone}>{r.pay}</Badge></span></Td>
                <Td><Badge tone={r.tone}>{r.st}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  )
}

function Workshop(s: S, locale: Locale) {
  const w = s.workshop
  const col = (name: string, tone: string, cards: { id: string; c: string; items: string; since: string; late?: boolean }[]) => (
    <div className="min-w-0 flex-1">
      <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold text-slate-700"><span className={`h-1.5 w-1.5 rounded-full ${tone}`} />{name}<span className="ms-auto rounded-full bg-slate-100 px-1.5 text-[8px] text-slate-500">{cards.length}</span></div>
      <div className="space-y-1.5">
        {cards.map((c) => (
          <div key={c.id} className={`rounded-lg border bg-white p-1.5 shadow-sm ${c.late ? "border-red-300" : "border-slate-200"}`}>
            <p className="font-mono text-[7px] text-slate-400">{c.id}</p>
            <p className="text-[9px] font-semibold text-slate-800">{c.c}</p>
            <p className="truncate text-[8px] text-slate-500">{c.items}</p>
            <p className={`mt-0.5 text-end text-[8px] font-medium ${c.late ? "text-red-600" : "text-slate-400"}`}>{c.since}</p>
          </div>
        ))}
      </div>
    </div>
  )
  const m = w.machines
  return (
    <AppShell s={s} locale={locale} active="workshop" title={w.title}>
      <div className="flex gap-2">
        {col(w.cols[0], "bg-blue-500", [
          { id: "ORD-201", c: "Atelier Lumière", items: `${m[0]} · 2 ${w.mb}`, since: "12 min" },
          { id: "ORD-200", c: "Karim Idrissi", items: `${m[1]} · 340 ${w.mb}`, since: "1 h" },
          { id: "ORD-198", c: "Nadia Tazi", items: `${m[2]} · 18 ${w.mb}`, since: "23 h", late: true },
        ])}
        {col(w.cols[1], "bg-amber-500", [
          { id: "ORD-197", c: "Boutique Zen", items: `${m[0]} · 6 ${w.mb}`, since: "35 min" },
          { id: "ORD-194", c: "Hind Alaoui", items: `${m[3]} · 12 ${w.mb}`, since: "2 j", late: true },
        ])}
        {col(w.cols[2], "bg-emerald-500", [
          { id: "ORD-196", c: "Sara Benali", items: `${m[1]} · 410 ${w.mb}`, since: "✓" },
          { id: "ORD-195", c: "Maison Parfums", items: `${m[0]} · 9 ${w.mb}`, since: "✓" },
          { id: "ORD-192", c: "Le Petit Café", items: `${m[2]} · 3 ${w.mb}`, since: "✓" },
        ])}
      </div>
    </AppShell>
  )
}

function Delivery(s: S, locale: Locale) {
  const d = s.delivery
  const tabs = [s.nav.pickups, d.steps[0], d.steps[2], d.steps[4].split(" ")[0], d.tracking]
  const rows = [
    { id: "ORD-198", c: "Boutique Zen", city: "Casablanca", carrier: "Olivraison", st: d.steps[0], tone: "slate" as Tone, trk: "9H588A60A9" },
    { id: "ORD-193", c: "Azura Fleurs", city: "Salé", carrier: "Ameex", st: d.steps[1], tone: "blue" as Tone, trk: "SLE0926B25" },
    { id: "ORD-192", c: "Maison Parfums", city: "Kénitra", carrier: "Olivraison", st: d.steps[2], tone: "amber" as Tone, trk: "579287B692" },
    { id: "ORD-189", c: "Parfumerie Iris", city: "Oulmès", carrier: "Olivraison", st: d.steps[3], tone: "violet" as Tone, trk: "IL29505926" },
    { id: "ORD-185", c: "Pâtisserie Amal", city: "Casablanca", carrier: "Ameex", st: d.steps[4], tone: "green" as Tone, trk: "3O3C324926" },
  ]
  return (
    <AppShell s={s} locale={locale} active="delivery" title={s.nav.delivery} subtitle={d.h + " · " + d.sub}>
      <div className="mb-2 flex gap-1 border-b border-slate-200">
        {tabs.map((t, i) => <span key={t} className={`px-2 pb-1 text-[9px] ${i === 2 ? "border-b-2 border-blue-600 font-semibold text-blue-700" : "text-slate-500"}`}>{t}</span>)}
      </div>
      <Card>
        <div className="mb-1.5 flex items-center justify-between"><p className="text-[10px] font-semibold">{d.steps[2]} (13)</p><Btn>{d.print}</Btn></div>
        <table className="w-full border-collapse">
          <thead className="bg-slate-50"><tr><Th>ID</Th><Th>{s.nav.clients}</Th><Th>{d.ref}</Th><Th>{s.orders.cols[4]}</Th><Th>{d.tracking}</Th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <Td><span className="font-mono font-semibold text-slate-900">{r.id}</span></Td>
                <Td>{r.c}<span className="block text-[8px] text-slate-400">{r.city}</span></Td>
                <Td>{r.carrier}</Td>
                <Td><Badge tone={r.tone}>{r.st}</Badge></Td>
                <Td><span className="font-mono text-[8px] text-slate-500">{r.trk}…</span></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  )
}

function Cod(s: S, locale: Locale) {
  const c = s.cod
  const vals = ["1 030,00", "−50,00", "980,00", "0,00", "0,00", "980,00"]
  return (
    <AppShell s={s} locale={locale} active="finance" title={c.title} subtitle={c.month}>
      <div className="mb-2 grid grid-cols-4 gap-2">
        {c.kpis.map((k, i) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <p className="text-[8px] text-slate-500">{k}</p>
            <p className={`text-[12px] font-bold ${i === 2 ? "text-red-600" : "text-slate-900"}`}>{i === 2 ? c.gaps : money(s, ["12 480", "11 550", "", "3 200"][i])}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        <Card className="col-span-3">
          <table className="w-full">
            <tbody>
              {c.rows.map((r, i) => (
                <tr key={r} className={i === c.rows.length - 1 ? "border-t border-slate-200" : ""}>
                  <Td className={i === c.rows.length - 1 ? "font-semibold text-slate-900" : ""}>{r}</Td>
                  <Td right className={i === c.rows.length - 1 ? "font-bold text-slate-900" : i === 1 ? "text-red-600" : ""}>{money(s, vals[i])}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="col-span-2 rounded-xl border border-red-200 bg-red-50 p-2.5">
          <p className="text-[10px] font-semibold text-red-700">⚠ {c.gapT}</p>
          <p className="mt-1 text-[8px] text-red-700">{c.gap1}</p>
          <p className="text-[8px] text-red-700">{c.gap2}</p>
          <p className="mt-1 text-[8px] text-slate-600">{c.gap3}</p>
          <div className="mt-2"><Btn primary>CSV</Btn></div>
        </div>
      </div>
    </AppShell>
  )
}

function Clients(s: S, locale: Locale) {
  const c = s.clients
  const rows = [
    ["Zen Organics", "06 12 34 56 78", "1 662", "1", "0"],
    ["Ilias Amrani", "06 23 45 67 89", "270", "1", "0"],
    ["Studio 26", "06 34 56 78 90", "210", "1", "0"],
    ["Golden Parfum", "06 45 67 89 01", "178", "0", "0"],
    ["Ons Beauté", "06 56 78 90 12", "175", "1", "0"],
    ["Chaïma Bennani", "06 67 89 01 23", "165", "1", "0"],
    ["Rim Concept", "06 78 90 12 34", "138", "2", "1"],
  ]
  return (
    <AppShell s={s} locale={locale} active="clients" title={s.nav.clients} subtitle={c.pts}>
      <div className="mb-2 grid grid-cols-3 gap-2">
        {c.kpis.map((k, i) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <p className="text-[8px] text-slate-500">{k}</p>
            <p className="text-[12px] font-bold text-slate-900">{[ "101", money(s, "84 320"), money(s, "2 140")][i]}</p>
          </div>
        ))}
      </div>
      <Card>
        <div className="mb-1.5 flex items-center justify-between"><p className="text-[10px] font-semibold">{c.last}</p><Btn primary>+</Btn></div>
        <table className="w-full border-collapse">
          <thead className="bg-slate-50"><tr><Th>{s.orders.cols[1]}</Th><Th>☎</Th><Th right>★</Th><Th right>{s.nav.orders}</Th><Th right>↩</Th><Th>✓</Th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-slate-100">
                <Td><span className="font-semibold text-slate-900">{r[0]}</span></Td>
                <Td><span className="font-mono text-[8px] text-slate-500">{r[1]}</span></Td>
                <Td right><span className="font-semibold text-amber-600">{r[2]}</span></Td>
                <Td right>{r[3]}</Td>
                <Td right><span className={r[4] !== "0" ? "text-red-600" : ""}>{r[4]}</span></Td>
                <Td><Badge tone={r[4] !== "0" ? "amber" : "green"}>{r[4] !== "0" ? "!" : "✓"}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  )
}

function StoreMock(s: S, locale: Locale) {
  const st = s.store
  const rtl = locale === "ar"
  return (
    <div dir={rtl ? "rtl" : "ltr"} className="h-[400px] w-full overflow-hidden bg-white text-slate-800" style={{ fontFamily: s.font }}>
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[8px] text-slate-500">{st.title}</span>
        <span className="text-[10px] font-bold">{st.h}</span>
        <Btn primary>{st.cart}</Btn>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {st.products.map((p, i) => (
          <div key={p} className="rounded-xl border border-slate-200 p-2 shadow-sm">
            <div className={`mb-1.5 h-14 rounded-lg ${["bg-blue-100", "bg-amber-100", "bg-emerald-100", "bg-violet-100", "bg-pink-100", "bg-cyan-100"][i]}`} />
            <p className="text-[9px] font-semibold">{p}</p>
            <p className="text-[8px] text-slate-500">{st.from} <span className="font-semibold text-slate-800">{money(s, ["49", "120", "180", "290", "35", "60"][i])}</span> · 3 {st.opts}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Agent(s: S, locale: Locale) {
  const a = s.agent
  return (
    <AppShell s={s} locale={locale} active="sync" title={s.nav.sync} subtitle={a.instances}>
      <div className="grid grid-cols-5 gap-2">
        <Card className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-semibold text-slate-900">{a.host}</p>
            <span className="ms-auto"><Badge tone="green">{a.active}</Badge></span>
          </div>
          <p className="mt-0.5 text-[8px] text-slate-500">win32 · v1.0.6 · {a.service}</p>
          <p className="mt-2 text-[8px] font-semibold uppercase text-slate-500">{a.folder}</p>
          {a.inst.map((i, n) => (
            <div key={i} className="mt-1 rounded-lg border border-slate-200 p-1.5">
              <p className="text-[9px] font-medium">{i}</p>
              <p className="font-mono text-[7px] text-slate-400">PrintProd/PrintWorkSpace → D:\Impression</p>
              <div className="mt-1 h-1 w-full rounded-full bg-slate-100"><div className="h-1 rounded-full bg-blue-600" style={{ width: n === 0 ? "100%" : "62%" }} /></div>
              <p className="mt-0.5 text-[8px] text-slate-500">{n === 0 ? `157/157 ${a.files}` : a.chunks}</p>
            </div>
          ))}
        </Card>
        <Card className="col-span-3" title={a.filesT}>
          <table className="w-full border-collapse">
            <thead className="bg-slate-50"><tr><Th>{a.filesT}</Th><Th right>{a.gb}</Th><Th>{s.orders.cols[4]}</Th></tr></thead>
            <tbody>
              {[["ORD-201_carte-visite.pdf", "0,02", a.done, "green"], ["ORD-200_bache-3x2.tif", "0,34", a.done, "green"], ["ORD-198_stickers.pdf", "0,02", a.queued, "blue"], ["ORD-197_flyers-A5.pdf", "0,01", a.queued, "blue"], ["ORD-194_rollup.pdf", "0,09", a.done, "green"]].map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <Td><span className="font-mono text-[8px]">{r[0]}</span></Td>
                  <Td right>{r[1]}</Td>
                  <Td><Badge tone={r[3] as Tone}>{r[2]}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 flex gap-1"><Btn>{a.sync}</Btn><Btn primary>↻</Btn></div>
        </Card>
      </div>
    </AppShell>
  )
}

function Dashboard(s: S, locale: Locale) {
  const d = s.dashboard
  const pts = [6.2, 1.1, 3.4, 2.6, 0.4, 1.0]
  const max = 8
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${10 + i * 44} ${60 - (v / max) * 52}`).join(" ")
  const bars = [["Sara Benali", 92], ["Hind Alaoui", 48], ["Atelier Central", 12], ["Nadia Tazi", 6], ["Karim Idrissi", 4]] as const
  return (
    <AppShell s={s} locale={locale} active="dashboard" title={d.title}>
      <div className="mb-2 grid grid-cols-4 gap-2">
        {d.kpis.map((k, i) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <p className="text-[8px] text-slate-500">{k}</p>
            <p className="text-[12px] font-bold text-slate-900">{[money(s, "15 099"), "38", "13", money(s, "2 140")][i]}</p>
            {i === 3 && <p className="text-[7px] text-red-600">{d.gaps}</p>}
          </div>
        ))}
      </div>
      <div className="mb-2 grid grid-cols-6 gap-1">
        {d.st.map((st, i) => (
          <div key={st} className="rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-center">
            <p className="text-[7px] text-slate-500">{st}</p>
            <p className="text-[10px] font-bold">{[0, 7, 4, 2, 25, 1][i]}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Card title={d.sales}>
          <div dir="ltr"><svg viewBox="0 0 240 70" className="h-auto w-full">
            {[0, 1, 2, 3].map((g) => <line key={g} x1="8" x2="232" y1={8 + g * 17.3} y2={8 + g * 17.3} stroke="#e2e8f0" strokeDasharray="3 3" />)}
            <path d={path} fill="none" stroke="#2547e9" strokeWidth="1.5" />
            {pts.map((v, i) => <circle key={i} cx={10 + i * 44} cy={60 - (v / max) * 52} r="2" fill="#fff" stroke="#2547e9" />)}
            {["21", "22", "23", "24", "25", "26"].map((t, i) => <text key={t} x={10 + i * 44} y="68" fontSize="6" fill="#94a3b8" textAnchor="middle">{t}</text>)}
          </svg></div>
        </Card>
        <Card title={d.byStatus}>
          <div dir="ltr" className="space-y-1">
            {bars.map(([n, v]) => (
              <div key={n} className="flex items-center gap-1.5">
                <span className="w-16 truncate text-[8px] text-slate-600">{n}</span>
                <div className="h-2.5 flex-1 rounded bg-slate-100"><div className="h-2.5 rounded bg-blue-600" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

export function Mockup({ kind, className = "", locale = "fr" }: { kind: Kind; className?: string; locale?: Locale }) {
  const s: S = STR[locale] ?? STR.fr
  const m = { orders: Orders, workshop: Workshop, delivery: Delivery, cod: Cod, clients: Clients, store: StoreMock, agent: Agent, dashboard: Dashboard }[kind]
  return <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${className}`}>{m(s, locale)}</div>
}
