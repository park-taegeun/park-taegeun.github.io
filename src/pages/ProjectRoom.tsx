// 상세(2층) 페이지. 케이스 스터디형 공통 틀:
// 머리(태그·이름·한 줄) → 요약 박스 → 대표 이미지 → (과제와 내 자리) → [탭] 문제 · 구조 · 결과 · 설계 결정 · 검증
// → AI 위임 → 한계와 다음 행동 → 증거 링크. 데스크톱은 오른쪽 고정 목차, 모바일은 상단 칩 목차.
// 진입은 시그니처 전환(커버 persist) 아래에서 마운트되고, 머리만 fade-up 한다.
import gsap from 'gsap'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Label from '../components/Label'
import RichText from '../components/RichText'
import {
  AiDelegation,
  BlockHead,
  Body,
  CheckList,
  DecisionList,
  Limits,
  LinksBlock,
  ResultsTable,
  SummaryBox,
  ZoomFrame,
} from '../components/case/CaseBlocks'
import { SECTION_LABELS } from '../components/case/sections'
import EvidenceFrame from '../components/room/EvidenceFrame'
import Lightbox from '../components/room/Lightbox'
import Reveal from '../components/room/Reveal'
import { PROJECTS, type ProjectKey } from '../data/projects'
import { ROOMS, type EvidenceItem, type RoomData, type Track } from '../data/rooms'
import { scrollToId } from '../lib/lenis'
import { EASE_DEFAULT, prefersReducedMotion } from '../lib/motion'
import { crossfadeToRoom, exitRoom } from '../lib/signature'

const padX = { paddingInline: 'var(--room-padding-x)' }

function tocFor(room: RoomData, track: Track) {
  const ids = ['summary']
  if (room.context) ids.push('context')
  if (track.problem) ids.push('problem')
  if (track.structure) ids.push('structure')
  if (track.results) ids.push('results')
  if (track.decisions?.length) ids.push('decisions')
  if (track.checks?.length) ids.push('checks')
  if (room.delegation) ids.push('ai')
  ids.push('limits', 'links')
  return ids.map((id) => ({ id, label: SECTION_LABELS[id] }))
}

export default function ProjectRoom() {
  const { key } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const root = useRef<HTMLElement>(null)
  const [zoom, setZoom] = useState<EvidenceItem | null>(null)

  const index = PROJECTS.findIndex((p) => p.key === (key as ProjectKey))
  const project = index >= 0 ? PROJECTS[index] : undefined
  const room = project ? ROOMS[project.key] : undefined
  const next = project ? PROJECTS[(index + 1) % PROJECTS.length] : undefined

  const tabParam = params.get('tab')
  const activeTrack = room?.tracks.find((t) => t.id === tabParam) ?? room?.tracks[0]
  const track = activeTrack?.track
  const toc = useMemo(() => (room && track ? tocFor(room, track) : []), [room, track])
  const [activeId, setActiveId] = useState('summary')
  const hash = location.hash.slice(1)

  // 머리 fade-up
  useEffect(() => {
    if (!project || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-room-fade]', { y: 20, opacity: 0, duration: 0.4, ease: EASE_DEFAULT, stagger: 0.05 })
    }, root)
    return () => ctx.revert()
  }, [project])

  // 문서 제목(탭 제목·공유 시 브라우저 표시)
  useEffect(() => {
    if (!project) return
    const prev = document.title
    document.title = project.og.title
    return () => {
      document.title = prev
    }
  }, [project])

  // 근거 링크로 들어온 경우(#check-0 등) 해당 블록으로 이동
  useEffect(() => {
    if (!hash) return
    const t = window.setTimeout(() => scrollToId(hash), 450)
    return () => window.clearTimeout(t)
  }, [hash, key, tabParam])

  // 현재 읽는 블록(목차 강조)
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.3
      let cur = toc[0]?.id ?? ''
      for (const { id } of toc) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < line) cur = id
      }
      setActiveId(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [toc])

  if (!project || !room || !next || !track || !activeTrack) return <Navigate to="/" replace />

  const goBack = () => void exitRoom(navigate, project.anchorId)
  const jump = (id: string) => scrollToId(id)
  const selectTab = (id: string) => setParams({ tab: id }, { replace: true, preventScrollReset: true })
  const hasTabs = room.tracks.length > 1

  return (
    <main ref={root} className="bg-base">
      {/* 상단 바: 목록 · 다음 + 모바일 칩 목차 */}
      <nav aria-label="상세 페이지 이동" className="sticky top-0 z-40 bg-base/92 backdrop-blur-sm border-b border-line">
        <div className="mx-auto max-w-[1180px] flex items-center justify-between gap-4 py-3" style={padX}>
          <button type="button" onClick={goBack} className="font-body font-semibold text-[13px] text-text-muted hover:text-ink transition-colors">
            ← 목록으로
          </button>
          <p className="hidden sm:block font-body font-semibold text-[13px] text-ink truncate">{project.name}</p>
          <button
            type="button"
            onClick={() => void crossfadeToRoom(next, navigate)}
            className="font-body font-semibold text-[13px] text-navy hover:text-ink transition-colors truncate"
          >
            다음: {next.name} →
          </button>
        </div>
        <div className="lg:hidden border-t border-line">
          <ul className="flex gap-1.5 overflow-x-auto py-2 no-scrollbar" style={padX} aria-label="이 페이지 목차">
            {toc.map((t) => (
              <li key={t.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => jump(t.id)}
                  aria-current={activeId === t.id ? 'true' : undefined}
                  className="font-body text-[12.5px] leading-none px-3 py-2 rounded-full border transition-colors whitespace-nowrap"
                  style={
                    activeId === t.id
                      ? { background: 'var(--color-navy)', borderColor: 'var(--color-navy)', color: '#fff' }
                      : { borderColor: 'var(--color-line)', color: 'var(--color-text-sub)', background: 'var(--color-panel)' }
                  }
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 머리: 태그 · 이름 · 부제 · 한 줄 */}
      <header aria-label={`${project.name} 소개`} className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: project.tone }} aria-hidden />
        <div className="relative mx-auto max-w-[1180px] pt-14 pb-12 sm:pt-20 sm:pb-16" style={padX}>
          <ul data-room-fade className="flex flex-wrap items-center gap-2" aria-label="프로젝트 태그">
            <li
              className="font-body font-bold text-[12px] leading-none px-2.5 py-1.5 rounded-full"
              style={
                project.ownership === '주도'
                  ? { background: 'var(--color-navy)', color: '#fff' }
                  : { border: '1.5px solid var(--color-signal)', color: 'var(--color-signal)' }
              }
            >
              {project.ownership}
            </li>
            {[project.kind, project.period, project.status].filter(Boolean).map((t) => (
              <li key={t} className="font-body font-medium text-[12.5px] text-text-sub leading-none px-2.5 py-1.5 rounded-full bg-white/60 border border-line">
                {t}
              </li>
            ))}
            <li className="font-mono text-[11.5px] text-text-muted leading-none px-2 py-1.5">{room.asOf}</li>
          </ul>
          <h1
            data-room-fade
            className="font-body font-bold tracking-[-0.035em] mt-5 break-keep"
            style={{ color: project.ink, fontSize: 'clamp(36px, 5.6vw, 76px)', lineHeight: 1.08 }}
          >
            {project.name}
          </h1>
          <p data-room-fade className="font-body font-semibold text-text-sub text-[17px] sm:text-[19px] leading-[1.5] mt-3 break-keep">
            {project.fullName}
          </p>
          <p data-room-fade className="font-body text-ink text-[16px] leading-[1.8] mt-6 max-w-[64ch] break-keep">
            <RichText text={project.oneLine} />
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] grid gap-12 lg:grid-cols-[minmax(0,1fr)_188px] pt-10 pb-24" style={padX}>
        <article className="min-w-0 flex flex-col gap-16 sm:gap-20">
          <SummaryBox room={room} toc={toc} onJump={jump} />

          <Reveal>
            <ZoomFrame item={room.mainImage} onZoom={setZoom} />
          </Reveal>

          {room.context && (
            <section id="context" aria-label="과제 구성과 담당 범위" className="scroll-mt-28">
              <BlockHead id="context" />
              {room.context.periods && (
                <ol className="mt-5 flex flex-wrap gap-2" aria-label="기간">
                  {room.context.periods.map((p, i) => (
                    <li key={p.label} className="flex items-center gap-2">
                      {i > 0 && <span aria-hidden className="text-text-muted">→</span>}
                      <span className="font-body text-[13px] leading-none px-3 py-2 rounded-full bg-panel border border-line">
                        <strong className="font-semibold text-ink">{p.label}</strong>
                        <span className="font-mono text-text-muted ml-2">{p.period}</span>
                        {p.note && <span className="text-text-sub ml-2">· {p.note}</span>}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              <Body text={room.context.body} className="mt-5" />
              {room.context.image && (
                <div className="mt-8">
                  <ZoomFrame item={room.context.image} onZoom={setZoom} />
                </div>
              )}
            </section>
          )}

          {hasTabs && (
            <div id="tracks" className="scroll-mt-28 -mb-6 sm:-mb-10">
              <p className="font-body text-text-muted text-[13px] mb-3">두 연구 주제를 탭으로 나눴습니다. 탭을 바꾸면 아래 배경부터 문제 해결까지의 내용이 바뀝니다.</p>
              <div role="tablist" aria-label="연구 주제" className="flex flex-wrap gap-2">
                {room.tracks.map((t) => {
                  const on = t.id === activeTrack.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      id={`tab-${t.id}`}
                      aria-selected={on}
                      aria-controls="track-panel"
                      onClick={() => selectTab(t.id)}
                      className="font-body text-[14px] px-4 py-2.5 rounded-full border transition-colors"
                      style={
                        on
                          ? { background: 'var(--color-navy)', borderColor: 'var(--color-navy)', color: '#fff', fontWeight: 700 }
                          : { borderColor: 'var(--color-line-strong)', color: 'var(--color-text-sub)', background: 'var(--color-panel)', fontWeight: 500 }
                      }
                    >
                      {t.label}
                      {t.period && <span className="font-mono text-[11.5px] ml-2 opacity-80">{t.period}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div
            id="track-panel"
            role={hasTabs ? 'tabpanel' : undefined}
            aria-labelledby={hasTabs ? `tab-${activeTrack.id}` : undefined}
            className="flex flex-col gap-16 sm:gap-20"
            key={activeTrack.id}
          >
            {track.problem && (
              <section id="problem" aria-label="배경과 목표" className="scroll-mt-28">
                <BlockHead id="problem" />
                <div className="mt-5">
                  <Body text={track.problem.body} />
                  {track.problem.source && <p className="font-body text-text-muted text-[12.5px] leading-[1.6] mt-4">{track.problem.source}</p>}
                </div>
                {track.problem.image && (
                  <div className="mt-8 max-w-[680px]">
                    <ZoomFrame item={track.problem.image} onZoom={setZoom} />
                  </div>
                )}
              </section>
            )}

            {track.structure && (
              <section id="structure" aria-label="구조" className="scroll-mt-28">
                <BlockHead id="structure" />
                <Body text={track.structure.body} className="mt-5" />
                {track.structure.image && (
                  <div className="mt-8">
                    <ZoomFrame item={track.structure.image} onZoom={setZoom} />
                  </div>
                )}
                {track.structure.gallery && <Gallery items={track.structure.gallery} onZoom={setZoom} />}
              </section>
            )}

            {track.results && (
              <section id="results" aria-label="결과" className="scroll-mt-28">
                <BlockHead id="results" />
                <div className="mt-5">
                  <ResultsTable rows={track.results.rows} columns={track.results.columns} />
                </div>
                {track.results.note && <Body text={track.results.note} className="mt-5 !text-[14.5px]" />}
                {track.results.repo && (
                  <a
                    href={track.results.repo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-body font-semibold text-[13.5px] text-navy underline decoration-line-strong underline-offset-4 hover:decoration-navy transition-colors"
                  >
                    {track.results.repo.label} <span aria-hidden>↗</span>
                  </a>
                )}
                {track.results.image && (
                  <div className="mt-8 max-w-[760px]">
                    <ZoomFrame item={track.results.image} onZoom={setZoom} />
                  </div>
                )}
              </section>
            )}

            {track.decisions && track.decisions.length > 0 && (
              <section id="decisions" aria-label="설계 결정" className="scroll-mt-28">
                <BlockHead id="decisions" />
                <div className="mt-8">
                  <DecisionList items={track.decisions} onZoom={setZoom} />
                </div>
              </section>
            )}

            {track.checks && track.checks.length > 0 && (
              <section id="checks" aria-label="검증과 문제 해결" className="scroll-mt-28">
                <BlockHead id="checks" />
                <p className="font-body text-text-muted text-[13.5px] mt-3">문제 → 원인 → 해결과 결과 순서로 정리했습니다. ‘자세히’를 누르면 전체 내용이 열립니다.</p>
                <div className="mt-5">
                  <CheckList items={track.checks} initialOpen={hash} />
                </div>
              </section>
            )}

            {track.gallery && (
              <section aria-label={track.gallery.label}>
                <Label as="h3" lang="ko">
                  {track.gallery.label}
                </Label>
                <Gallery items={track.gallery.items} onZoom={setZoom} />
              </section>
            )}
          </div>

          {room.delegation && (
            <section id="ai" aria-label="AI 활용 방식" className="scroll-mt-28">
              <BlockHead id="ai" />
              <p className="font-body text-text-muted text-[13.5px] mt-3">AI에 맡긴 일과 직접 한 일, 그리고 결과를 어떻게 검증했는지 정리했습니다.</p>
              <div className="mt-6">
                <AiDelegation d={room.delegation} />
              </div>
            </section>
          )}

          <section id="limits" aria-label="한계와 개선 계획" className="scroll-mt-28">
            <BlockHead id="limits" />
            <div className="mt-6">
              <Limits items={room.limits} />
            </div>
          </section>

          <section id="links" aria-label="관련 링크" className="scroll-mt-28">
            <BlockHead id="links" />
            <div className="mt-6">
              <LinksBlock items={room.links} citation={room.citation} />
            </div>
          </section>
        </article>

        {/* 데스크톱 고정 목차 */}
        <aside className="hidden lg:block">
          <nav aria-label="이 페이지 목차" className="sticky top-24">
            <p className="font-body font-semibold text-text-sub text-[13px]">이 페이지</p>
            {hasTabs && (
              <div className="mt-3 flex flex-col gap-1" aria-label="연구 주제 바꾸기">
                {room.tracks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      selectTab(t.id)
                      jump('tracks')
                    }}
                    className="text-left font-body text-[12.5px] px-2.5 py-1.5 rounded-md transition-colors"
                    style={
                      t.id === activeTrack.id
                        ? { background: 'var(--color-navy)', color: '#fff', fontWeight: 700 }
                        : { color: 'var(--color-text-sub)', background: 'var(--color-soft)' }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
            <ul className="mt-3 border-l border-line">
              {toc.map((t) => {
                const on = activeId === t.id
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => jump(t.id)}
                      aria-current={on ? 'true' : undefined}
                      className="block w-full text-left font-body text-[13px] leading-[1.4] py-1.5 pl-3.5 -ml-px border-l-2 transition-colors"
                      style={{
                        borderColor: on ? 'var(--color-navy)' : 'transparent',
                        color: on ? 'var(--color-ink)' : 'var(--color-text-sub)',
                        fontWeight: on ? 700 : 400,
                      }}
                    >
                      {t.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
      </div>

      {/* 다음 프로젝트 */}
      <section aria-label="다음 프로젝트" className="border-t border-line" style={{ background: next.tintSoft }}>
        <div className="mx-auto max-w-[1180px] py-16 sm:py-20" style={padX}>
          <h2 className="font-body font-semibold text-text-sub text-[13px]">다음 프로젝트</h2>
          <button
            type="button"
            onClick={() => void crossfadeToRoom(next, navigate)}
            className="block text-left font-body font-bold tracking-[-0.03em] mt-3 cursor-pointer transition-transform duration-300 hover:translate-x-2 break-keep"
            style={{ color: next.ink, lineHeight: 1.1, fontSize: 'clamp(30px, 4.4vw, 56px)' }}
          >
            {next.name} →
          </button>
          <p className="font-body text-text-sub text-[15px] mt-2">{next.fullName}</p>
          <button type="button" onClick={goBack} className="font-body font-medium text-text-muted text-[13px] mt-8 hover:text-ink transition-colors block">
            ← 목록으로 돌아가기
          </button>
        </div>
      </section>

      <AnimatePresence>{zoom && <Lightbox item={zoom} onClose={() => setZoom(null)} />}</AnimatePresence>
    </main>
  )
}

function Gallery({ items, onZoom }: { items: EvidenceItem[]; onZoom: (i: EvidenceItem) => void }) {
  return (
    <div className="mt-6 grid gap-x-5 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.src} delay={i * 0.05}>
          <EvidenceFrame item={item} thumb onExpand={() => onZoom(item)} />
        </Reveal>
      ))}
    </div>
  )
}
