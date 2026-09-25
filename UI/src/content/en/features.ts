import type { Feature } from "../fr/features"
import type { Step, Audience, Stat, Testimonial } from "../types"

export const features: Feature[] = [
  {
    slug: "commandes",
    icon: "ClipboardList",
    title: "Orders and quotes",
    short: "Take an order in 30 seconds, from quote to delivery.",
    description:
      "Create an order with its items, options (format, paper weight, finish), materials and files. Generate a quote, get a mockup approved, collect a deposit: the balance due is calculated by itself, adjustments and shipping included.",
    bullets: ["Items with options and material units", "PDF quotes and mockups to be approved by the customer", "Deposit, manual adjustment, free shipping", "Production statuses from \"New\" to \"Delivered\"", "Deleted orders trash with full details"],
    mockup: "orders",
    color: "bg-blue-600",
  },
  {
    slug: "atelier",
    icon: "Printer",
    title: "Workshop and printing",
    short: "Ready files arrive on the print workstations by themselves.",
    description:
      "When an order goes into production, its files are marked \"ready\". PrintosSync installed on each workstation downloads them in the background into the right folder, even when nobody is logged in. No more USB sticks, no more files sent on WhatsApp.",
    bullets: ["Production queue per machine or operator", "Windows, macOS and Linux agent in service mode", "Dedicated service accounts (never a user account)", "Workstation management from the web: pause, resume, settings", "Sync history and errors per workstation"],
    mockup: "agent",
    color: "bg-violet-600",
  },
  {
    slug: "livraison",
    icon: "Truck",
    title: "Multi-carrier delivery",
    short: "Ameex, Olivraison, Ozone Express or your own couriers.",
    description:
      "Create a pickup, print notes and labels, and let statuses come back automatically automatically. Each salesperson can create pickups for their own orders; you always know who created what.",
    bullets: ["Regenerable PDF delivery notes and labels", "Real-time carrier statuses", "In-house couriers, rounds and delivery zones", "Deletion blocked once the parcel is picked up", "Shipping fees per zone, free shipping"],
    mockup: "delivery",
    color: "bg-amber-500",
  },
  {
    slug: "cod",
    icon: "Banknote",
    title: "Cash on delivery (COD) and finance",
    short: "COD collected must equal the balance due: otherwise a badge alerts you.",
    description:
      "At delivery, the amount collected by the carrier is reconciled with the balance due (price – deposit). Any gap shows up immediately in the order list and in the export. Statements, expenses, margin: you know where your cash is.",
    bullets: ["Automatic COD reconciliation at delivery", "Gap badge and dedicated filter", "Account statements per customer and per reseller", "Expenses, margin per order", "CSV export with gross, adjustments, net, shipping, deposit, balance, COD"],
    mockup: "cod",
    color: "bg-emerald-600",
  },
  {
    slug: "clients",
    icon: "Users",
    title: "Customers, loyalty and promotions",
    short: "Clean customer file, points earned on delivery, promo codes.",
    description:
      "Duplicate detection, order history, account statement. The loyalty programme only credits points when the order is actually delivered or picked up in store. Promo codes and automatic promotions by period.",
    bullets: ["Customer records with duplicate merging", "Loyalty points on delivery or pickup", "Promo codes and automatic promotions", "SMS / e-mail notifications at key steps", "External resellers with restricted scope"],
    mockup: "clients",
    color: "bg-pink-600",
  },
  {
    slug: "boutique",
    icon: "Store",
    title: "Online store",
    short: "Your products on display, web orders land in the same flow.",
    description:
      "Publish your catalogue on a public store synced with your back office. An order placed online lands directly in the production queue, with its files and delivery method.",
    bullets: ["Synced catalogue (products, options, prices)", "Online ordering with file upload", "Same production and delivery flow", "Separate, secured deployment (isolated public instance)"],
    mockup: "store",
    color: "bg-cyan-600",
  },
  {
    slug: "pilotage",
    icon: "LayoutDashboard",
    title: "Dashboard and multi-site",
    short: "What sells, what's late, what's still to collect.",
    description:
      "Revenue, orders by status, deliveries in progress, expected collections: one dashboard per point of sale and a consolidated view. Each user sees exactly what concerns them according to their role.",
    bullets: ["Real-time indicators by period", "Roles: admin, operator, in-house salesperson, external reseller, courier", "Several points of sale in one workspace", "Action log (who did what, when)"],
    mockup: "dashboard",
    color: "bg-slate-700",
  },
  {
    slug: "securite",
    icon: "ShieldCheck",
    title: "Security and data",
    short: "A dedicated database and storage for each customer.",
    description:
      "Each customer workspace has its own database and its own encrypted storage space for print files. Your data is never mixed with another customer's, and you can export everything at any time.",
    bullets: ["Isolated database per customer", "Dedicated, encrypted file storage", "Automatic backups", "Full export (CSV, files) on request", "Hosted on Amazon Web Services (AWS), secure connection"],
    mockup: "dashboard",
    color: "bg-slate-900",
  },
]

export const steps: Step[] = [
  { n: 1, title: "Request your workspace", text: "Choose a plan and write to us on WhatsApp. An advisor creates your workspace within one working day and sends you your access." },
  { n: 2, title: "Set up", text: "Products, options, materials, carriers, VAT. Import your customers from a CSV file." },
  { n: 3, title: "Sell and produce", text: "Order entry, deposit, files to the workshop, delivery note: everything flows." },
  { n: 4, title: "Collect without gaps", text: "COD is reconciled with the balance due; the dashboard tells you what remains to be collected." },
]

export const audiences: Audience[] = [
  { title: "Digital printing", text: "Business cards, flyers, posters: high volume of small orders, files to print every day." },
  { title: "Large format and signage", text: "Banners, panels, vinyl: quotes, mockup approval, production and installation or delivery." },
  { title: "Promotional items", text: "Textile, mugs, packaging: options per item, materials and subcontracting." },
  { title: "Networks and franchises", text: "Several points of sale, external resellers, shared catalogue and consolidated view." },
]

export const stats: Stat[] = [
  { value: "24 h", label: "to receive your workspace" },
  { value: "0 gap", label: "between COD collected and balance due" },
  { value: "3", label: "connected carriers + in-house couriers" },
  { value: "24/7", label: "PrintosSync in service mode" },
]

// FICTIONAL testimonials — replace with real customer feedback before going live
export const testimonials: Testimonial[] = [
  { name: "Example — Casablanca workshop", role: "Manager, digital print shop", text: "We used to lose 20 minutes per order finding the file and checking what the courier had collected. Now everything is in the order." },
  { name: "Example — Signage in Rabat", role: "Production manager", text: "PrintosSync runs as a service on the machine's workstation: the files are already there when the operator arrives." },
  { name: "Example — Network of 4 points of sale", role: "Director", text: "Each salesperson sees their orders and pickups, I see everything. And COD reconciliation found gaps we never saw before." },
]
