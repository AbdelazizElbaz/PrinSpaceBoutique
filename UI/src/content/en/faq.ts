import { site } from "../site.config"
import type { FaqGroup } from "../fr/faq"

const b = site.brand

export const faq: FaqGroup[] = [
  {
    id: "demarrage",
    title: "Getting started and trial",
    items: [
      { q: `How do I get started with ${b}?`, a: `Click "Free trial", pick your plan and contact us on WhatsApp (or leave your details). An advisor creates your workspace within one working day and sends you your access by e-mail and WhatsApp; you can start setting up right away.` },
      { q: "Is the trial really free? Do I need a credit card?", a: `Yes, ${site.trialDays} days with no commitment and no credit card. At the end of the trial you choose a plan and pay by bank transfer; otherwise the workspace is simply suspended (your data is kept 30 days while you decide).` },
      { q: "How long does it take to be operational?", a: "Half a day for a standard workshop: create your products and options, enter your materials, connect a carrier and import your customers from a CSV file. Our training videos guide you step by step, and the Pro and Business plans include a video-call onboarding session." },
      { q: "Can I import my existing customers and products?", a: "Yes. Customers are imported from a CSV file (name, phone, e-mail, address) with automatic duplicate detection. For products and options you can enter them or send us your catalogue: on the Business plan our team does the import." },
      { q: "What will my workspace address be?", a: `Each customer has their own address, like myworkshop.${site.appDomain}, sent with your access. On the Business plan you can use your own domain (orders.your-brand.ma).` },
      { q: "Do I need to install anything?", a: `Not for management: ${b} works in the browser, on computer, tablet and phone. Only PrintiosSync (${site.agentName}) is installed on the workshop workstations that must receive files automatically.` },
    ],
  },
  {
    id: "abonnement",
    title: "Subscription and payment",
    items: [
      { q: "What's the difference between the plans?", a: "All plans give access to the same application. They differ by volume: number of users, orders per month, file storage, points of sale and connected carriers, as well as the level of support. The full comparison is on the Pricing page." },
      { q: "What happens if I exceed a limit of my plan?", a: "Nothing blocks abruptly: you get an alert in the application and by e-mail when you reach 80% then 100% of a limit (orders of the month, storage). Beyond that, we offer you to move to the higher plan; creating new orders remains possible during a 7-day tolerance period." },
      { q: "How do I pay?", a: "By bank transfer, monthly or yearly (yearly equals 10 months paid out of 12). Bank details and the invoice are available in your workspace, Subscription section. As soon as the transfer is received, the plan is activated and the invoice FAC-YYYY-000000 is sent to you. Card payment will be offered soon." },
      { q: "Are prices excl. or incl. VAT?", a: "Displayed prices are excl. VAT; 20% VAT applies on the invoice. We issue a compliant invoice with your ICE." },
      { q: "Can I change plan at any time?", a: "Yes. Upgrading is immediate, with pro-rata billing. Downgrading takes effect at the next renewal, provided your usage fits the new plan's limits." },
      { q: "How do I cancel?", a: "From your workspace or by simple e-mail, with no fees or notice for monthly; yearly runs until its end date. You can export all your data before closing; it is kept 30 days then permanently deleted." },
      { q: "Are there setup fees?", a: "No. Workspace creation is free and automatic. Only optional services (complex catalogue import, dedicated instance, on-site training) are quoted." },
    ],
  },
  {
    id: "livraison",
    title: "Delivery and cash on delivery (COD)",
    items: [
      { q: "Which carriers are supported?", a: "Ameex, Olivraison and Ozone Express are natively integrated (parcel creation, delivery note, labels, status tracking automatically). You can also manage your own couriers with rounds and zones. Other carriers are added regularly; tell us which one you use." },
      { q: "How does COD reconciliation work?", a: "Each order has a \"balance due\" = price (with adjustments and shipping) – deposit collected. At delivery, the amount collected by the carrier is recorded on the order. If COD collected – balance due is not zero, a gap badge appears in the order list and in the CSV export so you can settle it with the carrier." },
      { q: "A customer paid a deposit: how does it work?", a: "The deposit is entered on the order (cash, transfer, card). It appears under the price in the list, the balance due is reduced accordingly, and that balance is sent as the COD amount to the carrier. The deposit can be edited or removed from the Actions menu as long as the order is not delivered." },
      { q: "Who can create a pickup?", a: "Administrators and operators for all orders; in-house salespeople only for their own orders. The name of the person who created the pickup is shown on it." },
      { q: "Can an order already out for delivery be deleted?", a: "An order can be deleted (moved to trash) as long as the parcel has not been physically picked up by the carrier. Once picked up, deletion is blocked. Deleted orders remain viewable in the \"Deleted orders\" menu with all their details." },
      { q: "Can the delivery note be regenerated?", a: "Yes. The carrier's response is kept, which allows regenerating the note or labels at any time, printing them directly from the browser and saving them with a clear name (Note-Carrier-Reference.pdf)." },
    ],
  },
  {
    id: "atelier",
    title: "Workshop and PrintiosSync",
    items: [
      { q: `What is the ${site.agentName} agent for?`, a: "It is installed on the workshop workstations and automatically downloads, in the background, the files of orders ready to print into the folder of your choice (per machine, per day, per customer…). It resumes interrupted downloads, handles large files in chunks and reports its state in your web workspace." },
      { q: "Which systems does it run on?", a: "Windows 10/11, macOS (Apple Silicon and Intel) and Linux. Installers are downloaded from the Sync page of your workspace, and the agent updates itself when a new version is published." },
      { q: "Which account does the agent sign in with?", a: "With a dedicated service account, created from the Sync page (\"Agent accounts\"). It is not a user account: it can do nothing but sync files, and you can deactivate it or revoke its access at any time. Create one per workstation or per workshop." },
      { q: "Does the agent work if nobody is logged in on the workstation?", a: "Yes, in service mode (Pro and Business plans): the agent runs as a system service and keeps syncing even with the session closed. The agent window is then only used to control it." },
      { q: "Can we have several workstations?", a: "As many as needed (1 workstation on Starter). Each workstation has a stable identity, keeps its synced folders, and you manage them all from the web: pause, resume, parallelism settings, removal of an obsolete workstation." },
    ],
  },
  {
    id: "securite",
    title: "Security and data",
    items: [
      { q: "Where is my data hosted?", a: "On a Amazon Web Services (AWS) infrastructure, secure connection only. Each customer has their own database and their own encrypted storage space for files: your data is never mixed with another customer's." },
      { q: "Who has access to my data?", a: "You and the users you create, according to their role (administrator, operator, in-house salesperson, external reseller, courier). An external reseller, for example, sees neither promo codes, nor delivery, nor mockups and quotes. Our team only accesses your workspace at your request, for support." },
      { q: "Are there backups?", a: "Yes, automatic: weekly on Starter, daily on Pro (kept 7 days) and Business (30 days). A restore can be requested from support." },
      { q: "Can I export my data?", a: "At any time: CSV export of orders, customers and statements from the application, and full export (database + files) on request, in particular on cancellation." },
      { q: "Are passwords protected?", a: "Passwords are never stored in clear text. PrintiosSync never stores a password: it uses a dedicated access that can be revoked at any time." },
    ],
  },
  {
    id: "support",
    title: "Support and evolutions",
    items: [
      { q: "How do I contact support?", a: `By e-mail (${site.contact.supportEmail}) on all plans, by priority WhatsApp on Pro, and through your dedicated account manager on Business. Hours: ${site.contact.hours}.` },
      { q: "Do you offer training?", a: "Yes: a complete free video library organised by role (sales, workshop, delivery, management), plus a video-call onboarding session on Pro (1 h) and Business (2 h). On-site training is available on quote." },
      { q: "Can I request a feature?", a: "Of course. The application evolves every month based on requests from the workshops that use it; updates are automatic and without service interruption." },
      { q: "Can we have a dedicated instance?", a: "Yes, as an option on the Business plan: isolated server, own domain and agreed maintenance window, on quote." },
    ],
  },
]
