'use client';
import { useState } from 'react';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import { getLandingButtonScrollTarget, shouldOpenLandingButtonInNewTab } from '@/features/landing-page';
import type { LandingPageContent } from '@/features/landing-page';

const HERO_VIDEO_ID = 'Z5c5-F3rApk';
const HERO_VIDEO_START = 2;

type HeroBannerProps = {
  homeData?: LandingPageContent | null;
};

export default function HeroBanner({ homeData }: HeroBannerProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { content, siteName, textAlign, flexAlign } = useLandingContent();
  const { hero } = content;

  const apiHero = homeData?.heroes?.[0];
  const badge = apiHero?.caption || hero.badge;
  const headline = apiHero?.title || `${hero.titleLine1} ${hero.titleHighlight} ${hero.titleLine2}`;
  const description = apiHero?.description || hero.description;
  const ctaPrimary = apiHero?.f_button_text || hero.ctaPrimary;
  const ctaSecondary = apiHero?.l_button_text || hero.ctaSecondary;
  const ctaPrimaryUrl = apiHero?.f_button_url;
  const ctaSecondaryUrl = apiHero?.l_button_url;
  const videoUrl = apiHero?.vedio_url;
  const proofTags = apiHero?.tags?.length ? apiHero.tags.map((t) => t.name) : hero.proof;

  const videoId = (() => {
    if (!videoUrl) return HERO_VIDEO_ID;
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : HERO_VIDEO_ID;
  })();

  return (
    <section id="home" className="relative isolate min-h-screen overflow-hidden bg-[#06111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgb(var(--primary-glow-rgb) / 0.28),transparent_32%),radial-gradient(circle_at_18%_58%,rgba(33,211,162,0.16),transparent_34%),linear-gradient(135deg,#020617_0%,#071827_52%,#06111f_100%)]" />
      <div className="premium-grid absolute inset-0 opacity-35" />
      <div className="noise-bg opacity-[0.06]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8 lg:pb-20 lg:pt-32">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className={`order-2 text-center ${textAlign}`}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-cyan-200 shadow-2xl shadow-primary/10 backdrop-blur-xl">
              {badge}
            </div>

            <h1 className="mx-auto max-w-4xl text-[1.75rem] font-black leading-[1.34] tracking-[-0.015em] text-white sm:text-[2.25rem] lg:mx-0 lg:text-[2.55rem] xl:text-[2.95rem]">
              {apiHero ? (
                headline
              ) : (
                <>
                  {hero.titleLine1}
                  <span className="mt-2 block text-[var(--mint)]">
                    {hero.titleHighlight}
                  </span>
                  {hero.titleLine2}
                </>
              )}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:mt-7 sm:text-lg sm:leading-9 lg:mx-0">
              {description}
            </p>

            <div className={`mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 ${flexAlign}`}>
              <button
                type="button"
                onClick={() => {
                  if (shouldOpenLandingButtonInNewTab(ctaPrimaryUrl)) {
                    window.open(ctaPrimaryUrl!, '_blank');
                  } else {
                    document
                      .querySelector(getLandingButtonScrollTarget(ctaPrimaryUrl, '#contact'))
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3.5 text-base font-black text-on-primary shadow-2xl shadow-primary/30 transition-all duration-300 hover:-translate-y-1 sm:px-8 sm:py-4 sm:text-lg"
              >
                {ctaPrimary}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (shouldOpenLandingButtonInNewTab(ctaSecondaryUrl)) {
                    window.open(ctaSecondaryUrl!, '_blank');
                  } else {
                    document
                      .querySelector(getLandingButtonScrollTarget(ctaSecondaryUrl, '#works'))
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="touch-lift rounded-2xl border border-white/15 bg-white/8 px-6 py-3.5 text-base font-black text-cyan-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 sm:px-8 sm:py-4 sm:text-lg"
              >
                {ctaSecondary}
              </button>
            </div>

            <div className={`mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 ${flexAlign}`}>
              {proofTags.map((label) => (
                <span key={label} className="rounded-full border border-white/10 bg-white/7 px-4 py-2 text-xs font-bold text-slate-200 backdrop-blur">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[540px] lg:max-w-[620px]">
              <div className="overflow-hidden rounded-2xl border border-white/15 shadow-lg shadow-black/25 sm:rounded-3xl">
                <div className="relative aspect-[16/10] w-full min-h-[220px] sm:min-h-[300px] lg:min-h-[360px]">
                  {videoLoaded ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?start=${HERO_VIDEO_START}&rel=0&modestbranding=1`}
                      title={siteName || hero.videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVideoLoaded(true)}
                      aria-label={hero.videoTitle}
                      className="group absolute inset-0 flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#0b2035_0%,#06111f_55%,#102b3c_100%)] text-white"
                    >
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-2xl shadow-2xl shadow-cyan-950/50 transition-transform duration-300 group-hover:scale-110">
                        <span className="ms-1" aria-hidden="true">▶</span>
                      </span>
                      <span className="sr-only">{hero.videoTitle}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
