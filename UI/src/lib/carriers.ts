// Transporteurs intégrés nativement dans l'application (logos dans public/carriers, marques de leurs propriétaires,
// voir mentions légales). Partagé entre la bande « transporteurs » (CarriersBand, serveur) et les schémas animés
// (OrderFlow, client) — d'où ce module sans dépendance. Ajouter un transporteur = une entrée ici + son logo.
export const CARRIERS = [
  { key: "ameex", name: "Ameex", logo: "/carriers/ameex.png", w: 450, h: 130, wordmark: true },
  { key: "olivraison", name: "Olivraison", logo: "/carriers/olivraison.png", w: 512, h: 512, wordmark: false },
  { key: "ozoneexpress", name: "Ozone Express", logo: "/carriers/ozoneexpress.png", w: 536, h: 466, wordmark: false },
  { key: "sendit", name: "Sendit", logo: "/carriers/sendit.png", w: 180, h: 208, wordmark: false },
] as const
