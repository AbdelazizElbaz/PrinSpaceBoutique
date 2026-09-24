import type { Plan, CompareGroup } from "./fr/plans"
import type { Feature } from "./fr/features"
import type { FaqGroup } from "./fr/faq"
import type { Video } from "./fr/videos"

export type LegalSection = { h: string; p?: string[]; ul?: string[] }
export type LegalDoc = { title: string; updated: string; intro: string; sections: LegalSection[] }
export type LegalContent = { eyebrow: string; cgv: LegalDoc; privacy: LegalDoc; notice: LegalDoc; contactTitle: string }

export type Step = { n: number; title: string; text: string }
export type Audience = { title: string; text: string }
export type Stat = { value: string; label: string }
export type Testimonial = { name: string; role: string; text: string }
export type Track = { id: Video["track"]; title: string; audience: string; description: string }

export type Content = {
  plans: Plan[]
  comparison: CompareGroup[]
  features: Feature[]
  steps: Step[]
  audiences: Audience[]
  stats: Stat[]
  testimonials: Testimonial[]
  faq: FaqGroup[]
  tracks: Track[]
  videos: Video[]
  legal: LegalContent
}

export type { Plan, CompareGroup, Feature, FaqGroup, Video }
