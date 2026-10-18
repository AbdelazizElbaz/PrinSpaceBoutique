import type { Metadata } from "next"
import { AdminMessages } from "@/components/chat/AdminMessages"

// Console du chat en direct (équipe PrintIOS) : conversations, visiteurs en ligne, réponses prédéfinies.
// Protégée par un mot de passe (ADMIN_PASSWORD côté API) ; jamais indexée.
export const metadata: Metadata = { title: "Messages", robots: { index: false, follow: false } }

export default function AdminMessagesPage() {
  return <AdminMessages />
}
