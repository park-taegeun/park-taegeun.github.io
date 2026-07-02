// 라우터 셸 — 랜딩 + 상세 룸. 시그니처 진입 전환(§6)은 CoverOverlay가 라우트 위에 상주.
import { MotionConfig } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CoverOverlay from './components/transition/CoverOverlay'
import { scrollToTopImmediate, useLenisRoot } from './lib/lenis'
import Landing from './pages/Landing'
import ProjectRoom from './pages/ProjectRoom'

function ScrollRestore() {
  const { pathname } = useLocation()
  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    scrollToTopImmediate()
    // 라우트 전환 시 본문 시작점으로 포커스 이동 (a11y)
    const main = document.querySelector('main')
    if (main) {
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
    }
  }, [pathname])
  return null
}

export default function App() {
  useLenisRoot()
  return (
    // reducedMotion="user" — Framer 전 모션이 prefers-reduced-motion을 따름(transform 억제, opacity 유지).
    // GSAP 경로는 prefersReducedMotion()로 개별 가드됨(signature/Reveal/Finale 등).
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollRestore />
        <CoverOverlay />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects/:key" element={<ProjectRoom />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
