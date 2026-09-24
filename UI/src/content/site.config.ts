// ---------------------------------------------------------------------------
// Configuration centrale du site vitrine. TOUT ce qui est « marque » vit ici :
// changer le nom commercial, le domaine ou les coordonnées = modifier ce
// fichier uniquement (les pages, le SEO, les CGV et le footer le lisent).
// ---------------------------------------------------------------------------

export const site = {
  // Marque commerciale affichée partout (peut changer plus tard sans toucher aux pages)
  brand: "PrintIOS",
  tagline: "Le système d'exploitation de votre imprimerie",
  // Domaine du site vitrine (SEO, liens absolus, e-mails par défaut)
  domain: "printios.ma",
  url: "https://printios.ma",
  // Domaine sur lequel les espaces clients sont créés par l'équipe : <atelier>.appDomain
  appDomain: "app.printios.ma",
  // Nom technique de la plateforme (utilisé dans les textes « sous le capot »)
  platformName: "Packspace",
  // Agent d'impression desktop
  agentName: "PrintIOS Sync",
  agentTechnicalName: "PackSpaceS3Sync",

  company: {
    legalName: "PrintIOS SARL", // À REMPLACER
    city: "Casablanca",
    address: "Adresse à compléter, Casablanca, Maroc", // À REMPLACER
    ice: "ICE à compléter", // À REMPLACER
    rc: "RC à compléter", // À REMPLACER
  },

  contact: {
    email: "contact@printios.ma", // À REMPLACER
    salesEmail: "commercial@printios.ma", // À REMPLACER
    supportEmail: "support@printios.ma", // À REMPLACER
    phone: "+212 6 00 00 00 00", // À REMPLACER
    whatsapp: "212600000000", // À REMPLACER (format international sans +)
    hours: "Lun–Ven 9h–18h, Sam 9h–13h",
  },

  social: {
    facebook: "https://facebook.com/printios", // À REMPLACER
    instagram: "https://instagram.com/printios", // À REMPLACER
    linkedin: "https://linkedin.com/company/printios", // À REMPLACER
    youtube: "https://youtube.com/@printios", // À REMPLACER
  },

  // Paiement : virement bancaire (activation manuelle depuis la console plateforme)
  bank: {
    holder: "PrintIOS SARL", // À REMPLACER
    bankName: "Banque à compléter", // À REMPLACER
    rib: "000 000 0000000000000000 00", // À REMPLACER
  },

  trialDays: 14,
  currency: "DH",
  vatRate: 0.2,

  // Liens vers l'application (page Formation, footer)
  links: {
    login: "https://app.printios.ma",
    docs: "/formation",
    status: "/contact",
  },
} as const

export type Site = typeof site

/** Lien WhatsApp avec message pré-rempli (canal de contact principal). */
export const whatsappLink = (text: string) => `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`

export const money = (n: number, locale: "fr" | "ar" | "en" = "fr") => {
  const nf = { fr: "fr-MA", ar: "ar-MA", en: "en-US" }[locale]
  const cur = { fr: "DH", ar: "درهم", en: "MAD" }[locale]
  return `${new Intl.NumberFormat(nf, { maximumFractionDigits: 0 }).format(n)} ${cur}`
}
