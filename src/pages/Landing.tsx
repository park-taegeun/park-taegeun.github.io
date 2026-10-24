// 랜딩: 첫 화면 → 한눈에 보기 → About → 대표 작업(WORK) → 실측 로그(LOG) → 그 외 작업(SIDE) → 마무리·연락처.
// 1층 카드는 30초 안에 훑히게, 자세한 내용은 상세(2층)로 보낸다. 디자인 시스템(헤어라인·모노 라벨)은 유지.
import { motion } from 'framer-motion'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import About from '../components/about/About'
import Finale from '../components/finale/Finale'
import Hero from '../components/hero/Hero'
import Label, { labelEnClass as labelEn } from '../components/Label'
import RichText from '../components/RichText'
import FlipTitle, { type FlipTitleHandle } from '../components/transition/FlipTitle'
import { MAIN_PROJECTS, SIDE_PROJECTS, projectByKey, type Project } from '../data/projects'
import { SIDE_WORKS, type SideWork, type SideWorkImage, type SideWorkVideo } from '../data/sideWorks'
import { PROJECT_RECORDS, VELOG_PROFILE, VELOG_URL, WRITING_SERIES, latestPost, type WritingSeries } from '../data/writing'
import { scrollToId } from '../lib/lenis'
import { onImgError } from '../lib/placeholder'
import { crossfadeToRoom, enterRoom } from '../lib/signature'

const sectionPad = { paddingBlock: 'clamp(88px, 11vw, 164px)' }

export default function Landing() {
  return (
    <>
      <BottomNav />
      <main>
        <Hero />
        <Glance />
        <About />
        <SelectedProjects />
        <Writing />
        <SideWorks />
        <Finale />
      </main>
    </>
  )
}

const NAV_SECTIONS = [
  { id: 'glance', label: 'SUMMARY' },
  { id: 'about', label: 'ABOUT' },
  { id: 'selected', label: 'WORK' },
  { id: 'writing', label: 'LOG' },
  { id: 'side', label: 'SIDE' },
  { id: 'contact', label: 'CONTACT' },
] as const

function BottomNav() {
  const [active, setActive] = useState('')
  const [shown, setShown] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const update = () => {
      setShown(window.scrollY > 80)
      const mid = window.innerHeight * 0.55
      let cur = ''
      for (const { id } of NAV_SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < mid) cur = id
      }
      setActive(cur)
      const footer = document.querySelector('footer')
      setDark(!!footer && footer.getBoundingClientRect().top < window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <nav
      aria-label="섹션 내비게이션"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 select-none max-w-[calc(100vw-24px)]"
      style={{ opacity: shown ? 1 : 0, pointerEvents: shown ? 'auto' : 'none', transition: 'opacity 0.5s' }}
    >
      <div
        className="flex items-center rounded-full px-4 sm:px-5 py-[9px] overflow-x-auto no-scrollbar"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: dark ? 'rgba(10,10,10,0.6)' : 'rgba(255,255,255,0.8)',
          border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(16,26,44,0.09)',
          boxShadow: dark ? '0 4px 28px rgba(0,0,0,0.45)' : '0 4px 28px rgba(16,26,44,0.07), inset 0 1px 0 rgba(255,255,255,0.85)',
          transition: 'background 0.5s, border-color 0.5s, box-shadow 0.5s',
        }}
      >
        {NAV_SECTIONS.map(({ id, label }, i) => {
          const isActive = active === id
          return (
            <Fragment key={id}>
              {i > 0 && (
                <span aria-hidden className="mx-2 sm:mx-3 text-[11px] leading-none" style={{ color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(16,26,44,0.25)' }}>
                  ·
                </span>
              )}
              <button
                type="button"
                onClick={() => scrollToId(id)}
                className="font-body text-[10px] tracking-[0.14em] uppercase whitespace-nowrap"
                aria-current={isActive ? 'true' : undefined}
                style={{
                  color: isActive ? (dark ? 'rgba(255,255,255,0.95)' : 'var(--color-ink)') : dark ? 'rgba(255,255,255,0.6)' : 'rgba(16,26,44,0.62)',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'color 0.3s',
                }}
              >
                {label}
              </button>
            </Fragment>
          )
        })}
      </div>
    </nav>
  )
}

/* ── 한눈에 보기: 메인 3개를 같은 크기 카드 3칸으로 ── */
function Glance() {
  const navigate = useNavigate()
  return (
    <section id="glance" aria-label="한눈에 보기" className="relative border-t border-line bg-soft/60">
      <div className="mx-auto max-w-[1200px] container-pad" style={{ paddingBlock: 'clamp(64px, 8vw, 112px)' }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Label as="p">Summary</Label>
            <h2 className="font-body font-bold text-ink mt-3 leading-[1.3] tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
              한눈에 보기
            </h2>
          </div>
          <p className="font-body text-text-sub text-[14px] leading-[1.6] max-w-[44ch] break-keep">
            세 작업의 역할, 대표 숫자, 맞닿은 직무입니다. 카드를 누르면 상세로 갑니다.
          </p>
        </div>
        <ul className="mt-9 grid gap-4 md:grid-cols-3">
          {MAIN_PROJECTS.map((p, i) => (
            <motion.li
              key={p.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => void crossfadeToRoom(p, navigate)}
                className="group flex h-full w-full flex-col text-left bg-panel p-5 sm:p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5"
                style={{ borderRadius: 'var(--frame-radius)', border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-soft)' }}
              >
                <OwnershipTags project={p} />
                <span className="block font-body font-bold text-ink text-[20px] leading-[1.3] mt-4 tracking-[-0.02em]">{p.name}</span>
                <span className="block font-body text-text-sub text-[13px] leading-[1.5] mt-1">{p.fullName}</span>
                <span className="block border-t border-line mt-5 pt-4">
                  <span className="block font-mono font-semibold text-navy text-[22px] leading-[1.2] tabular-nums tracking-[-0.02em]">{p.glance.metric}</span>
                  <span className="block font-body text-text-muted text-[12px] leading-[1.5] mt-1.5">{p.glance.metricCond}</span>
                </span>
                <span className="block font-body text-text-sub text-[14px] leading-[1.7] mt-4 break-keep flex-1">{p.glance.verb}</span>
                <span className="mt-5 flex flex-wrap items-center gap-1.5">
                  <span className="font-body text-[11.5px] text-text-muted mr-1">맞닿은 직무</span>
                  {p.glance.jobTags.map((t) => (
                    <span key={t} className="font-body font-semibold text-[11.5px] text-signal-deep px-2 py-1 rounded-full" style={{ background: 'var(--color-signal-soft)' }}>
                      {t}
                    </span>
                  ))}
                  <span aria-hidden className="ml-auto text-navy transition-transform group-hover:translate-x-1">→</span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function OwnershipTags({ project: p, onDark = false }: { project: Project; onDark?: boolean }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span
        className="font-body font-bold text-[11.5px] leading-none px-2 py-1.5 rounded-full"
        style={
          p.ownership === '주도'
            ? { background: 'var(--color-navy)', color: '#fff' }
            : { border: '1.5px solid var(--color-signal)', color: 'var(--color-signal)', padding: '4.5px 7px' }
        }
      >
        {p.ownership}
      </span>
      <span className={`font-body text-[12px] leading-none ${onDark ? 'text-white/70' : 'text-text-sub'}`}>{p.kind}</span>
      <span aria-hidden className="text-line-strong">·</span>
      <span className="font-mono text-[11.5px] leading-none text-text-muted">{p.period}</span>
    </span>
  )
}

/* ── 대표 작업 ── */
function SelectedProjects() {
  return (
    <section id="selected" className="border-t border-line" aria-label="대표 작업">
      <div className="mx-auto max-w-[1200px] container-pad pt-16 sm:pt-20">
        <Label as="p">Work</Label>
        <h2 className="font-body font-bold text-ink mt-3 tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
          대표 작업
        </h2>
      </div>
      {MAIN_PROJECTS.map((p, i) => (
        <SelectedBlock key={p.key} project={p} index={i} />
      ))}
    </section>
  )
}

function SelectedBlock({ project: p, index }: { project: Project; index: number }) {
  const navigate = useNavigate()
  const flipRef = useRef<FlipTitleHandle>(null)
  const visualLeft = index % 2 === 1

  const enter = (fromLetter: number) => {
    void enterRoom({ project: p, navigate, fromLetter, playFlip: (from) => flipRef.current?.play(from) })
  }

  const rows: [string, string][] = [
    ['대표 결과', p.result],
    ['내 역할', p.role],
    ...(p.decision ? ([['핵심 결정', p.decision]] as [string, string][]) : []),
  ]

  return (
    <article id={p.anchorId} className="relative overflow-hidden scroll-mt-16" style={{ background: index % 2 === 0 ? 'transparent' : p.tintSoft }}>
      <div className="mx-auto max-w-[1200px] container-pad grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start" style={{ paddingBlock: 'clamp(64px, 8vw, 120px)' }}>
        <motion.div
          className={visualLeft ? 'lg:order-2' : 'lg:order-1'}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={labelEn}>
            {p.room} <span className="text-line-strong">/</span> 03
          </p>
          <div className="mt-3">
            <OwnershipTags project={p} />
          </div>
          <div className="mt-4">
            <FlipTitle ref={flipRef} name={p.name} ink={p.ink} onActivate={enter} />
          </div>
          <p className="font-body font-semibold text-text-sub text-[16px] leading-[1.5] mt-2 break-keep">{p.fullName}</p>
          <p className="font-body text-ink text-[15.5px] leading-[1.75] mt-5 max-w-[60ch] break-keep">
            <RichText text={p.oneLine} lines={false} />
          </p>

          <dl className="mt-6 border-t border-line">
            {rows.map(([k, v]) => (
              <div key={k} className="border-b border-line py-3.5 grid gap-1.5 sm:grid-cols-[84px_minmax(0,1fr)] sm:gap-4">
                <dt className="font-body font-semibold text-[12.5px] text-navy pt-[3px]">{k}</dt>
                <dd className="m-0 font-body text-text-sub text-[14.5px] leading-[1.72] break-keep">
                  <RichText text={v} lines={false} />
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${p.name} 기술`}>
            {p.tech.map((t) => (
              <li key={t} className="font-mono text-[11.5px] leading-none px-2 py-1.5 border border-line bg-white/60 text-text-sub" style={{ borderRadius: 6 }}>
                {t}
              </li>
            ))}
          </ul>

          <button type="button" onClick={() => enter(0)} className="font-body font-semibold text-[14.5px] tracking-[0.02em] mt-8 inline-flex items-baseline gap-[0.3em] text-signal hover:text-ink transition-colors">
            상세 보기: 결과 표 · 설계 결정 · 검증 · AI 위임 <span aria-hidden>→</span>
          </button>
        </motion.div>

        <motion.div
          className={`${visualLeft ? 'lg:order-1' : 'lg:order-2'} lg:sticky lg:top-10`}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <figure>
            <button
              type="button"
              onClick={() => enter(0)}
              className="group block w-full bg-panel overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
              style={{ borderRadius: 'var(--frame-radius)', border: 'var(--frame-border)', boxShadow: 'var(--shadow-frame)' }}
              aria-label={`${p.name} 상세 보기`}
            >
              <span className="block p-2.5 md:p-3">
                <img
                  src={p.previewImage.src}
                  alt={p.previewImage.alt}
                  onError={onImgError}
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-auto"
                  style={{ borderRadius: 'calc(var(--frame-radius) - 6px)' }}
                />
              </span>
            </button>
            <figcaption className="font-body text-text-sub text-[13px] leading-[1.6] mt-3 px-1 break-keep">{p.previewImage.caption}</figcaption>
          </figure>
        </motion.div>
      </div>
    </article>
  )
}

/* ── 실측 로그(velog) ── */
function Writing() {
  const navigate = useNavigate()
  return (
    <section id="writing" aria-label="실측 로그" className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={sectionPad}>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <Label as="p">Log</Label>
            <h2 className="font-body font-bold text-ink mt-3 leading-[1.35] break-keep tracking-[-0.03em]" style={{ fontSize: 'clamp(22px,3vw,34px)' }}>
              결과가 아니라 과정을 남긴 기록
            </h2>
            <p className="font-body text-text-sub text-[15.5px] leading-[1.75] mt-5 max-w-[66ch] break-keep">
              실험과 설계 판단을 그날그날 velog에 남겼습니다. 성공한 결과만이 아니라 틀린 판단과 철회한 결론도 함께 씁니다. 상세 페이지의 결정과 검증 블록에 붙은 「당시 기록」이 이 글들입니다.
            </p>
          </div>
          <aside className="border-t border-line pt-5">
            <p className={`${labelEn} font-mono`}>Velog</p>
            <p className="font-body font-bold text-ink text-[20px] leading-[1.35] mt-3">
              {VELOG_PROFILE.displayName} · <span className="font-mono text-[17px]">{VELOG_PROFILE.handle}</span>
            </p>
            <p className="font-body text-text-sub text-[14px] leading-[1.65] mt-2">{VELOG_PROFILE.bio}</p>
            <a href={VELOG_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 font-body font-semibold text-[14px] text-signal hover:text-ink transition-colors">
              전체 글 보기 <span aria-hidden>↗</span>
            </a>
          </aside>
        </div>

        {/* 프로젝트별 당시 기록 */}
        <section aria-label="프로젝트별 당시 기록" className="mt-14">
          <h3 className="font-body font-bold text-ink text-[17px]">프로젝트별 당시 기록</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {PROJECT_RECORDS.map((r) => (
              <div key={r.project} className="bg-panel px-5 py-5" style={{ borderRadius: 'var(--frame-radius)', border: 'var(--frame-border)' }}>
                <button
                  type="button"
                  onClick={() => void crossfadeToRoom(projectByKey(r.project), navigate)}
                  className="font-body font-bold text-navy text-[15px] hover:text-signal transition-colors inline-flex items-center gap-1"
                >
                  {r.label} <span aria-hidden>→</span>
                </button>
                <ul className="mt-3">
                  {r.posts.map((post) => (
                    <li key={post.href} className="border-t border-line">
                      <a href={post.href} target="_blank" rel="noreferrer" className="group grid grid-cols-[82px_minmax(0,1fr)] gap-3 py-2.5">
                        <time className="font-mono text-[11.5px] text-text-muted tabular-nums pt-[2px]">{post.date}</time>
                        <span className="font-body text-[13.5px] leading-[1.55] text-ink group-hover:underline underline-offset-4 break-keep">{post.what}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="시리즈" className="mt-14 grid gap-12">
          {WRITING_SERIES.map((s, i) => (
            <SeriesBlock key={s.name} series={s} index={i} />
          ))}
        </section>
      </div>
    </section>
  )
}

function SeriesBlock({ series: s, index }: { series: WritingSeries; index: number }) {
  const latest = latestPost(s.name)
  return (
    <motion.section
      aria-label={`${s.name} 시리즈`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="border-t-2 pt-5"
      style={{ borderColor: 'var(--color-navy)' }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <div className="flex items-baseline gap-x-3 flex-wrap">
          <span className="font-mono text-[11.5px] tracking-[0.08em] text-signal">{s.axis}</span>
          <h3 className="font-body font-bold text-ink text-[19px] leading-tight">{s.name}</h3>
          <span className="font-mono text-[12px] text-text-muted">{s.count}</span>
        </div>
        <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 font-body font-semibold text-[13px] text-signal">
          <span className="min-w-0 break-keep">전체 {s.count} 보기</span>
          <span aria-hidden className="shrink-0 transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
      <p className="font-body text-text-sub text-[14px] leading-[1.65] mt-2.5 max-w-[70ch] break-keep">{s.blurb}</p>
      {latest && (
        <a href={latest.href} target="_blank" rel="noreferrer" className="group mt-3 inline-flex flex-wrap items-baseline gap-x-2 font-body text-[13px]">
          <span className="font-semibold text-signal">최근 글</span>
          <time className="font-mono text-[11.5px] text-text-muted">{latest.date}</time>
          <span className="text-ink group-hover:underline underline-offset-4 break-keep">{latest.title}</span>
        </a>
      )}

      <ul className="mt-5 border-t border-line">
        {s.posts.map((p) => (
          <li key={p.href} className="border-b border-line">
            <a href={p.href} target="_blank" rel="noreferrer" className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-4 sm:grid-cols-[92px_1fr_auto] sm:gap-x-6">
              <time className="hidden pt-0.5 font-mono text-[12.5px] tabular-nums text-text-muted sm:block">{p.date}</time>
              <div className="min-w-0">
                <p className="font-body font-semibold text-ink text-[15.5px] leading-[1.45] break-keep group-hover:underline underline-offset-4 decoration-1">{p.title}</p>
                <p className="font-body text-text-sub text-[13.5px] leading-[1.6] mt-1 break-keep">{p.note}</p>
                <time className="mt-1.5 block font-mono text-[11.5px] text-text-muted sm:hidden">{p.date}</time>
              </div>
              <span aria-hidden className="shrink-0 justify-self-end pt-0.5 text-text-muted transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

/* ── 그 외 작업: decisions-rag · EEG · PICKL ── */
function SideWorks() {
  const navigate = useNavigate()
  const pickl = SIDE_WORKS[0]
  return (
    <section id="side" aria-label="그 외 작업" className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={sectionPad}>
        <Label as="p">Side Work</Label>
        <h2 className="font-body font-bold text-ink mt-3 tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
          그 외 작업
        </h2>
        <p className="font-body text-text-sub text-[15px] leading-[1.75] mt-4 max-w-[66ch] break-keep">
          대표 작업을 받치는 개발 도구, 학회 논문으로 낸 공동 연구, 팀 해커톤입니다.
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {SIDE_PROJECTS.map((p) => (
            <li key={p.key} id={p.anchorId} className="scroll-mt-16">
              <SideCard
                project={p}
                metric={p.glance.metric}
                cond={p.glance.metricCond}
                body={p.glance.verb}
                cta="상세 보기"
                onOpen={() => void crossfadeToRoom(p, navigate)}
              />
            </li>
          ))}
          {pickl && (
            <li>
              <SideCard
                title="PICKL"
                tags={['참여', '5인 팀 프론트엔드', '2025']}
                fullName="전통시장 식재료 큐레이션 서비스 · 해커톤"
                metric="거리 → 이동 시간"
                cond="지도 표시 방식 제안, 기획 담당이 반영"
                body="지도·검색·포인트 전환·마이페이지 화면을 구현했고, 직선거리를 걷기·차량 이동 시간으로 바꿔 보여 주는 방법을 제안했습니다."
                cta="아래에서 보기"
                onOpen={() => scrollToId('side-pickl')}
              />
            </li>
          )}
        </ul>

        {pickl && (
          <div id="side-pickl" className="mt-20 scroll-mt-16">
            <SideWorkItem work={pickl} />
          </div>
        )}
      </div>
    </section>
  )
}

function SideCard(props: {
  project?: Project
  title?: string
  tags?: string[]
  fullName?: string
  metric: string
  cond: string
  body: string
  cta: string
  onOpen: () => void
}) {
  const p = props.project
  return (
    <button
      type="button"
      onClick={props.onOpen}
      className="group flex h-full w-full flex-col text-left bg-panel p-5 transition-transform duration-300 hover:-translate-y-0.5"
      style={{ borderRadius: 'var(--frame-radius)', border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-soft)' }}
    >
      {p ? (
        <OwnershipTags project={p} />
      ) : (
        <span className="flex flex-wrap items-center gap-1.5">
          {props.tags?.map((t, i) =>
            i === 0 ? (
              <span key={t} className="font-body font-bold text-[11.5px] leading-none rounded-full text-signal" style={{ border: '1.5px solid var(--color-signal)', padding: '4.5px 7px' }}>
                {t}
              </span>
            ) : (
              <span key={t} className="font-body text-[12px] leading-none text-text-sub">
                {t}
              </span>
            ),
          )}
        </span>
      )}
      <span className="block font-body font-bold text-ink text-[18px] leading-[1.3] mt-4">{p?.name ?? props.title}</span>
      <span className="block font-body text-text-sub text-[13px] leading-[1.5] mt-1">{p?.fullName ?? props.fullName}</span>
      <span className="block border-t border-line mt-4 pt-3.5">
        <span className="block font-mono font-semibold text-navy text-[17px] leading-[1.25] tabular-nums">{props.metric}</span>
        <span className="block font-body text-text-muted text-[12px] leading-[1.5] mt-1">{props.cond}</span>
      </span>
      <span className="block font-body text-text-sub text-[13.5px] leading-[1.7] mt-3.5 break-keep flex-1">{props.body}</span>
      <span className="mt-4 inline-flex items-center gap-1 font-body font-semibold text-[13px] text-signal">
        {props.cta} <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </button>
  )
}

function SideWorkItem({ work }: { work: SideWork }) {
  return (
    <article className="border-t border-line pt-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
        <div className="min-w-0">
          <p className={`${labelEn} font-mono`}>{work.eyebrow}</p>
          <h3 className="font-display font-semibold text-ink text-[44px] leading-[0.95] mt-3 sm:text-[60px]">{work.title}</h3>
          {work.period && <p className="font-body text-text-sub text-[13px] leading-[1.55] mt-4">{work.period}</p>}
          <p className="font-body text-text-sub text-[16px] leading-[1.75] mt-5 max-w-[58ch] break-keep">{work.oneLine}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${work.title} 핵심 키워드`}>
            {work.chips.map((chip) => (
              <li key={chip} className="font-mono text-[12px] leading-none px-2.5 py-2 border border-line bg-white/45 text-text-sub" style={{ borderRadius: 999 }}>
                {chip}
              </li>
            ))}
          </ul>
          <dl className="mt-6">
            <SideDetailRow label="Question" body={work.question} />
            <SideDetailRow label="Approach" body={work.approach} />
            <SideDetailRow label="Process" body={work.process} />
            <SideDetailRow label="Output" body={work.output} />
            <SideDetailRow label="Learning" body={work.learning} />
          </dl>
        </div>
        <div className="min-w-0 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          {work.demoVideo && <SideDemoVideo video={work.demoVideo} />}
          <div className="grid grid-cols-2 gap-3">
            {work.supportingImages.map((image) => (
              <SideImageFrame key={image.src} image={image} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function SideDetailRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="border-t border-line py-4 grid gap-2 sm:grid-cols-[112px_minmax(0,1fr)]">
      <dt className={`${labelEn} font-mono`}>{label}</dt>
      <dd className="font-body text-text-sub text-[14.5px] leading-[1.7] m-0 break-keep">
        <RichText text={body} terms={false} />
      </dd>
    </div>
  )
}

function SideImageFrame({ image }: { image: SideWorkImage }) {
  return (
    <figure>
      <div className="bg-panel overflow-hidden" style={{ borderRadius: 'var(--frame-radius)', border: 'var(--frame-border)', boxShadow: 'var(--shadow-soft)' }}>
        <div className="p-[2px]">
          <img
            src={image.src}
            alt={image.alt}
            onError={onImgError}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto object-contain"
            style={{ maxHeight: 400, borderRadius: 'calc(var(--frame-radius) - 4px)' }}
          />
        </div>
      </div>
      <figcaption className="font-body text-text-sub text-[12.5px] leading-[1.5] mt-2.5 px-1 text-center">{image.caption}</figcaption>
    </figure>
  )
}

// 세로(9:16) 데모 영상. 처음엔 사이트 안 썸네일 + 재생 버튼, 누를 때만 iframe을 넣는다(외부 이미지 서버에 기대지 않음).
function SideDemoVideo({ video }: { video: SideWorkVideo }) {
  const [active, setActive] = useState(false)
  return (
    <figure>
      <div className="mx-auto w-full" style={{ maxWidth: 300 }}>
        <div
          className="relative overflow-hidden bg-panel"
          style={{ aspectRatio: '9 / 16', borderRadius: 'var(--frame-radius)', border: 'var(--frame-border)', boxShadow: 'var(--shadow-frame)' }}
        >
          {active ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
            />
          ) : (
            <button type="button" onClick={() => setActive(true)} aria-label={`${video.title} 재생`} className="group absolute inset-0 h-full w-full cursor-pointer">
              <img src={video.thumb} alt="" onError={onImgError} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
              <span aria-hidden className="absolute inset-0 bg-ink/15 transition-colors duration-300 group-hover:bg-ink/[0.04]" />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105"
                style={{ background: 'var(--color-signal)', boxShadow: '0 6px 20px rgba(14,124,134,0.42)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
      <figcaption className="font-body text-text-sub text-[12.5px] leading-[1.5] mt-2.5 px-1 text-center max-w-[300px] mx-auto break-keep">
        {video.caption}
        {video.href && (
          <>
            {' '}
            <a href={video.href} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap underline underline-offset-2 hover:text-ink transition-colors">
              YouTube에서 보기 ↗
            </a>
          </>
        )}
      </figcaption>
    </figure>
  )
}
