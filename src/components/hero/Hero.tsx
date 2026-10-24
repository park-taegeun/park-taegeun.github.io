// 첫 화면. 위계 = 이름·역할 > 헤드라인 > 증거 칩 3개. 워드마크는 상단 좌측 로고 자리로 작게.
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
import HeroVisual from './HeroVisual'

const PROOFS: { key: ProjectKey; label: string; metric: string; cond: string }[] = [
  { key: 'ddingdong', label: '띵동', metric: 'macro F1 0.82', cond: '4종 소리 분류, 평가 703클립, 개발 중 값' },
  { key: 'voice', label: '음성 연구', metric: 'CER 0.31 → 0.21', cond: '길이를 맞춘 168발화, 학습 1회' },
  { key: 'aivault', label: 'AI-Vault', metric: '위험 시도 5/5 차단', cond: '시연 1회, 우회 시도 0' },
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
      <div className="mx-auto w-full max-w-[1200px] container-pad pt-7 flex items-center justify-between border-b border-line pb-5">
        <p className="font-display font-bold text-navy text-[15px] tracking-[0.08em]">
          PORTFOLIO <span className="text-text-muted font-medium">· PARK TAEGEUN</span>
        </p>
        <a href={`mailto:${PROFILE.email}`} className="hidden sm:block font-mono text-[12px] text-text-sub hover:text-ink transition-colors">
          {PROFILE.email}
        </a>
      </div>

      <div className="flex-1 flex items-center">
        <div className="mx-auto w-full max-w-[1200px] container-pad py-14 lg:py-16 grid items-center gap-12 lg:gap-14 lg:grid-cols-[1.12fr_0.78fr]">
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
              {PROFILE.headline}
            </p>

            <ul className="mt-9 grid gap-2.5 sm:grid-cols-3" aria-label="대표 증거">
              {PROOFS.map((p) => (
                <li key={p.key} data-hero-sub>
                  <button
                    type="button"
                    onClick={() => void crossfadeToRoom(projectByKey(p.key), navigate, '#results')}
                    className="group w-full h-full text-left bg-panel px-4 py-3.5 transition-colors hover:border-navy"
                    style={{ borderRadius: 12, border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-soft)' }}
                    aria-label={`${p.label} 결과 보기: ${p.metric}, ${p.cond}`}
                  >
                    <span className="flex items-center justify-between font-body font-semibold text-[12px] text-text-sub">
                      {p.label}
                      <span aria-hidden className="text-text-muted transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                    <span className="block font-mono font-semibold text-navy text-[16px] leading-[1.3] mt-1.5 tabular-nums">{p.metric}</span>
                    <span className="block font-body text-text-muted text-[11.5px] leading-[1.5] mt-1">{p.cond}</span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              data-hero-sub
              onClick={() => scrollToId('glance')}
              className="mt-9 inline-flex items-center gap-2 font-body font-semibold text-[14px] tracking-[0.02em] text-signal cursor-pointer"
            >
              한눈에 보기
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
