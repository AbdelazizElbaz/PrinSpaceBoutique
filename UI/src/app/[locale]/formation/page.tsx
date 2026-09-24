import type { Metadata } from "next"
import Link from "next/link"
import { Clock, PlayCircle } from "lucide-react"
import { Section, SectionHeading, CtaBand, Badge } from "@/components/ui"
import { site } from "@/content/site.config"
import { getContent } from "@/content"
import type { Video } from "@/content/types"
import { getDict, isLocale, localePath, type Dict } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return { title: t.training.metaTitle, description: t.training.metaDesc(site.brand), alternates: pageAlternates(locale, "/formation") }
}

function VideoCard({ v, t, trackTitle }: { v: Video; t: Dict; trackTitle: string }) {
  return (
    <article className="card flex flex-col">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
        {v.youtubeId ? (
          <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0`} title={v.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-800 to-ink text-white">
            <PlayCircle className="h-10 w-10 opacity-80" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{t.training.soon}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Clock className="h-3.5 w-3.5" /> {v.duration}
        <Badge color="slate">{trackTitle}</Badge>
      </div>
      <h3 className="mt-2 text-base font-semibold text-ink">{v.title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{v.summary}</p>
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-semibold text-brand-700">{t.training.whatShows}</summary>
        <ol className="mt-2 space-y-2 text-xs text-slate-600">
          {v.script.map((s, i) => (
            <li key={i}>
              <span className="font-semibold text-slate-800">{s.screen}</span> — {s.say}
            </li>
          ))}
        </ol>
      </details>
    </article>
  )
}

export default async function TrainingPage({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  const { tracks, videos } = getContent(locale)
  const byTrack = (id: string) => videos.filter((v) => v.track === id)
  return (
    <>
      <Section className="pb-6">
        <SectionHeading eyebrow={t.training.eyebrow} title={t.training.title} lead={t.training.lead(videos.length)} />
        <nav className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tracks.map((tr) => (
            <a key={tr.id} href={`#${tr.id}`} className="rounded-xl border border-slate-200 p-4 text-center hover:border-brand-300">
              <span className="block text-sm font-semibold text-ink">{tr.title}</span>
              <span className="mt-1 block text-xs text-slate-500">
                {byTrack(tr.id).length} {t.training.videos} · {tr.audience}
              </span>
            </a>
          ))}
        </nav>
      </Section>
      {tracks.map((tr, i) => (
        <Section key={tr.id} id={tr.id} tone={i % 2 ? "gray" : "white"} className="scroll-mt-20 py-12 sm:py-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t.training.track(i + 1)}</p>
              <h2 className="h2 mt-2">{tr.title}</h2>
              <p className="mt-2 text-slate-600">{tr.description}</p>
            </div>
            <Badge>
              {t.training.forRole} {tr.audience}
            </Badge>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {byTrack(tr.id).map((v) => (
              <VideoCard key={v.id} v={v} t={t} trackTitle={tr.title} />
            ))}
          </div>
        </Section>
      ))}
      <Section tone="gray">
        <div className="card mx-auto max-w-3xl text-center">
          <h2 className="h3">{t.training.customTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{t.training.customText}</p>
          <Link href={`${localePath(locale, "/contact")}?sujet=formation`} className="btn-primary mt-5">
            {t.training.customCta}
          </Link>
        </div>
      </Section>
      <CtaBand locale={locale} />
    </>
  )
}
