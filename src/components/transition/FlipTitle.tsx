// 시그니처 글자 플립 (§6①) — 각 글자 = 앞면(검정)/뒷면(액센트) 2면 카드.
// rotateX 0→180°, 0.5~0.55s, stagger 30ms(클릭한 글자부터), ease expo.out(.16,1,.3,1),
// perspective 800px + preserve-3d. 면 교체라 색 트윈·가독 공백 없음.
// reduced-motion: 플립 대신 제목 색만 액센트로 변경(§6).
import gsap from 'gsap'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { EASE_FLIP, prefersReducedMotion } from '../../lib/motion'

export interface FlipTitleHandle {
  play(fromLetter: number): void
}

interface FlipTitleProps {
  name: string
  /** 뒷면(액센트) 색 — 프로젝트 ink(네이비) */
  ink: string
  onActivate: (letterIndex: number) => void
}

const FlipTitle = forwardRef<FlipTitleHandle, FlipTitleProps>(function FlipTitle(
  { name, ink, onActivate },
  ref,
) {
  const wrap = useRef<HTMLSpanElement>(null)
  const played = useRef(false)

  useImperativeHandle(ref, () => ({
    play(fromLetter: number) {
      const node = wrap.current
      if (!node || played.current) return
      played.current = true
      const cards = node.querySelectorAll<HTMLElement>('[data-letter-card]')
      if (prefersReducedMotion()) {
        // 제목 색만 변경 (§6 reduced 경로)
        node.querySelectorAll<HTMLElement>('[data-letter-front]').forEach((f) => {
          f.style.color = ink
        })
        return
      }
      gsap.to(cards, {
        rotateX: 180,
        duration: 0.52,
        ease: EASE_FLIP,
        stagger: { each: 0.03, from: Math.max(0, Math.min(fromLetter, cards.length - 1)) },
      })
    },
  }))

  return (
    <button
      type="button"
      aria-label={`${name} 상세 보기`}
      onClick={(e) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>('[data-letter-card]')
        onActivate(card ? Number(card.dataset.index) : 0)
      }}
      className="block text-left font-display font-bold uppercase tracking-[-0.04em] text-h1 cursor-pointer"
      style={{ lineHeight: 0.96 }}
    >
      <span ref={wrap} aria-hidden className="flex flex-wrap" style={{ perspective: '800px' }}>
        {name.split('').map((ch, i) => {
          const glyph = ch === ' ' ? ' ' : ch
          return (
            <span
              key={i}
              data-letter-card
              data-index={i}
              className="relative inline-block will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span data-letter-front className="block text-ink" style={{ backfaceVisibility: 'hidden' }}>
                {glyph}
              </span>
              <span
                className="absolute inset-0"
                style={{ color: ink, backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
              >
                {glyph}
              </span>
            </span>
          )
        })}
      </span>
    </button>
  )
})

export default FlipTitle
