// Lenis 부드러운 스크롤 — 글로벌 1회 초기화 (IMPLEMENTATION.md P1)
// prefers-reduced-motion이면 네이티브 스크롤 유지 (가드레일 §8)
import Lenis from 'lenis'
import { useEffect } from 'react'

let lenis: Lenis | null = null

export function useLenisRoot(): void {
  useEffect(() => {
    if (lenis) return // 중복 마운트 가드 (StrictMode·다중 사용)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ autoRaf: true })
    return () => {
      lenis?.destroy()
      lenis = null
    }
  }, [])
}

/** 10초 요약 → Selected 블록 앵커 스크롤 (시그니처 전환 아님 — §0.1).
 *  WCAG 2.4.3: 스크롤 후 대상으로 포커스 이동 */
export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el)
  else el.scrollIntoView({ behavior: 'smooth' })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** 라우트 전환 직후 최상단 복귀 (전환 연출은 P4에서 대체) */
export function scrollToTopImmediate(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}
