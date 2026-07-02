// Hero — 타이포가 보스(좌), 상관 산점도 데이터 모티프는 우측 보조.
// 등장 순서: 워드마크·헤드라인 stagger-up → 서브라인 → 산점도(슬라이드 인).
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { labelEnClass } from '../Label'
import Wordmark from '../Wordmark'
import { EASE_DEFAULT, prefersReducedMotion } from '../../lib/motion'
import HeroVisual from './HeroVisual'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE_DEFAULT } })
        .from('[data-hero-line]', { y: 28, opacity: 0, duration: 0.6, stagger: 0.12 })
        .from('[data-hero-sub]', { y: 16, opacity: 0, duration: 0.5 }, '-=0.25')
        .from('[data-hero-visual]', { x: 24, opacity: 0, duration: 0.7 }, '-=0.35')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="hero"
      aria-label="소개"
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1280px] container-pad py-24 grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <div data-hero-line>
            <Wordmark />
          </div>
          <div data-hero-line className="mt-5">
            <p className="font-body font-semibold text-ink text-[14px] tracking-[0.01em]">AI · ML · Systems</p>
            <p className={`${labelEnClass} mt-1.5`}>VOICE · LLM · SYSTEMS</p>
          </div>

          <h2
            className="font-body font-bold text-ink mt-16 leading-[1.32] break-keep"
            style={{ fontSize: 'clamp(24px,3.4vw,38px)', letterSpacing: '-0.02em' }}
          >
            <span className="block" data-hero-line>
              모델이 틀리는 지점을 유형으로 나누고,
            </span>
            <span className="block" data-hero-line>
              평가 지표 자체가 무엇을 재는지부터
            </span>
            <span className="block" data-hero-line>
              검증하는 사람.
            </span>
          </h2>
          <p data-hero-sub className="font-body text-text-sub text-[16px] leading-[1.75] mt-6 max-w-[50ch] break-keep">
            잘 나온 숫자를 먼저 의심하고, 통제된 조건에서 다시 재현합니다.
            <br />
            모델 하나가 아니라 데이터가 흐르는 전 구간을 설계하고,
            <br />
            틀린 결론은 스스로 철회해 실측 로그로 남깁니다.
          </p>
        </div>

        <div data-hero-visual className="w-full">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
