import type { Locale } from "@/i18n/config"
import type { Content } from "./types"
import * as frPlans from "./fr/plans"
import * as frFeatures from "./fr/features"
import * as frFaq from "./fr/faq"
import * as frVideos from "./fr/videos"
import * as frLegal from "./fr/legal"
import * as enPlans from "./en/plans"
import * as enFeatures from "./en/features"
import * as enFaq from "./en/faq"
import * as enVideos from "./en/videos"
import * as enLegal from "./en/legal"
import * as arPlans from "./ar/plans"
import * as arFeatures from "./ar/features"
import * as arFaq from "./ar/faq"
import * as arVideos from "./ar/videos"
import * as arLegal from "./ar/legal"

type PlansMod = { plans: Content["plans"]; comparison: Content["comparison"] }
type FeaturesMod = Pick<Content, "features" | "steps" | "audiences" | "stats" | "testimonials">
type FaqMod = { faq: Content["faq"] }
type VideosMod = { tracks: Content["tracks"]; videos: Content["videos"] }
type LegalMod = { legal: Content["legal"] }

const build = (p: PlansMod, f: FeaturesMod, q: FaqMod, v: VideosMod, l: LegalMod): Content => ({
  plans: p.plans,
  comparison: p.comparison,
  features: f.features,
  steps: f.steps,
  audiences: f.audiences,
  stats: f.stats,
  testimonials: f.testimonials,
  faq: q.faq,
  tracks: v.tracks,
  videos: v.videos,
  legal: l.legal,
})

const contents: Record<Locale, Content> = {
  fr: build(frPlans, frFeatures, frFaq, frVideos, frLegal),
  en: build(enPlans, enFeatures, enFaq, enVideos, enLegal),
  ar: build(arPlans, arFeatures, arFaq, arVideos, arLegal),
}

export const getContent = (locale: Locale): Content => contents[locale] ?? contents.fr
export type { Content }
