// 스크롤 리빌 — IntersectionObserver + GSAP (transform/opacity만, 가드레일 §8).
// reduced-motion이면 숨김 자체를 만들지 않음(정보 즉시 가시).
import gsap from 'gsap'
import { useEffect, useRef, type ReactNode } from 'react'
import { EASE_DEFAULT, prefersReducedMotion } from '../../lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    gsap.set(el, { opacity: 0, y: 28 })
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay, ease: EASE_DEFAULT, clearProps: 'transform' })
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'opacity,transform' })
    }
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
