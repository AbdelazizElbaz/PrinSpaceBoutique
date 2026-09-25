import type { Video } from "../fr/videos"
import type { Track } from "../types"

export const tracks: Track[] = [
  { id: "demarrer", title: "Get started", audience: "Administrator", description: "Create your workspace, set it up and invite your team." },
  { id: "vendre", title: "Sell", audience: "Salesperson, operator", description: "Take an order, handle the deposit, track statuses." },
  { id: "produire", title: "Produce", audience: "Workshop", description: "Install PrintiosSync and receive files automatically." },
  { id: "livrer", title: "Deliver", audience: "Operator, courier", description: "Pickups, delivery notes, tracking and COD collection." },
  { id: "gerer", title: "Manage", audience: "Manager, accountant", description: "Dashboard, statements, expenses, loyalty, exports." },
  { id: "boutique", title: "Online store", audience: "Administrator", description: "Publish your catalogue and receive web orders." },
]

export const videos: Video[] = [
  { id: "creer-espace", track: "demarrer", title: "Request your workspace and sign in", duration: "3 min", youtubeId: "", summary: "From the trial request (WhatsApp) to the first login with the access received.", script: [
    { screen: "Free trial page", say: "Pick a plan and click the WhatsApp button: the message is pre-filled, just send it." },
    { screen: "E-mail / WhatsApp received", say: "Within one working day you receive your workspace address and credentials." },
    { screen: "Redirect to the app, login page", say: "Sign in with the password received by e-mail, then change it in My account." },
  ] },
  { id: "parametrage", track: "demarrer", title: "First setup: workshop, VAT, products, materials", duration: "6 min", youtubeId: "", summary: "Enter the workshop details, create the first products with their options and the materials consumed.", script: [
    { screen: "Settings → Workshop", say: "Name, logo, contact details: they appear on quotes and delivery notes." },
    { screen: "Products → New", say: "Create \"Business card\" with its options: format, paper weight, single/double-sided, lamination. Each option can change the price." },
    { screen: "Materials", say: "Declare materials (350 g paper, vinyl…) and their units to track consumption and margin." },
    { screen: "Settings → VAT and numbering", say: "VAT rate and order number format." },
  ] },
  { id: "utilisateurs-roles", track: "demarrer", title: "Invite your team and understand roles", duration: "4 min", youtubeId: "", summary: "Create users and pick the right role: admin, operator, in-house salesperson, external reseller, courier.", script: [
    { screen: "Users → New", say: "Username, password, role. The in-house salesperson only sees their orders; the external reseller sees neither promos, nor delivery, nor mockups/quotes." },
    { screen: "Login with a salesperson account", say: "Show concretely what a salesperson sees compared to the administrator." },
  ] },
  { id: "transporteurs", track: "demarrer", title: "Connect a carrier (Ameex, Olivraison, Ozone Express)", duration: "5 min", youtubeId: "", summary: "Enter the carrier credentials, define fees per zone and test creating a parcel.", script: [
    { screen: "Delivery → Settings → Carriers", say: "Enter the credentials provided by the carrier and the label type." },
    { screen: "Zones and fees", say: "Shipping fees per city/zone; free shipping option above an amount." },
    { screen: "Test order → Create a pickup", say: "Check that the delivery note is generated and the status comes back." },
  ] },
  { id: "prise-commande", track: "vendre", title: "Take an order from A to Z", duration: "7 min", youtubeId: "", summary: "Customer, items, options, files, deposit, adjustment: the complete order and its balance due.", script: [
    { screen: "Orders → New", say: "Choose or create the customer, then add items with their options and quantities." },
    { screen: "Files", say: "Upload the print files; they will go to the workshop when the order enters production." },
    { screen: "Deposit and adjustment", say: "The customer pays a 200 MAD deposit; we apply a 46 MAD discount. The balance due is recalculated, shipping included." },
    { screen: "Order list", say: "Read the Price column (net, gross struck through, adjustment, deposit, shipping) and the Balance due column." },
  ] },
  { id: "devis-maquette", track: "vendre", title: "Quote and mockup approval", duration: "4 min", youtubeId: "", summary: "Send a PDF quote, get a mockup approved by the customer before production.", script: [
    { screen: "Order → Quote", say: "PDF quote generated with the workshop logo, sent by e-mail or WhatsApp." },
    { screen: "Mockups", say: "Upload the mockup; the customer approves or requests a correction; the order only goes into production once approved." },
  ] },
  { id: "statuts-suivi", track: "vendre", title: "Track statuses and edit an order", duration: "4 min", youtubeId: "", summary: "The life cycle of an order, what can be edited at each step, and the trash.", script: [
    { screen: "Status filters", say: "New, in production, ready, out for delivery, delivered, picked up in store." },
    { screen: "Actions → Edit deposit / Delete", say: "The deposit is edited from Actions; deletion is possible until the parcel is picked up." },
    { screen: "Deleted orders", say: "Deleted orders keep all their details and remain viewable." },
  ] },
  { id: "installer-agent", track: "produire", title: "Install PrintiosSync on a workstation", duration: "5 min", youtubeId: "", summary: "Download the installer, create a service account and connect the agent.", script: [
    { screen: "Sync → Install the agent", say: "Download the Windows (or macOS/Linux) installer from the workspace." },
    { screen: "Sync → Agent accounts → Create", say: "Create \"Workshop station 1\": username + generated password, shown once." },
    { screen: "Agent window", say: "Your workspace address, Test button, then username and password of the service account. The agent stays connected, no password stored." },
  ] },
  { id: "dossiers-sync", track: "produire", title: "Choose the folders to sync", duration: "4 min", youtubeId: "", summary: "Create a sync instance: source folder, local folder, deletion of removed files.", script: [
    { screen: "Agent → Explorer (left column)", say: "Browse the print folder and click \"Sync this folder…\"." },
    { screen: "New instance dialog", say: "Name, local destination folder, option to delete locally files removed from the source." },
    { screen: "File list", say: "Files arrive; you see progress, attempts and errors." },
  ] },
  { id: "mode-service", track: "produire", title: "Service mode: sync even with the session closed", duration: "3 min", youtubeId: "", summary: "Install the agent as a Windows service and control it from the web.", script: [
    { screen: "Agent → Settings → Service mode → Install", say: "The agent now runs as a service: it keeps going when nobody is logged in." },
    { screen: "Web workspace → Sync → Workstations", say: "From the web: pause, resume, immediate check, parallelism settings, update." },
  ] },
  { id: "creer-ramassage", track: "livrer", title: "Create a pickup and print the delivery note", duration: "5 min", youtubeId: "", summary: "Select ready orders, create the pickup with the carrier, print notes and labels.", script: [
    { screen: "Delivery → Pickups → New", say: "Select ready orders; the COD amount sent is each order's balance due." },
    { screen: "Pickup document", say: "Delivery note or labels, Print button top right, saved as \"Note-Carrier-Ref.pdf\"." },
    { screen: "Regenerate", say: "If the document is lost, regenerate it from the carrier's stored response." },
  ] },
  { id: "suivi-cod", track: "livrer", title: "Status tracking and COD reconciliation", duration: "5 min", youtubeId: "", summary: "Statuses come back by themselves; at delivery, check that COD collected equals the balance due.", script: [
    { screen: "Order → Delivery history", say: "Carrier statuses arrive automatically: picked up, in transit, delivered, return." },
    { screen: "Delivered orders list", say: "The COD collected is recorded; if the gap with the balance due is not zero, a badge flags it." },
    { screen: "CSV export", say: "Columns gross, adjustment, net, shipping, deposit, balance, COD expected / collected: everything to reconcile with the carrier." },
  ] },
  { id: "livreurs-internes", track: "livrer", title: "In-house couriers and rounds", duration: "4 min", youtubeId: "", summary: "Create your couriers, assign orders, record the collection.", script: [
    { screen: "Delivery → In-house couriers", say: "Courier accounts with a dedicated role; zones and fees." },
    { screen: "Assignment and round", say: "Assign the day's orders; the courier marks delivered and enters the amount collected." },
  ] },
  { id: "tableau-de-bord", track: "gerer", title: "Read the dashboard", duration: "4 min", youtubeId: "", summary: "Revenue, orders by status, deliveries in progress, expected collections.", script: [
    { screen: "Dashboard", say: "Indicators by period and by point of sale; what is \"awaiting delivery\" and what remains to be collected." },
  ] },
  { id: "releves-depenses", track: "gerer", title: "Account statements, expenses and margin", duration: "5 min", youtubeId: "", summary: "Statement per customer or reseller, expense entry, margin per order.", script: [
    { screen: "Account statements", say: "For a customer or a reseller: orders, deposits, balances." },
    { screen: "Expenses", say: "Enter expenses by category; margin takes materials consumed into account." },
  ] },
  { id: "fidelite-promo", track: "gerer", title: "Loyalty, promo codes and automatic promotions", duration: "4 min", youtubeId: "", summary: "Set up points (credited on delivery or pickup), create promo codes and promotions by period.", script: [
    { screen: "Loyalty settings", say: "Points per dirham spent; they are only credited when the order is delivered or picked up." },
    { screen: "Promo codes / Auto promotions", say: "Limited-use code, automatic promotion over a period or on a product." },
  ] },
  { id: "boutique-en-ligne", track: "boutique", title: "Enable the online store", duration: "6 min", youtubeId: "", summary: "Publish the catalogue, customise the store, receive a web order in the production flow.", script: [
    { screen: "Store → Settings", say: "Name, logo, colours, published products and visible options." },
    { screen: "Public store", say: "A customer orders and uploads their file." },
    { screen: "Back office → Orders", say: "The web order arrives with its files and delivery method, like an order entered at the counter." },
  ] },
]
