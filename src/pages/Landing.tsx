// 랜딩: 홈 → 프로젝트(탭) → 일하는 방식 → 이력 → 기록(velog, 시리즈 탭) → 마무리·연락처.
// 상단 내비(TopNav)가 처음부터 보이고, 각 섹션은 한눈에 훑히게 짧게 둔다. 자세한 내용은 상세 페이지로 보낸다.
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import About, { TimelineSection } from '../components/about/About'
import Finale from '../components/finale/Finale'
import Hero from '../components/hero/Hero'
import Label from '../components/Label'
import TopNav from '../components/nav/TopNav'
import ProjectsShowcase from '../components/projects/ProjectsShowcase'
import { VELOG_URL, WRITING_SERIES, latestPost } from '../data/writing'

export default function Landing() {
  return (
    <>
      <TopNav />
      <main>
        <Hero />
        <ProjectsShowcase />
        <About />
        <TimelineSection />
        <Writing />
        <Finale />
      </main>
    </>
  )
}

/* ── 기록(velog): 시리즈 3개를 탭으로 ── */
function Writing() {
  const [idx, setIdx] = useState(0)
  const s = WRITING_SERIES[idx]
  const latest = latestPost(s.name)
  return (
    <section id="writing" aria-label="기록" className="relative overflow-hidden border-t border-line bg-soft/50">
      <div className="mx-auto max-w-[1200px] container-pad" style={{ paddingBlock: 'clamp(64px, 8vw, 112px)' }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Label as="p">Log</Label>
            <h2 className="font-body font-bold text-ink mt-3 tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
              기록
            </h2>
            <p className="font-body text-text-sub text-[15px] leading-[1.6] mt-3 break-keep">실험과 설계 판단을 날짜와 함께 velog에 남깁니다.</p>
          </div>
          <a href={VELOG_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-body font-semibold text-[14px] text-signal hover:text-ink transition-colors">
            velog 전체 글 <span aria-hidden>↗</span>
          </a>
        </div>

        <div role="tablist" aria-label="velog 시리즈" className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
          {WRITING_SERIES.map((w, i) => {
            const on = i === idx
            return (
              <button
                key={w.name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setIdx(i)}
                className={`shrink-0 rounded-full border px-4 py-2.5 font-body text-[14px] whitespace-nowrap transition-colors ${on ? 'bg-ink border-ink text-white font-bold' : 'bg-panel border-line text-ink font-semibold hover:border-line-strong'}`}
              >
                {w.name}
                <span className={`ml-2 font-mono text-[12px] ${on ? 'text-white/70' : 'text-text-sub'}`}>{w.count}</span>
              </button>
            )
          })}
        </div>

        <div role="tabpanel" aria-label={`${s.name} 시리즈`} className="mt-5 bg-panel" style={{ borderRadius: 18, border: 'var(--frame-border)', boxShadow: 'var(--shadow-soft)' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="px-5 py-6 sm:px-8 sm:py-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="font-body text-text-sub text-[14.5px] leading-[1.6] break-keep max-w-[70ch]">{s.blurb}</p>
                {latest && (
                  <a href={latest.href} target="_blank" rel="noreferrer" className="group inline-flex items-baseline gap-2 font-body text-[13px]">
                    <span className="font-bold text-signal">최근 글</span>
                    <time className="font-mono text-[12px] text-text-sub">{latest.date}</time>
                  </a>
                )}
              </div>
              <ul className="mt-5 border-t border-line">
                {s.posts.map((p) => (
                  <li key={p.href} className="border-b border-line">
                    <a href={p.href} target="_blank" rel="noreferrer" className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-3.5 sm:grid-cols-[96px_1fr_auto] sm:gap-x-6">
                      <time className="hidden font-mono text-[12.5px] tabular-nums text-text-sub sm:block">{p.date}</time>
                      <span className="min-w-0">
                        <span className="block font-body font-semibold text-ink text-[15px] leading-[1.45] break-keep group-hover:underline underline-offset-4">{p.title}</span>
                        <time className="mt-1 block font-mono text-[11.5px] text-text-sub sm:hidden">{p.date}</time>
                      </span>
                      <span aria-hidden className="text-text-sub transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href={s.href} target="_blank" rel="noreferrer" className="group mt-5 inline-flex items-center gap-1 font-body font-semibold text-[13.5px] text-signal">
                {s.name} 전체 {s.count} 보기 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
