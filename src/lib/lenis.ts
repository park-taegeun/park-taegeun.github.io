// Lenis 부드러운 스크롤 — 글로벌 1회 초기화 (IMPLEMENTATION.md P1)
// prefers-reduced-motion이면 네이티브 스크롤 유지 (가드레일 §8)
import Lenis from 'lenis'
import { useEffect } from 'react'

let lenis: Lenis | null = null

/** scrollToId가 보내는 요청. 받는 쪽(탭)이 자기 항목이면 탭을 바꾸고 redirect에 스크롤 대상 id를 적는다. */
export interface AnchorRequest {
  id: string
  redirect?: string
}
export const ANCHOR_EVENT = 'portfolio:anchor'
/** 상단 고정 내비 높이 + 여백(px) */
export const NAV_OFFSET = 76

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
  // 탭 안의 항목(프로젝트 탭 등)이면 그 탭을 먼저 열고, 탭 묶음의 시작점으로 스크롤한다.
  const detail: AnchorRequest = { id }
  window.dispatchEvent(new CustomEvent<AnchorRequest>(ANCHOR_EVENT, { detail }))
  const el = document.getElementById(detail.redirect ?? id)
  if (!el) return
  // 상단 고정 내비에 가리지 않게 위쪽 여백을 둔다
  if (lenis) lenis.scrollTo(el, { offset: -NAV_OFFSET })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, behavior: 'smooth' })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** 라우트 전환 직후 최상단 복귀 (전환 연출은 P4에서 대체) */
export function scrollToTopImmediate(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}
