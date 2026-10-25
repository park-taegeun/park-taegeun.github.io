// 「프로젝트」 탭. 왼쪽 목록(대표 3 · 그 외 3)에서 고르면 오른쪽 패널에 한눈에 보는 요약이 뜬다.
// 데스크톱: 세로 목록(스크롤 따라옴) + 패널. 모바일: 가로로 넘기는 탭 + 패널.
// 상세 페이지에서 「목록으로」 돌아오거나 이력 링크를 누르면 scrollToId(항목 id)가 이 탭을 연다.
import { AnimatePresence, motion } from 'framer-motion'
import { useLayoutEffect, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectByKey } from '../../data/projects'
import { SHOWCASE, SHOWCASE_GROUPS, type ShowcaseItem } from '../../data/showcase'
import { SIDE_WORKS } from '../../data/sideWorks'
import { ANCHOR_EVENT, type AnchorRequest } from '../../lib/lenis'
import { onImgError } from '../../lib/placeholder'
import { crossfadeToRoom } from '../../lib/signature'
import Label from '../Label'
import Marked from '../Mark'

const SECTION_ID = 'projects'

export default function ProjectsShowcase() {
  const [activeId, setActiveId] = useState(SHOWCASE[0].id)
  const active = SHOWCASE.find((s) => s.id === activeId) ?? SHOWCASE[0]

  // 다른 곳에서 항목 id로 스크롤을 요청하면 그 탭을 열고 섹션 시작점으로 보낸다.
  // useLayoutEffect: 상세 → 목록 복귀 직후(첫 페인트 전)에도 요청을 받을 수 있게.
  useLayoutEffect(() => {
    const onAnchor = (e: Event) => {
      const req = (e as CustomEvent<AnchorRequest>).detail
      if (!SHOWCASE.some((s) => s.id === req.id)) return
      setActiveId(req.id)
      req.redirect = SECTION_ID
    }
    window.addEventListener(ANCHOR_EVENT, onAnchor)
    return () => window.removeEventListener(ANCHOR_EVENT, onAnchor)
  }, [])

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const i = SHOWCASE.findIndex((s) => s.id === activeId)
    const last = SHOWCASE.length - 1
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? last : e.key === 'ArrowDown' || e.key === 'ArrowRight' ? Math.min(last, i + 1) : Math.max(0, i - 1)
    const id = SHOWCASE[next].id
    setActiveId(id)
    // 화면에 보이는 쪽(모바일 가로 탭 / 데스크톱 목록) 버튼으로 포커스를 옮긴다
    const btns = document.querySelectorAll<HTMLButtonElement>(`[data-tab-id="${id}"]`)
    Array.from(btns).find((b) => b.offsetParent !== null)?.focus()
  }

  return (
    <section id={SECTION_ID} aria-label="프로젝트" className="relative border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={{ paddingBlock: 'clamp(48px, 5.5vw, 80px)' }}>
        <Label as="p">Projects</Label>
        <h2 className="font-body font-bold text-ink mt-3 tracking-[-0.03em] flex items-center gap-3" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
          프로젝트
          <span className="font-mono font-semibold text-[13px] text-text-sub border border-line bg-panel rounded-full w-8 h-8 inline-flex items-center justify-center">{SHOWCASE.length}</span>
        </h2>

        <div className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-6 lg:gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          {/* 목록 */}
          <div role="tablist" aria-label="프로젝트 목록" aria-orientation="vertical" className="min-w-0 lg:sticky lg:top-24">
            {/* 모바일: 가로 탭 */}
            <div className="lg:hidden -mx-[var(--section-padding-x)] px-[var(--section-padding-x)] flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {SHOWCASE.map((s, i) => (
                <TabButton key={s.id} item={s} index={i} active={s.id === activeId} compact onSelect={setActiveId} onKey={onKey} />
              ))}
            </div>
            {/* 데스크톱: 묶음별 세로 목록 */}
            <div className="hidden lg:block">
              {SHOWCASE_GROUPS.map((g) => {
                const items = SHOWCASE.filter((s) => s.group === g)
                return (
                  <div key={g} className="mb-7 last:mb-0">
                    <p className="flex items-center gap-2 font-body font-bold text-[13.5px] text-ink pb-2.5 border-b border-line">
                      {g}
                      <span className="font-mono text-[11px] text-text-sub border border-line rounded-full w-5 h-5 inline-flex items-center justify-center">{items.length}</span>
                    </p>
                    <div className="mt-2.5 grid gap-2">
                      {items.map((s) => (
                        <TabButton
                          key={s.id}
                          item={s}
                          index={SHOWCASE.indexOf(s)}
                          active={s.id === activeId}
                          onSelect={setActiveId}
                          onKey={onKey}
                          withId
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 패널 */}
          <div role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`} className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <Panel item={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function TabButton(props: {
  item: ShowcaseItem
  index: number
  active: boolean
  compact?: boolean
  withId?: boolean
  onSelect: (id: string) => void
  onKey: (e: KeyboardEvent<HTMLButtonElement>) => void
}) {
  const { item: s, index, active, compact } = props
  const num = String(index + 1).padStart(2, '0')
  return (
    <button
      type="button"
      role="tab"
      // 데스크톱 목록의 버튼만 앵커 id를 가진다(모바일 탭과 id 중복 방지)
      id={props.withId ? s.id : undefined}
      aria-selected={active}
      aria-controls={`panel-${s.id}`}
      tabIndex={active ? 0 : -1}
      data-tab-id={s.id}
      onClick={() => props.onSelect(s.id)}
      onKeyDown={props.onKey}
      className={`group text-left transition-colors duration-200 ${
        compact
          ? `shrink-0 rounded-full px-4 py-2.5 font-body font-semibold text-[13.5px] whitespace-nowrap border ${active ? 'bg-navy text-white border-navy' : 'bg-panel text-ink border-line'}`
          : `w-full rounded-[14px] px-3.5 py-3 flex items-center gap-3 border ${active ? 'bg-navy border-navy' : 'bg-panel border-line hover:border-line-strong'}`
      }`}
      style={!compact && !active ? { boxShadow: 'var(--shadow-soft)' } : undefined}
    >
      {compact ? (
        s.name
      ) : (
        <>
          <span
            aria-hidden
            className={`shrink-0 w-10 h-10 rounded-[10px] inline-flex items-center justify-center font-mono font-semibold text-[13px] ${active ? 'bg-white/12 text-white' : 'bg-soft text-navy'}`}
          >
            {num}
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block font-body font-bold text-[15px] leading-[1.3] truncate ${active ? 'text-white' : 'text-ink'}`}>{s.name}</span>
            <span className={`block font-body text-[12.5px] leading-[1.4] mt-0.5 truncate ${active ? 'text-white/70' : 'text-text-sub'}`}>{s.listMeta}</span>
          </span>
          <span aria-hidden className={`shrink-0 text-[15px] transition-transform ${active ? 'text-white translate-x-0.5' : 'text-text-sub group-hover:translate-x-0.5'}`}>
            ›
          </span>
        </>
      )}
    </button>
  )
}

function Panel({ item: s }: { item: ShowcaseItem }) {
  const navigate = useNavigate()
  const open = s.project ? () => void crossfadeToRoom(projectByKey(s.project!), navigate) : undefined

  return (
    <article className="bg-panel overflow-hidden" style={{ borderRadius: 18, border: 'var(--frame-border)', boxShadow: 'var(--shadow-frame)' }}>
      {/* 그림 */}
      <div className="bg-soft/70 border-b border-line px-4 py-4 sm:px-6">
        {s.media.kind === 'image' ? (
          <figure>
            <button
              type="button"
              onClick={open}
              aria-label={`${s.name} 상세 보기`}
              className="block w-full cursor-pointer"
              tabIndex={open ? 0 : -1}
            >
              <img
                src={s.media.src}
                alt={s.media.alt}
                onError={onImgError}
                loading="lazy"
                decoding="async"
                className="block mx-auto max-w-full w-auto h-auto max-h-[270px] bg-white"
                style={{ borderRadius: 10, border: '1px solid var(--color-line)' }}
              />
            </button>
            <figcaption className="font-body text-text-sub text-[12.5px] leading-[1.5] mt-2.5 text-center break-keep">{s.media.caption}</figcaption>
          </figure>
        ) : (
          <PicklPhones caption={s.media.caption} />
        )}
      </div>

      <div className="px-5 py-6 sm:px-8 sm:py-7">
        {/* 칩 */}
        <ul className="flex flex-wrap items-center gap-1.5" aria-label={`${s.name} 구분`}>
          <li
            className="font-body font-bold text-[12px] leading-none rounded-full"
            style={
              s.ownership === '주도'
                ? { background: 'var(--color-navy)', color: '#fff', padding: '7px 10px' }
                : { border: '1.5px solid var(--color-signal)', color: 'var(--color-signal-deep)', padding: '5.5px 9px' }
            }
          >
            {s.ownership}
          </li>
          {s.chips.map((c) => (
            <li key={c} className="font-body text-[12px] leading-none text-text-sub border border-line rounded-full" style={{ padding: '6px 10px' }}>
              {c}
            </li>
          ))}
        </ul>

        <h3 className="font-body font-bold text-ink mt-4 tracking-[-0.03em] leading-[1.2]" style={{ fontSize: 'clamp(24px, 2.6vw, 32px)' }}>
          {s.name}
        </h3>

        <div className="mt-3.5 flex items-start gap-2.5">
          <span className="shrink-0 font-body font-bold text-[11.5px] leading-none text-white bg-ink rounded-full px-2.5 py-[6px] mt-[1px]">맡은 일</span>
          <p className="font-body text-text-sub text-[14px] leading-[1.6] break-keep">{s.role}</p>
        </div>

        <p className="font-body font-semibold text-ink text-[16.5px] leading-[1.6] mt-4 break-keep">
          <Marked text={s.summary} mark={s.summaryMark} />
        </p>

        <dl className="mt-6 border-t border-line">
          <Row label="배경">
            <ul className="grid gap-1.5">
              {s.background.map((b) => (
                <Bullet key={b}>{b}</Bullet>
              ))}
            </ul>
          </Row>
          <Row label="진행">
            <ol className={`grid gap-2 ${s.steps.length === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
              {s.steps.map((st, i) => (
                <li key={st} className="flex items-start gap-2.5 border border-line bg-base rounded-[10px] px-3 py-2.5">
                  <span className="shrink-0 w-5 h-5 mt-[1px] rounded-full bg-navy text-white inline-flex items-center justify-center font-mono text-[10.5px] font-semibold">{i + 1}</span>
                  <span className="font-body text-[13.5px] leading-[1.5] text-ink break-keep">{st}</span>
                </li>
              ))}
            </ol>
          </Row>
          <Row label="결과" dark>
            <ul className="grid gap-1.5">
              {s.results.map((r) => (
                <Bullet key={r.text} strong={!!r.mark}>
                  <Marked text={r.text} mark={r.mark} strong />
                </Bullet>
              ))}
            </ul>
          </Row>
        </dl>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${s.name} 기술`}>
          {s.tech.map((t) => (
            <li key={t} className="font-mono text-[11.5px] leading-none px-2 py-1.5 border border-line bg-base text-text-sub" style={{ borderRadius: 6 }}>
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-7">
          {open ? (
            <button
              type="button"
              onClick={open}
              className="group inline-flex items-center gap-2 rounded-full bg-ink text-white font-body font-semibold text-[14px] px-5 py-3 hover:bg-navy transition-colors"
            >
              자세히 보기
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          ) : (
            s.external && (
              <a
                href={s.external.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-ink text-white font-body font-semibold text-[14px] px-5 py-3 hover:bg-navy transition-colors"
              >
                {s.external.label}
                <span aria-hidden>↗</span>
              </a>
            )
          )}
        </div>
      </div>
    </article>
  )
}

function Row({ label, dark = false, children }: { label: string; dark?: boolean; children: ReactNode }) {
  return (
    <div className="border-b border-line py-4 grid gap-2.5 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-4">
      <dt>
        <span
          className={`inline-block font-body font-bold text-[12px] leading-none rounded-[6px] px-2 py-[6px] ${dark ? 'bg-ink text-white' : 'bg-soft text-ink border border-line'}`}
        >
          {label}
        </span>
      </dt>
      <dd className="m-0 min-w-0">{children}</dd>
    </div>
  )
}

function Bullet({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return (
    <li className={`relative pl-3.5 font-body text-[14.5px] leading-[1.6] break-keep ${strong ? 'font-semibold text-ink' : 'text-text-sub'}`}>
      <span aria-hidden className="absolute left-0 top-[0.62em] w-[5px] h-[5px] rounded-full bg-line-strong" />
      {children}
    </li>
  )
}

// PICKL: 세로 화면 3장(첫 장은 데모 영상, 누를 때만 YouTube를 불러온다)
function PicklPhones({ caption }: { caption: string }) {
  const work = SIDE_WORKS[0]
  const [playing, setPlaying] = useState(false)
  if (!work) return null
  const video = work.demoVideo
  const shots = work.supportingImages
  const frame = { borderRadius: 14, border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-soft)' }
  return (
    <figure>
      <div className="mx-auto grid grid-cols-3 gap-3 max-w-[420px]">
        {video && (
          <div className="relative overflow-hidden bg-panel" style={{ aspectRatio: '9 / 16', ...frame }}>
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
              />
            ) : (
              <button type="button" onClick={() => setPlaying(true)} aria-label={`${video.title} 재생`} className="group absolute inset-0 h-full w-full cursor-pointer">
                <img src={video.thumb} alt="" onError={onImgError} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
                <span aria-hidden className="absolute inset-0 bg-ink/15 transition-colors group-hover:bg-ink/[0.04]" />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-transform group-hover:scale-105"
                  style={{ background: 'var(--color-signal)', boxShadow: '0 6px 20px rgba(14,124,134,0.42)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        )}
        {shots.map((img) => (
          <div key={img.src} className="overflow-hidden bg-panel" style={{ aspectRatio: '9 / 16', ...frame }}>
            <img src={img.src} alt={img.alt} onError={onImgError} loading="lazy" decoding="async" className="block h-full w-full object-cover object-top" />
          </div>
        ))}
      </div>
      <figcaption className="font-body text-text-sub text-[12.5px] leading-[1.5] mt-2.5 text-center break-keep">{caption}</figcaption>
    </figure>
  )
}
