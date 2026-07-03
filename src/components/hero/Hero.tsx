// Hero — 상단 워드마크 마스트헤드(전폭) + 하단 2단(대기업형 상하 구조).
// 상관 산점도(데이터 모티프)를 우측 시그니처로, 좌측 텍스트 위계는 3초 스캔에 맞춘다.
// 등장 순서: [data-hero-line] stagger-up → [data-hero-sub] → [data-hero-visual].
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { labelEnClass } from '../Label'
import Wordmark from '../Wordmark'
import { scrollToId } from '../../lib/lenis'
import { EASE_DEFAULT, prefersReducedMotion } from '../../lib/motion'
import HeroVisual from './HeroVisual'

/** 확정 헤드라인(불변) — 3줄, 재현·검증 포지셔닝 */
function Headline() {
  return (
    <h2
      className="font-body font-bold text-ink leading-[1.32] break-keep"
      style={{ fontSize: 'clamp(23px,2.6vw,32px)', letterSpacing: '-0.02em' }}
    >
      <span className="block" data-hero-line>모델이 틀리는 지점을 유형으로 나누고,</span>
      <span className="block" data-hero-line>평가 지표 자체가 무엇을 재는지부터</span>
      <span className="block" data-hero-line>검증하는 사람.</span>
    </h2>
  )
}

/** 확정 서브 카피(불변) */
function Sub() {
  return (
    <p data-hero-sub className="font-body text-text-sub text-[16px] leading-[1.75] break-keep mt-6 max-w-[46ch]">
      잘 나온 숫자를 먼저 의심하고, 통제된 조건에서 다시 재현합니다.
      <br />
      모델 하나가 아니라 데이터가 흐르는 전 구간을 설계하고,
      <br />
      틀린 결론은 스스로 철회해 실측 로그로 남깁니다.
    </p>
  )
}

function ScrollCue() {
  return (
    <button
      type="button"
      data-hero-sub
      onClick={() => scrollToId('about')}
      className="mt-11 inline-flex items-center gap-2 font-body font-semibold text-[14px] tracking-[0.02em] text-signal cursor-pointer"
    >
      작업 보기
      <span aria-hidden className="text-[15px] leading-none">↓</span>
    </button>
  )
}

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE_DEFAULT } })
        .from('[data-hero-line]', { y: 28, opacity: 0, duration: 0.6, stagger: 0.12 })
        .from('[data-hero-sub]', { y: 16, opacity: 0, duration: 0.5 }, '-=0.25')
        .from('[data-hero-visual]', { y: 24, opacity: 0, duration: 0.7 }, '-=0.3')
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
      <div className="mx-auto w-full max-w-[1200px] container-pad py-20">
        <div data-hero-line className="flex justify-center border-b border-line pb-9">
          <Wordmark maxW="860px" />
        </div>
        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1.15fr_0.72fr]">
          <div>
            <p data-hero-line className={labelEnClass}>
              AI · ML · SYSTEMS
            </p>
            <Headline />
            <Sub />
            <ScrollCue />
          </div>
          <div data-hero-visual className="w-full">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
