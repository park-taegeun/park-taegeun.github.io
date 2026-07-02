// 전환 커버 — App 상주 fixed 오버레이. clip-path 원확산(§6②) / opacity 크로스페이드 양 모드.
// 모션은 clip-path·opacity만(가드레일). pointer-events 차단으로 전환 중 오조작 방지.
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { setCoverApi } from '../../lib/cover'
import { EASE_ROOM } from '../../lib/motion'

export default function CoverOverlay() {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = el.current
    if (!node) return

    setCoverApi({
      coverIn(tone, mode, duration) {
        return new Promise((resolve) => {
          gsap.killTweensOf(node)
          node.style.background = tone
          node.style.display = 'block'
          node.style.pointerEvents = 'auto'
          // onInterrupt: killTweensOf로 끊겨도 Promise는 반드시 해제 (오케스트레이터 플래그 고착 방지)
          if (mode === 'circle') {
            gsap.fromTo(
              node,
              { clipPath: 'circle(0% at 50% 50%)', opacity: 1 },
              {
                clipPath: 'circle(150% at 50% 50%)',
                duration,
                ease: EASE_ROOM,
                onComplete: () => resolve(),
                onInterrupt: () => resolve(),
              },
            )
          } else {
            gsap.fromTo(
              node,
              { clipPath: 'none', opacity: 0 },
              {
                opacity: 1,
                duration,
                ease: 'power1.out',
                onComplete: () => resolve(),
                onInterrupt: () => resolve(),
              },
            )
          }
        })
      },
      coverOut(duration) {
        return new Promise((resolve) => {
          gsap.killTweensOf(node)
          const finish = () => {
            node.style.display = 'none'
            node.style.pointerEvents = 'none'
            node.style.clipPath = 'none'
            resolve()
          }
          gsap.to(node, {
            opacity: 0,
            duration,
            ease: 'power1.in',
            onComplete: finish,
            onInterrupt: finish,
          })
        })
      },
    })
    return () => {
      setCoverApi(null)
      gsap.killTweensOf(node)
    }
  }, [])

  return (
    <div
      ref={el}
      aria-hidden
      className="fixed inset-0 z-[100]"
      style={{ display: 'none', pointerEvents: 'none' }}
    />
  )
}
