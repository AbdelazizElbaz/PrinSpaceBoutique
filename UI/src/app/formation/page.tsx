import type { Metadata } from "next"
import Link from "next/link"
import { Clock, PlayCircle } from "lucide-react"
import { Section, SectionHeading, CtaBand, Badge } from "@/components/ui"
import { tracks, videos, videosByTrack } from "@/content/videos"
import { site } from "@/content/site.config"

export const metadata: Metadata = {
  title: "Formation vidéo — démarrer, vendre, produire, livrer, gérer",
  description: `Vidéothèque gratuite ${site.brand} : parcours par rôle, vidéos courtes de 3 à 7 minutes, du premier paramétrage au rapprochement COD.`,
}

function VideoCard({ v }: { v: (typeof videos)[number] }) {
  return (
    <article className="card flex flex-col">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
        {v.youtubeId ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0`}
            title={v.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-800 to-ink text-white">
            <PlayCircle className="h-10 w-10 opacity-80" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Bientôt disponible</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Clock className="h-3.5 w-3.5" /> {v.duration}
        <Badge color="slate">{tracks.find((t) => t.id === v.track)?.title}</Badge>
      </div>
      <h3 className="mt-2 text-base font-semibold text-ink">{v.title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{v.summary}</p>
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-semibold text-brand-700">Ce que montre la vidéo</summary>
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

export default function TrainingPage() {
  return (
    <>
      <Section className="pb-6">
        <SectionHeading
          eyebrow="Formation"
          title="Apprenez l'outil en une heure, par rôle"
          lead={`${videos.length} vidéos courtes, gratuites, dans l'ordre où vous en aurez besoin. Les forfaits Pro et Business ajoutent une session d'onboarding en visio.`}
        />
        <nav className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tracks.map((t) => (
            <a key={t.id} href={`#${t.id}`} className="rounded-xl border border-slate-200 p-4 text-center hover:border-brand-300">
              <span className="block text-sm font-semibold text-ink">{t.title}</span>
              <span className="mt-1 block text-xs text-slate-500">{videosByTrack(t.id).length} vidéos · {t.audience}</span>
            </a>
          ))}
        </nav>
      </Section>

      {tracks.map((t, i) => (
        <Section key={t.id} id={t.id} tone={i % 2 ? "gray" : "white"} className="scroll-mt-20 py-12 sm:py-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Parcours {i + 1}</p>
              <h2 className="h2 mt-2">{t.title}</h2>
              <p className="mt-2 text-slate-600">{t.description}</p>
            </div>
            <Badge>Pour : {t.audience}</Badge>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videosByTrack(t.id).map((v) => (
              <VideoCard key={v.id} v={v} />
            ))}
          </div>
        </Section>
      ))}

      <Section tone="gray">
        <div className="card mx-auto max-w-3xl text-center">
          <h2 className="h3">Besoin d&apos;une formation sur mesure ?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Onboarding en visio inclus sur Pro (1 h) et Business (2 h). Formation sur site, import de vos données et paramétrage complet sur devis.
          </p>
          <Link href="/contact?sujet=formation" className="btn-primary mt-5">
            Demander une formation
          </Link>
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
