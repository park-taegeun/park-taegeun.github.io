// 「프로젝트」 탭. 왼쪽 목록(대표 3 · 그 외 3)에서 고르면 오른쪽 패널에 한눈에 보는 요약이 뜬다.
// 데스크톱: 세로 목록(스크롤 따라옴) + 패널. 활성 항목은 흰 바탕과 왼쪽 막대로 패널과 이어 보이게 한다.
// 모바일: 가로로 넘기는 탭 + 패널.
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
      <div className="mx-auto max-w-[1200px] container-pad" style={{ paddingBlock: 'clamp(56px, 6vw, 88px)' }}>
        <Label as="p">Projects</Label>
        <h2 className="mt-3 flex items-baseline gap-2.5 font-body font-bold text-ink tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
          프로젝트
          <span className="num font-semibold text-[17px] text-text-sub">{SHOWCASE.length}</span>
        </h2>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[264px_minmax(0,1fr)] lg:items-start lg:gap-8">
          {/* 목록 */}
          <div role="tablist" aria-label="프로젝트 목록" aria-orientation="vertical" className="min-w-0 lg:sticky lg:top-24">
            {/* 모바일: 가로 탭 */}
            <div className="-mx-[var(--section-padding-x)] flex gap-2 overflow-x-auto px-[var(--section-padding-x)] pb-1 no-scrollbar lg:hidden">
              {SHOWCASE.map((s) => (
                <TabButton key={s.id} item={s} active={s.id === activeId} compact onSelect={setActiveId} onKey={onKey} />
              ))}
            </div>
            {/* 데스크톱: 묶음별 세로 목록 */}
            <div className="hidden lg:block">
              {SHOWCASE_GROUPS.map((g) => (
                <div key={g} className="mb-6 last:mb-0">
                  <p className="px-4 pb-2 font-body font-semibold text-[12.5px] text-text-sub">{g}</p>
                  <div className="grid gap-1">
                    {SHOWCASE.filter((s) => s.group === g).map((s) => (
                      <TabButton key={s.id} item={s} active={s.id === activeId} onSelect={setActiveId} onKey={onKey} withId />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 패널 */}
          <div role="tabpanel" id={`panel-${active.id}`} aria-label={active.name} className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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

function OwnerTag({ who, size = 'sm' }: { who: '주도' | '참여'; size?: 'sm' | 'md' }) {
  const pad = size === 'md' ? 'px-2.5 py-[5px] text-[12.5px]' : 'px-2 py-[3px] text-[11.5px]'
  return who === '주도' ? (
    <span className={`shrink-0 rounded-full bg-navy font-body font-bold leading-[1.4] text-white ${pad}`}>주도</span>
  ) : (
    <span className={`shrink-0 rounded-full border border-line-strong font-body font-bold leading-[1.4] text-text-sub ${pad}`}>참여</span>
  )
}

function TabButton(props: {
  item: ShowcaseItem
  active: boolean
  compact?: boolean
  withId?: boolean
  onSelect: (id: string) => void
  onKey: (e: KeyboardEvent<HTMLButtonElement>) => void
}) {
  const { item: s, active, compact } = props
  const common = {
    type: 'button' as const,
    role: 'tab',
    'aria-selected': active,
    'aria-controls': `panel-${s.id}`,
    tabIndex: active ? 0 : -1,
    'data-tab-id': s.id,
    onClick: () => props.onSelect(s.id),
    onKeyDown: props.onKey,
  }
  if (compact) {
    return (
      <button
        {...common}
        className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 font-body font-semibold text-[14px] transition-colors ${active ? 'border-ink bg-ink text-white' : 'border-line bg-panel text-ink'}`}
      >
        {s.name}
      </button>
    )
  }
  return (
    <button
      {...common}
      // 데스크톱 목록의 버튼만 앵커 id를 가진다(모바일 탭과 id 중복 방지)
      id={props.withId ? s.id : undefined}
      className={`relative flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left transition-colors duration-200 ${active ? 'bg-panel' : 'hover:bg-panel/60'}`}
      style={active ? { boxShadow: '0 0 0 1px var(--color-line), 0 6px 18px rgba(16,26,44,0.06)' } : undefined}
    >
      <span aria-hidden className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-colors ${active ? 'bg-navy' : 'bg-transparent'}`} />
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-body text-[15px] leading-[1.35] text-ink ${active ? 'font-bold' : 'font-semibold'}`}>{s.name}</span>
        <span className="mt-0.5 block truncate font-body text-[12.5px] leading-[1.4] text-text-sub">{s.listMeta}</span>
      </span>
      <OwnerTag who={s.ownership} />
    </button>
  )
}

function Panel({ item: s }: { item: ShowcaseItem }) {
  const navigate = useNavigate()
  const open = s.project ? () => void crossfadeToRoom(projectByKey(s.project!), navigate) : undefined

  return (
    <article className="overflow-hidden bg-panel" style={{ borderRadius: 18, border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-frame)' }}>
      {/* 그림 */}
      <div className="border-b border-line bg-soft/70 px-4 py-4 sm:px-6">
        {s.media.kind === 'image' ? (
          <figure>
            {open ? (
              <button type="button" onClick={open} aria-label={`${s.name} 상세 보기`} className="block w-full cursor-pointer">
                <MediaImg src={s.media.src!} alt={s.media.alt ?? ''} />
              </button>
            ) : (
              <MediaImg src={s.media.src!} alt={s.media.alt ?? ''} />
            )}
            <figcaption className="mt-2.5 text-center font-body text-[12.5px] leading-[1.5] text-text-sub break-keep">{s.media.caption}</figcaption>
          </figure>
        ) : (
          <PicklPhones caption={s.media.caption} />
        )}
      </div>

      <div className="px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-body font-bold leading-[1.2] tracking-[-0.03em] text-ink" style={{ fontSize: 'clamp(24px, 2.4vw, 30px)' }}>
              {s.name}
            </h3>
            <p className="mt-1.5 font-body text-[13.5px] leading-[1.5] text-text-sub">{s.chips.join(' · ')}</p>
          </div>
          <OwnerTag who={s.ownership} size="md" />
        </div>

        <p className="mt-5 max-w-[60ch] font-body font-semibold text-[16.5px] leading-[1.6] text-ink break-keep">{s.summary}</p>

        <dl className="mt-6 border-t border-line">
          <Row label="맡은 일">
            <p className="font-body text-[14.5px] leading-[1.65] text-text-sub break-keep">{s.role}</p>
          </Row>
          <Row label="배경">
            <ul className="grid gap-1">
              {s.background.map((b) => (
                <Bullet key={b}>{b}</Bullet>
              ))}
            </ul>
          </Row>
          <Row label="진행">
            <ol className="grid gap-2 sm:grid-cols-3">
              {s.steps.map((st, i) => (
                <li key={st} className="flex items-start gap-2.5 rounded-[10px] bg-base px-3 py-2.5">
                  <span className="num mt-[1px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy font-semibold text-[11px] text-white">{i + 1}</span>
                  <span className="font-body text-[13.5px] leading-[1.5] text-ink break-keep">{st}</span>
                </li>
              ))}
            </ol>
          </Row>
          <Row label="결과">
            <ul className="grid gap-1">
              {s.results.map((r) => (
                <Bullet key={r.text} ink>
                  <Marked text={r.text} mark={r.mark} as="value" />
                </Bullet>
              ))}
            </ul>
          </Row>
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-1.5" aria-label={`${s.name} 기술`}>
            {s.tech.map((t) => (
              <li key={t} className="rounded-[6px] border border-line px-2 py-1.5 font-mono text-[11.5px] leading-none text-text-sub">
                {t}
              </li>
            ))}
          </ul>
          {open ? (
            <button type="button" onClick={open} className="shrink-0 rounded-full bg-ink px-5 py-3 font-body font-semibold text-[14px] text-white transition-colors hover:bg-navy">
              자세히 보기
            </button>
          ) : (
            s.external && (
              <a
                href={s.external.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-ink px-5 py-3 font-body font-semibold text-[14px] text-white transition-colors hover:bg-navy"
              >
                {s.external.label} <span aria-hidden>↗</span>
              </a>
            )
          )}
        </div>
      </div>
    </article>
  )
}

function MediaImg({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={onImgError}
      loading="lazy"
      decoding="async"
      className="mx-auto block h-auto max-h-[270px] w-auto max-w-full bg-white"
      style={{ borderRadius: 10, border: '1px solid var(--color-line)' }}
    />
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-line py-4 sm:grid-cols-[68px_minmax(0,1fr)] sm:gap-4">
      <dt className="pt-[2px] font-body font-bold text-[13px] text-text-sub">{label}</dt>
      <dd className="m-0 min-w-0">{children}</dd>
    </div>
  )
}

function Bullet({ children, ink = false }: { children: ReactNode; ink?: boolean }) {
  return (
    <li className={`relative pl-3.5 font-body text-[14.5px] leading-[1.65] break-keep ${ink ? 'text-ink' : 'text-text-sub'}`}>
      <span aria-hidden className="absolute left-0 top-[0.7em] h-[4px] w-[4px] rounded-full bg-line-strong" />
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
  const frame = { borderRadius: 14, border: '1px solid var(--color-line)' }
  return (
    <figure>
      <div className="mx-auto grid max-w-[400px] grid-cols-3 gap-3">
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
                <span aria-hidden className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/[0.06]" />
                <span aria-hidden className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink/85">
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
      <figcaption className="mt-2.5 text-center font-body text-[12.5px] leading-[1.5] text-text-sub break-keep">{caption}</figcaption>
    </figure>
  )
}
