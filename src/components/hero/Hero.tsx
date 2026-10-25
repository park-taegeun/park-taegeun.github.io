// 첫 화면. 왼쪽 = 누구인지(사진·직무·이름·한 문장·행동 버튼), 오른쪽 = 측정 기록표(무엇을 증명했는지).
// 기록표의 숫자는 모두 측정 조건과 함께 쓰고, 다시 재서 낮춘 값은 처음 값을 회색 취소선으로 남긴다.
// 청록은 「실제로 측정한 값」에만 쓴다(사이트 공통 규칙). 등장 연출은 이 화면 한 번만.
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROFILE } from '../../data/about'
import { projectByKey, type ProjectKey } from '../../data/projects'
import { scrollToId } from '../../lib/lenis'
import { EASE_DEFAULT, prefersReducedMotion } from '../../lib/motion'
import { onImgError } from '../../lib/placeholder'
import { crossfadeToRoom } from '../../lib/signature'

interface RecordRow {
  key: ProjectKey
  project: string
  what: string
  value: string
  /** 다시 재서 낮추기 전 값(회색 취소선) */
  before?: string
  cond: string
  /** 상세 페이지 안 위치 */
  to: string
}

const RECORDS: RecordRow[] = [
  { key: 'ddingdong', project: '띵동', what: '현관 소리 4종 분류 macro F1', value: '0.82', cond: '평가 703클립 · 개발 중 값', to: '#results' },
  { key: 'voice', project: '음성 연구', what: '짧은 발화 받아쓰기 오류율(CER)', value: '0.31 → 0.21', cond: '길이를 맞춘 168발화 · 학습 1회', to: '#results' },
  { key: 'voice', project: '음성 연구', what: '어조 모듈의 감정 정답률 효과', before: '+2.2%p', value: '+1.1%p', cond: '학습 1회 값을 시드 3개로 다시 재서 낮춤', to: '?tab=tone#check-0' },
  { key: 'aivault', project: 'AI-Vault', what: 'AI에게 일부러 시킨 위험한 작업', value: '5/5 차단', cond: '시연 1회', to: '#results' },
]

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE_DEFAULT } })
        .from('[data-hero-line]', { y: 22, opacity: 0, duration: 0.6, stagger: 0.08 })
        .from('[data-hero-board]', { y: 18, opacity: 0, duration: 0.6 }, '-=0.3')
        .from('[data-hero-row]', { opacity: 0, duration: 0.4, stagger: 0.07 }, '-=0.3')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="hero" aria-label="첫 화면" className="relative flex min-h-[min(100dvh,980px)] items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1200px] container-pad items-center gap-12 pt-28 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-16 lg:pt-32 lg:pb-20">
        <div>
          <div data-hero-line className="flex items-end gap-5">
            <img
              src={PROFILE.portrait}
              alt={`${PROFILE.name} 프로필 사진`}
              onError={onImgError}
              width={92}
              height={118}
              decoding="async"
              className="block w-[76px] sm:w-[92px] aspect-[600/773] object-cover object-top bg-panel"
              style={{ borderRadius: 12, border: '1px solid var(--color-line)' }}
            />
            <div className="pb-1">
              <p className="font-body font-semibold text-[14px] sm:text-[15px] text-text-sub">{PROFILE.role}</p>
              <h1 className="mt-1.5 font-body font-bold text-ink leading-[0.95] tracking-[-0.045em]" style={{ fontSize: 'clamp(52px, 7vw, 92px)' }}>
                {PROFILE.name}
              </h1>
            </div>
          </div>

          <p
            data-hero-line
            className="mt-9 font-body font-bold text-ink leading-[1.42] break-keep"
            style={{ fontSize: 'clamp(24px, 2.2vw, 31px)', letterSpacing: '-0.035em' }}
          >
            {/* 쉼표에서 두 줄로 나눈다(넓은 화면). 좁은 화면은 자연스럽게 줄바꿈 */}
            {PROFILE.headline.split(', ').map((part, i, all) => (
              <span key={part} className="sm:block">
                {part}
                {i < all.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          <div data-hero-line className="mt-9 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => scrollToId('projects')}
              className="rounded-full bg-ink px-5 py-3 font-body font-semibold text-[14.5px] text-white transition-colors hover:bg-navy"
            >
              프로젝트 보기
            </button>
            <a
              href={`mailto:${PROFILE.email}`}
              className="rounded-full border border-line-strong bg-panel px-5 py-3 font-body font-semibold text-[14.5px] text-ink transition-colors hover:border-ink"
            >
              이메일 보내기
            </a>
          </div>
        </div>

        {/* 측정 기록표 */}
        <aside data-hero-board aria-label="측정 기록" className="bg-panel" style={{ borderRadius: 18, border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-frame)' }}>
          <div className="flex items-baseline justify-between gap-3 px-6 pt-5 pb-4 border-b border-line">
            <h2 className="font-body font-bold text-[15px] text-ink">측정 기록</h2>
            <p className="font-body text-[12.5px] text-text-sub">숫자마다 측정 조건을 함께 적습니다</p>
          </div>
          <ul>
            {RECORDS.map((r) => (
              <li key={r.what} data-hero-row className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => void crossfadeToRoom(projectByKey(r.key), navigate, r.to)}
                  className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 gap-y-1 px-6 py-4 text-left transition-colors hover:bg-base"
                  aria-label={`${r.project} ${r.what}: ${r.before ? `${r.before}에서 ` : ''}${r.value}, ${r.cond}. 상세 보기`}
                >
                  <span className="min-w-0">
                    <span className="block font-body font-semibold text-[12.5px] text-text-sub">{r.project}</span>
                    <span className="mt-0.5 block font-body font-semibold text-[15px] leading-[1.4] text-ink break-keep group-hover:underline underline-offset-4">{r.what}</span>
                  </span>
                  <span className="text-right">
                    <span className="flex items-baseline justify-end gap-2">
                      {r.before && <s className="num font-semibold text-[15px] text-text-sub decoration-[1.5px]">{r.before}</s>}
                      <span className="num font-bold text-[24px] leading-none text-signal-deep whitespace-nowrap">{r.value}</span>
                    </span>
                  </span>
                  <span className="col-span-2 font-body text-[12.5px] leading-[1.5] text-text-sub break-keep sm:col-span-1 sm:col-start-2 sm:text-right">{r.cond}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
