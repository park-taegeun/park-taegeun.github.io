// 블랙 피날레 — 3박자:
// ① 검은 원확산(~0.7s, #0A0A0A)이 흰 세계를 삼킴 ② 연락처(호버 시 색 점등)
// ③ 마감 워드마크(VERIFIED.) 글자 하나씩 조용한 stagger + 마무리 한 줄.
// 기본 마크업 = 완성 상태(검정 배경·콘텐츠 가시). JS 없거나 reduced-motion이면 그대로 보임.
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { VELOG_URL } from '../../data/writing'
import { PROFILE } from '../../data/about'
import { EASE_DEFAULT, EASE_ROOM, prefersReducedMotion } from '../../lib/motion'

const GITHUB_URL = PROFILE.github
const EMAIL = PROFILE.email
const CLOSING = 'VERIFIED.'

interface ContactItem {
  label: string
  sub: string
  href: string
  hoverClass: string
  external: boolean
}

const CONTACTS: ContactItem[] = [
  { label: 'GitHub', sub: PROFILE.githubHandle, href: GITHUB_URL, hoverClass: 'group-hover:text-github-bright', external: true },
  { label: 'Velog', sub: '@xorms', href: VELOG_URL, hoverClass: 'group-hover:text-signal-bright', external: true },
  { label: 'Email', sub: EMAIL, href: `mailto:${EMAIL}`, hoverClass: 'group-hover:text-signal-bright', external: false },
]

function ContactRow({ label, sub, href, hoverClass, external }: ContactItem) {
  const linkProps = external ? { target: '_blank' as const, rel: 'noreferrer' } : {}
  return (
    <li data-contact-row className="group border-b border-white/15 relative overflow-hidden">
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 bg-white/[0.06] will-change-transform"
      />
      <a href={href} {...linkProps} className="relative flex items-center justify-between py-6 lg:py-7 gap-6">
        <div className="min-w-0">
          <p
            className={`font-display font-bold text-white leading-none tracking-[-0.04em] transition-colors duration-300 ${hoverClass}`}
            style={{ fontSize: 'clamp(28px, 5vw, 54px)' }}
          >
            {label}
          </p>
          <p className="font-body text-white/35 text-[13px] mt-1.5 transition-colors duration-300 group-hover:text-white/60">
            {sub}
          </p>
        </div>
        <span
          aria-hidden
          className="shrink-0 font-body text-white/25 text-[20px] leading-none transition-all duration-300 will-change-transform group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:text-white/70"
        >
          {external ? '↗' : '→'}
        </span>
      </a>
    </li>
  )
}

export default function Finale() {
  const root = useRef<HTMLElement>(null)
  const black = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rootEl = root.current
    const blackEl = black.current
    if (!rootEl || !blackEl || prefersReducedMotion()) return

    const letters = rootEl.querySelectorAll('[data-fin-letter]')
    const fades = rootEl.querySelectorAll('[data-finale-fade]')
    const end = rootEl.querySelectorAll('[data-finale-end]')
    const contactRows = rootEl.querySelectorAll('[data-contact-row]')

    // 숨김은 모션 경로에서만 생성 (정보 손실 방지)
    gsap.set(blackEl, { clipPath: 'circle(0% at 50% 50%)' })
    gsap.set(fades, { opacity: 0, y: 14 })
    gsap.set(contactRows, { opacity: 0, y: 24 })
    gsap.set(letters, { opacity: 0, y: 18 })
    gsap.set(end, { opacity: 0 })

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        io.disconnect()
        gsap
          .timeline()
          .to(blackEl, { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: EASE_ROOM })
          .to(fades, { opacity: 1, y: 0, duration: 0.5, ease: EASE_DEFAULT, stagger: 0.08 }, '-=0.15')
          .to(contactRows, { opacity: 1, y: 0, duration: 0.65, ease: EASE_DEFAULT, stagger: 0.12 }, '-=0.1')
          .to(letters, { opacity: 1, y: 0, duration: 0.9, ease: EASE_DEFAULT, stagger: 0.08 }, '-=0.2')
          .to(end, { opacity: 1, duration: 0.6, ease: 'power1.out' }, '-=0.4')
      },
      { threshold: 0.3 },
    )
    io.observe(rootEl)
    return () => {
      io.disconnect()
      gsap.killTweensOf([blackEl, ...fades, ...contactRows, ...letters, ...end])
    }
  }, [])

  return (
    <footer ref={root} className="relative overflow-hidden text-white">
      <div ref={black} aria-hidden className="absolute inset-0 bg-[#0A0A0A]" />

      <div className="relative">
        <section aria-label="후킹" className="mx-auto max-w-[1200px] container-pad pt-24 pb-16">
          <h2
            data-finale-fade
            className="font-body font-bold text-white leading-[1.28] tracking-[-0.02em] break-keep"
            style={{ fontSize: 'clamp(24px, 3.4vw, 44px)' }}
          >
            좋아 보이는 결과일수록, 통제된 조건에서 다시 재현합니다.
          </h2>
          <p
            data-finale-fade
            className="font-body font-bold text-white/40 leading-[1.28] tracking-[-0.02em] mt-2 break-keep"
            style={{ fontSize: 'clamp(24px, 3.4vw, 44px)' }}
          >
            틀린 결론은 스스로 철회하고, 과정까지 기록으로 남깁니다.
          </p>
          <p data-finale-fade className="font-body text-white/50 text-[15px] leading-[1.85] mt-7 max-w-[46ch] break-keep">
            음성·EEG·소리 알림. 모델 하나가 아니라 데이터가 흐르는 전 구간을 설계하고 검증했습니다.<br />
            실패와 철회까지 타임스탬프로 남겨, 다음 판단의 근거로 씁니다.
          </p>
        </section>

        <section id="contact" aria-label="연락처" className="mx-auto max-w-[1200px] container-pad pt-2 pb-0">
          <h2 className="sr-only">Contact</h2>
          <p data-finale-fade className="font-body text-white/30 text-[11px] tracking-[0.14em] uppercase mb-5">Contact</p>
          <ul className="border-t border-white/15">
            {CONTACTS.map((c) => (
              <ContactRow key={c.label} {...c} />
            ))}
          </ul>
        </section>

        <section aria-label="마무리" className="mx-auto max-w-[1200px] container-pad pb-32 pt-12">
          <p
            className="font-display font-bold uppercase tracking-[-0.04em] leading-[0.95]"
            style={{ fontSize: 'clamp(48px,8vw,120px)' }}
          >
            <span className="sr-only">{CLOSING}</span>
            <span aria-hidden className="flex flex-wrap">
              {CLOSING.split('').map((ch, i) => (
                <span key={i} data-fin-letter className="inline-block whitespace-pre will-change-transform">
                  {ch}
                </span>
              ))}
            </span>
          </p>
          <p data-finale-end className="font-body text-white/60 text-[14px] leading-[1.7] mt-6">
            숫자가 스스로 말할 때까지, 측정하고 기록합니다.
          </p>
        </section>
      </div>
    </footer>
  )
}
