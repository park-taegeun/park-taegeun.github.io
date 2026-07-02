// 세션 슬라이드 Peek Carousel — 현재 슬라이드 68% 너비 중앙, 양측 ~14% 피크
// 비활성 슬라이드: scale(0.86) + opacity(0.38). 이미지 잘림 없음(object-contain).
// 하단: 중앙 한 줄 요약 + 우측 하단 카운터.
// transform/opacity만 (가드레일 §8). prefers-reduced-motion 대응.
import { useState, useEffect, useCallback, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/motion'

interface SlideItem {
  src: string
  alt: string
  caption: string
}

interface SlideViewerProps {
  items: SlideItem[]
}

const SLIDE_W = 68
const GAP     = 3
const STEP    = SLIDE_W + GAP          // 71
const OFFSET  = (100 - STEP) / 2      // 14.5

export default function SlideViewer({ items }: SlideViewerProps) {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const n = items.length

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent(c => Math.min(n - 1, c + 1)), [n])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current) return
      const { top, bottom } = containerRef.current.getBoundingClientRect()
      if (top >= window.innerHeight || bottom <= 0) return
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  const reduced  = prefersReducedMotion()
  const trackEase = reduced ? 'none' : 'transform 0.35s var(--ease-default)'
  const cardEase  = reduced ? 'none'
    : 'opacity 0.3s var(--ease-default), transform 0.3s var(--ease-default), box-shadow 0.3s var(--ease-default)'

  return (
    <div ref={containerRef} role="region" aria-label="세션 슬라이드 뷰어">
      {/* 트랙 래퍼 */}
      <div className="relative">
        {/* overflow clip */}
        <div className="overflow-hidden">
          <div
            style={{
              display: 'flex',
              transform: `translateX(calc(${OFFSET}% - ${current * STEP}%))`,
              transition: trackEase,
              willChange: 'transform',
            }}
          >
            {items.map((item, i) => {
              const isActive = i === current
              return (
                <button
                  key={item.src}
                  type="button"
                  aria-label={`슬라이드 ${i + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => setCurrent(i)}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    flex: `0 0 ${STEP}%`,
                    paddingInline: `${GAP / 2}%`,
                    cursor: isActive ? 'default' : 'pointer',
                    display: 'block',
                  }}
                >
                  <div
                    className="overflow-hidden bg-panel border border-line"
                    style={{
                      borderRadius: 8,
                      opacity: isActive ? 1 : 0.38,
                      transform: isActive ? 'scale(1)' : 'scale(0.86)',
                      boxShadow: isActive
                        ? '0 10px 32px rgba(0,0,0,0.13)'
                        : '0 2px 6px rgba(0,0,0,0.06)',
                      transition: cardEase,
                    }}
                  >
                    {/* aspect-ratio 고정 + object-contain → 이미지 잘림 없음 */}
                    <div style={{ aspectRatio: '16/9' }}>
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className="block w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 네비게이션 버튼 — peek 영역 위에 부유 */}
        {n > 1 && (
          <div
            className="absolute inset-0 flex items-center justify-between pointer-events-none"
            style={{ paddingInline: `${OFFSET * 0.55}%` }}
          >
            <button
              type="button"
              aria-label="이전 슬라이드"
              disabled={current === 0}
              onClick={prev}
              className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center bg-panel border border-line hover:opacity-80 disabled:opacity-25 disabled:cursor-default transition-opacity duration-150"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M9.5 3 5 7.5l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              type="button"
              aria-label="다음 슬라이드"
              disabled={current === n - 1}
              onClick={next}
              className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center bg-panel border border-line hover:opacity-80 disabled:opacity-25 disabled:cursor-default transition-opacity duration-150"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M5.5 3 10 7.5 5.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 하단 바: 스페이서 | 한 줄 요약 (중앙) | 카운터 (우측) */}
      <div className="mt-4 flex items-center gap-2">
        <div className="w-14 shrink-0" />
        <div className="flex-1 text-center">
          {items[current].caption && (
            <p className="font-body text-[13px] text-ink">
              {items[current].caption}
            </p>
          )}
        </div>
        <p className="w-14 shrink-0 text-right font-body text-[10.5px] tracking-[0.13em] uppercase text-text-muted">
          {current + 1} / {n}
        </p>
      </div>
    </div>
  )
}
