// 증거 슬라이드 확대 보기 — 잔글씨가 많은 16:9 발표 슬라이드를 클릭 시 풀사이즈로.
// 오버레이 fade는 opacity만(§8). Esc/배경 클릭/닫기 버튼으로 닫힘. reduced-motion 안전.
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { EvidenceItem } from '../../data/rooms'
import { prefersReducedMotion } from '../../lib/motion'

export default function Lightbox({ item, onClose }: { item: EvidenceItem; onClose: () => void }) {
  const reduced = prefersReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // 포커스 트랩 — 닫기 버튼이 유일한 인터랙티브 요소이므로 Tab을 그 안에 가둔다
      if (e.key === 'Tab') {
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // 포커스 관리 — 열릴 때 닫기 버튼으로, 닫힐 때 트리거로 복귀
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="슬라이드 확대 보기"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-5 md:p-10"
      style={{ background: 'rgba(15,23,42,0.82)' }}
      onClick={onClose}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        ref={closeRef}
        aria-label="확대 보기 닫기"
        onClick={onClose}
        className="absolute top-3 right-4 md:top-5 md:right-6 grid place-items-center h-10 w-10 rounded-full text-white/85 hover:text-white hover:bg-white/10 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
      <img
        src={item.src}
        alt={item.alt}
        decoding="async"
        className="max-w-[min(1100px,94vw)] max-h-[82vh] w-auto h-auto object-contain rounded-[8px]"
        style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      />
      <p
        className="font-body text-white/95 text-[13.5px] leading-[1.55] mt-4 max-w-[72ch] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.caption}
      </p>
    </motion.div>
  )
}
