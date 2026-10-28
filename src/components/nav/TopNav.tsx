// 상단 카테고리 내비. 처음부터 보이고 스크롤해도 따라온다. 지금 보고 있는 섹션은 진한 알약으로 표시.
// 어두운 마무리 섹션 위에서는 어두운 유리로 바뀐다. 「연락」은 마무리 섹션 맨 위로 바로 가서(여백 0) 밝은 띠가 남지 않게 한다.
import { useEffect, useState } from 'react'
import { PROFILE } from '../../data/about'
import { scrollToId } from '../../lib/lenis'

const NAV_SECTIONS = [
  { id: 'hero', label: '홈' },
  { id: 'projects', label: '프로젝트' },
  { id: 'about', label: '일하는 방식' },
  { id: 'timeline', label: '이력' },
  { id: 'writing', label: '기록' },
  { id: 'finale', label: '연락' },
] as const

export default function TopNav() {
  const [active, setActive] = useState<string>('hero')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4
      let cur: string = NAV_SECTIONS[0].id
      for (const { id } of NAV_SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < line) cur = id
      }
      // 페이지 맨 아래에 닿으면 마지막 섹션
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = NAV_SECTIONS[NAV_SECTIONS.length - 1].id
      setActive(cur)
      const footer = document.getElementById('finale')
      setDark(!!footer && footer.getBoundingClientRect().top < 56)
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const go = (id: string) => scrollToId(id, id === 'finale' ? { offset: 0 } : {})

  const glass = dark
    ? { background: 'rgba(26,43,74,0.72)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 6px 24px rgba(5,10,20,0.35)' }
    : { background: 'rgba(255,255,255,0.86)', border: '1px solid var(--color-line)', boxShadow: '0 6px 24px rgba(16,26,44,0.07)' }

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-[var(--section-padding-x)] pt-3 sm:pt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go('hero')}
          className={`pointer-events-auto hidden sm:inline-flex items-center rounded-full px-4 h-11 font-body font-bold text-[15px] tracking-[-0.02em] transition-colors ${dark ? 'text-white' : 'text-ink'}`}
          style={{ ...glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
        >
          {PROFILE.name}
        </button>
        <nav aria-label="섹션 이동" className="pointer-events-auto min-w-0 max-w-full ml-auto">
          <ul
            className="flex items-center gap-0.5 rounded-full p-1 overflow-x-auto no-scrollbar"
            style={{ ...glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', transition: 'background 0.4s, border-color 0.4s' }}
          >
            {NAV_SECTIONS.map(({ id, label }) => {
              const on = active === id
              return (
                <li key={id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(id)}
                    aria-current={on ? 'true' : undefined}
                    className="rounded-full h-9 px-2.5 sm:px-4 font-body text-[13px] sm:text-[14px] whitespace-nowrap transition-colors duration-200"
                    style={
                      on
                        ? dark
                          ? { background: '#fff', color: 'var(--color-ink)', fontWeight: 700 }
                          : { background: 'var(--color-ink)', color: '#fff', fontWeight: 700 }
                        : { color: dark ? 'rgba(255,255,255,0.72)' : 'var(--color-text-sub)', fontWeight: 500 }
                    }
                  >
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
