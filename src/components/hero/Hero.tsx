// 첫 화면. 위계 = 이름·역할 > 헤드라인(핵심 구절 틸 강조) > 증거 칩 3개. 상단 내비는 TopNav가 맡는다.
// 헤드라인은 About과 같은 문장 하나(정체성 문장 통일). 증거 칩은 각 상세의 결과 블록으로 바로 간다.
// 등장 순서: [data-hero-line] stagger-up → [data-hero-sub] → [data-hero-visual].
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROFILE } from '../../data/about'
import { projectByKey, type ProjectKey } from '../../data/projects'
import { scrollToId } from '../../lib/lenis'
import { EASE_DEFAULT, prefersReducedMotion } from '../../lib/motion'
import { crossfadeToRoom } from '../../lib/signature'
import Marked from '../Mark'
import HeroVisual from './HeroVisual'

const PROOFS: { key: ProjectKey; label: string; metric: string; cond: string }[] = [
  { key: 'ddingdong', label: '띵동', metric: 'macro F1 0.82', cond: '평가 703클립 · 개발 중 값' },
  { key: 'voice', label: '음성 연구', metric: 'CER 0.31 → 0.21', cond: '168발화 · 학습 1회' },
  { key: 'aivault', label: 'AI-Vault', metric: '위험 시도 4/4 차단', cond: '시연 1회 · 사람 커밋도 차단' },
]

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE_DEFAULT } })
        .from('[data-hero-line]', { y: 26, opacity: 0, duration: 0.6, stagger: 0.1 })
        .from('[data-hero-sub]', { y: 14, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.25')
        .from('[data-hero-visual]', { y: 22, opacity: 0, duration: 0.7 }, '-=0.35')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="hero" aria-label="첫 화면" className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center">
        <div className="mx-auto w-full max-w-[1200px] container-pad pt-24 pb-14 lg:pt-28 lg:pb-16 grid items-center gap-12 lg:gap-14 lg:grid-cols-[1.12fr_0.78fr]">
          <div>
            <p
              data-hero-line
              className="inline-block font-body font-semibold text-[13px] tracking-[0.02em] text-signal-deep px-3 py-1.5 rounded-full"
              style={{ background: 'var(--color-signal-soft)' }}
            >
              {PROFILE.role}
            </p>
            <h1 data-hero-line className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-body font-bold text-ink tracking-[-0.04em] leading-none" style={{ fontSize: 'clamp(52px, 8vw, 104px)' }}>
                {PROFILE.name}
              </span>
              <span className="font-display font-semibold text-text-muted tracking-[0.02em] text-[clamp(15px,1.6vw,20px)]">{PROFILE.romanized}</span>
            </h1>
            <p
              data-hero-line
              className="font-body font-bold text-ink leading-[1.38] break-keep mt-6 max-w-[22ch]"
              style={{ fontSize: 'clamp(24px, 2.8vw, 36px)', letterSpacing: '-0.025em' }}
            >
              <Marked text={PROFILE.headline} mark={PROFILE.headlineEmphasis} />
            </p>

            {/* 모바일: 카드 3장을 한 묶음의 목록(행 3개)으로 접어 첫 화면 세로 길이를 줄인다. sm 이상은 카드 3장. */}
            <ul
              className="mt-8 sm:mt-9 grid overflow-hidden rounded-xl border border-line bg-panel divide-y divide-line shadow-[0_10px_30px_rgba(16,26,44,0.06)] sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:divide-y-0 sm:gap-2.5 sm:grid-cols-3"
              aria-label="대표 증거"
            >
              {PROOFS.map((p) => (
                <li key={p.key} data-hero-sub>
                  <button
                    type="button"
                    onClick={() => void crossfadeToRoom(projectByKey(p.key), navigate, '#results')}
                    className="group w-full h-full text-left bg-panel px-4 py-3 sm:py-3.5 transition-colors sm:rounded-xl sm:border sm:border-line sm:shadow-[0_10px_30px_rgba(16,26,44,0.06)] hover:border-navy"
                    aria-label={`${p.label} 결과 보기: ${p.metric}, ${p.cond}`}
                  >
                    <span className="flex items-baseline justify-between gap-3 sm:block">
                      <span className="flex items-center justify-between font-body font-semibold text-[12px] text-text-sub">
                        {p.label}
                        <span aria-hidden className="hidden sm:inline text-text-muted transition-transform group-hover:translate-x-0.5">→</span>
                      </span>
                      <span className="block font-mono font-semibold text-navy text-[15px] sm:text-[16px] leading-[1.3] sm:mt-1.5 tabular-nums text-right sm:text-left">
                        {p.metric}
                      </span>
                    </span>
                    <span className="block font-body text-text-muted text-[11.5px] leading-[1.5] mt-0.5 sm:mt-1">{p.cond}</span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              data-hero-sub
              onClick={() => scrollToId('projects')}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-ink text-white font-body font-semibold text-[14px] px-5 py-3 hover:bg-navy transition-colors cursor-pointer"
            >
              프로젝트 보기
              <span aria-hidden className="text-[15px] leading-none">↓</span>
            </button>
          </div>
          <div data-hero-visual className="w-full">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
