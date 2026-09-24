// ---------------------------------------------------------------------------
// Configuration centrale du site vitrine. TOUT ce qui est « marque » vit ici :
// changer le nom commercial, le domaine ou les coordonnées = modifier ce
// fichier uniquement (les pages, le SEO, les CGV et le footer le lisent).
// ---------------------------------------------------------------------------

export const site = {
  // Marque commerciale affichée partout (peut changer plus tard sans toucher aux pages)
  brand: "PrintManagerOS",
  tagline: "Le système d'exploitation de votre imprimerie",
  // Domaine du site vitrine (SEO, liens absolus, e-mails par défaut)
  domain: "printmanageros.com",
  url: "https://printmanageros.com",
  // Domaine sur lequel les espaces clients sont créés : <slug>.appDomain
  appDomain: "app.printmanageros.com",
  // Nom technique de la plateforme (utilisé dans les textes « sous le capot »)
  platformName: "Packspace",
  // Agent d'impression desktop
  agentName: "PrintManagerOS Sync",
  agentTechnicalName: "PackSpaceS3Sync",

  company: {
    legalName: "PrintManagerOS SARL", // À REMPLACER
    city: "Casablanca",
    address: "Adresse à compléter, Casablanca, Maroc", // À REMPLACER
    ice: "ICE à compléter", // À REMPLACER
    rc: "RC à compléter", // À REMPLACER
  },

  contact: {
    email: "contact@printmanageros.com", // À REMPLACER
    salesEmail: "commercial@printmanageros.com", // À REMPLACER
    supportEmail: "support@printmanageros.com", // À REMPLACER
    phone: "+212 6 00 00 00 00", // À REMPLACER
    whatsapp: "212600000000", // À REMPLACER (format international sans +)
    hours: "Lun–Ven 9h–18h, Sam 9h–13h",
  },

  social: {
    facebook: "https://facebook.com/printmanageros", // À REMPLACER
    instagram: "https://instagram.com/printmanageros", // À REMPLACER
    linkedin: "https://linkedin.com/company/printmanageros", // À REMPLACER
    youtube: "https://youtube.com/@printmanageros", // À REMPLACER
  },

  // Paiement : virement bancaire (activation manuelle depuis la console plateforme)
  bank: {
    holder: "PrintManagerOS SARL", // À REMPLACER
    bankName: "Banque à compléter", // À REMPLACER
    rib: "000 000 0000000000000000 00", // À REMPLACER
  },

  trialDays: 14,
  currency: "DH",
  vatRate: 0.2,

  // Liens vers l'application (page Formation, footer)
  links: {
    login: "https://app.printmanageros.com",
    docs: "/formation",
    status: "/contact",
  },
} as const

export type Site = typeof site

export const money = (n: number, locale: "fr" | "ar" | "en" = "fr") => {
  const nf = { fr: "fr-MA", ar: "ar-MA", en: "en-US" }[locale]
  const cur = { fr: "DH", ar: "درهم", en: "MAD" }[locale]
  return `${new Intl.NumberFormat(nf, { maximumFractionDigits: 0 }).format(n)} ${cur}`
}
