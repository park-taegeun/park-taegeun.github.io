// 상세 룸 (P5) — RoomEntrance / MainWall / FloatingEvidenceFrames / InfoDock / RoomExit.
// 증거가 주인공: 실제 화면·사진을 큰 액자로, 스크롤 리빌로 드러남(§8 — 전시관처럼 살아있게).
// 진입: 커버 persist 아래 마운트 → 엔트런스 fade-up 0.4s (§6③). 뒤로가기 = 0.3s 크로스페이드.
import gsap from 'gsap'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Label from '../components/Label'
import AiUsageSection from '../components/room/AiUsageSection'
import CardNewsStack from '../components/room/CardNewsStack'
import SlideViewer from '../components/room/SlideViewer'
import EvidenceFrame from '../components/room/EvidenceFrame'
import Lightbox from '../components/room/Lightbox'
import OriginStoryView from '../components/room/OriginStory'
import Reveal from '../components/room/Reveal'
import { PROJECTS, type ProjectKey } from '../data/projects'
import { ROOMS, type EvidenceItem } from '../data/rooms'
import { scrollToId } from '../lib/lenis'
import { EASE_DEFAULT, prefersReducedMotion } from '../lib/motion'
import { crossfadeToRoom, exitRoom } from '../lib/signature'

const roomPad = {
  paddingInline: 'var(--room-padding-x)',
  paddingBlock: 'var(--room-padding-y)',
}

// 대표 화면이 한 화면을 통째로 점유하지 않도록 짧은 수직 패딩 (§9 토큰)
const roomPadTight = {
  paddingInline: 'var(--room-padding-x)',
  paddingBlock: 'var(--room-padding-y-tight)',
}

function evidenceLayoutClass(item: EvidenceItem, evidenceCols: 2 | 3, groupSize: number) {
  if (item.layout === 'wide') {
    return evidenceCols === 3
      ? 'lg:col-span-3 lg:max-w-[780px] lg:justify-self-center'
      : 'md:col-span-2 md:max-w-[780px] md:justify-self-center'
  }

  if (item.layout === 'compact') {
    return 'max-w-[250px] sm:max-w-[270px] lg:max-w-[255px] justify-self-center'
  }

  return groupSize === 1 ? 'md:max-w-[480px]' : ''
}

export default function ProjectRoom() {
  const { key } = useParams()
  const navigate = useNavigate()
  const root = useRef<HTMLElement>(null)
  const [zoom, setZoom] = useState<EvidenceItem | null>(null)
  const index = PROJECTS.findIndex((p) => p.key === (key as ProjectKey))
  const project = index >= 0 ? PROJECTS[index] : undefined
  const room = project ? ROOMS[project.key] : undefined
  const next = project ? PROJECTS[(index + 1) % PROJECTS.length] : undefined

  useEffect(() => {
    if (!project || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-room-fade]', {
        y: 24,
        opacity: 0,
        duration: 0.4,
        ease: EASE_DEFAULT,
        stagger: 0.06,
      })
    }, root)
    return () => ctx.revert()
  }, [project])

  if (!project || !room || !next) return <Navigate to="/" replace />

  const goBackToProject = () => void exitRoom(navigate, project.anchorId)
  const isCompactRoom = room.mainWallSize === 'compact'
  const mainWallMax = isCompactRoom ? 'max-w-[520px]' : 'max-w-[820px]'
  const evidenceCols = room.evidenceGrid ?? (isCompactRoom ? 3 : 2)
  const evidenceGridClass =
    evidenceCols === 3
      ? 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:items-start'
      : 'grid gap-12 md:grid-cols-2 md:items-start'
  // evidenceGroups 없으면 flat evidence를 라벨 없는 단일 그룹으로 정규화
  const evidenceGroups = room.evidenceGroups ?? [{ label: '', items: room.evidence }]

  return (
    <main ref={root} className="bg-base">
      <nav className="sticky top-0 z-40 bg-base/90 backdrop-blur-sm border-b border-line">
        <div className="mx-auto max-w-[1080px] px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={goBackToProject}
            className="font-body font-semibold text-[13px] text-text-muted hover:text-ink transition-colors"
          >
            프로젝트 목록으로
          </button>
          <button
            type="button"
            onClick={() => scrollToId('info')}
            className="font-body font-semibold text-[13px] text-text-muted hover:text-ink transition-colors"
          >
            정보로
          </button>
          {room.aiUsage && (
            <button
              type="button"
              onClick={() => scrollToId('ai-usage')}
              className="font-body font-semibold text-[13px] text-text-muted hover:text-ink transition-colors"
            >
              AI 사용
            </button>
          )}
          <button
            type="button"
            onClick={() => void crossfadeToRoom(next, navigate)}
            className="font-body font-semibold text-[13px] transition-colors"
            style={{ color: next.ink }}
          >
            다음 프로젝트
          </button>
        </div>
      </nav>

      {/* RoomEntrance — 옅은 톤 배경 + 콘텐츠 (헤어라인·모노 라벨로 절제) */}
      <section
        aria-label={`${project.name} 룸 입구`}
        className="relative flex flex-col justify-center overflow-hidden"
        style={{ minHeight: 'var(--room-min-height)', ...roomPad }}
      >
        {/* 프로젝트 톤 컬러 오버레이 (옅은 냉색 틴트) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: project.tone }}
          aria-hidden
        />

        {/* 콘텐츠 레이어 */}
        <div className="relative z-10">
          <p data-room-fade className="font-body font-semibold uppercase tracking-[0.18em] text-text-muted text-[11.5px]">
            {project.room} · {project.tagline}
          </p>
          <h1
            data-room-fade
            className="font-display font-bold uppercase tracking-[-0.04em] text-room-title mt-3"
            style={{ lineHeight: 0.96, color: project.ink }}
          >
            {project.name}
          </h1>
          <p data-room-fade className="font-body text-text-sub text-[16px] leading-[1.7] mt-6 max-w-[58ch]">
            {room.entranceLine}
          </p>
          {room.entranceDetail && (
            <p data-room-fade className="font-body text-text-muted text-[14px] leading-[1.75] mt-3 max-w-[54ch]">
              {room.entranceDetail}
            </p>
          )}
          <p data-room-fade className="font-body font-medium text-text-muted text-[12.5px] mt-3">{project.role}</p>
          <ul data-room-fade className="mt-6 flex flex-wrap gap-2" aria-label={`${project.name} 핵심 증거`}>
            {project.proofChips.map((chip) => (
              <li
                key={chip}
                className="font-body font-semibold text-[12px] leading-none px-2.5 py-2 border border-line bg-white/45"
                style={{ color: project.ink, borderRadius: 999 }}
              >
                {chip}
              </li>
            ))}
          </ul>

          <div data-room-fade className="mt-14 flex items-baseline gap-8">
            <button
              type="button"
              onClick={() => scrollToId('mainwall')}
              className="font-body font-medium text-text-muted text-[13px] hover:text-ink transition-colors cursor-pointer"
            >
              전시 보기 ↓
            </button>
            <button
              type="button"
              onClick={goBackToProject}
              className="font-body font-semibold uppercase tracking-[0.18em] text-[11.5px] cursor-pointer"
              style={{ color: project.ink }}
            >
              ← 프로젝트 목록
            </button>
          </div>
        </div>
      </section>

      {/* ── 콘텐츠 영역 래퍼 ── */}
      <div className="relative">

      {/* MainWall — 대표 화면 액자 (짧은 패딩, 한 화면 점유 해소) */}
      <section id="mainwall" aria-label="대표 화면" style={roomPadTight} className="relative overflow-hidden">
        <div className={`relative mx-auto ${mainWallMax}`}>
          <Reveal>
            <EvidenceFrame item={room.mainWall} large />
          </Reveal>
          {room.heroStats && (
            <Reveal delay={0.1}>
              <dl className="mt-8 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-3">
                {room.heroStats.map((s) => (
                  <div key={s.label} className="bg-panel px-5 py-5">
                    <dt
                      className="font-display font-bold tabular-nums tracking-[-0.03em] text-[30px] leading-none"
                      style={{ color: project.ink }}
                    >
                      {s.value}
                    </dt>
                    <dd className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-2 m-0">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </section>

      {(room.phaseFlow || room.casePanels) && (
        <section aria-label="설계 구조" style={{ ...roomPad, paddingTop: 0 }}>
          <div className="mx-auto max-w-[1080px]">
            <Label as="h2" lang="ko">설계 구조</Label>

            {room.phaseFlow ? (
              <div className="mt-8">
                <Reveal>
                  <p className="font-body font-semibold uppercase tracking-[0.18em] text-[11.5px]" style={{ color: project.ink }}>
                    {room.phaseFlow.eyebrow}
                  </p>
                  <h3 className="font-body font-bold text-ink text-[20px] leading-[1.4] mt-3 max-w-[40ch]">
                    {room.phaseFlow.title}
                  </h3>
                  {room.phaseFlow.intro && (
                    <p className="font-body text-text-sub text-[14.5px] leading-[1.75] mt-3 max-w-[72ch]">
                      {room.phaseFlow.intro}
                    </p>
                  )}
                </Reveal>
                {/* 4단계 흐름 다이어그램 — 줄글 대신 단계 위계로 시각화(번호·상단 액센트 룰·연결 화살표) */}
                <ol className="mt-10 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
                  {room.phaseFlow.phases.map((p, i) => (
                    <Reveal key={p.no} delay={i * 0.08}>
                      <li className="relative border-t-2 pt-4" style={{ borderColor: project.ink }}>
                        {i < room.phaseFlow!.phases.length - 1 && (
                          <span aria-hidden className="hidden lg:block absolute -right-[18px] top-2.5 text-text-faint text-[15px] leading-none">
                            →
                          </span>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="font-display font-bold text-[30px] leading-none tracking-[-0.04em]" style={{ color: project.ink }}>
                            {p.no}
                          </span>
                          <span className="font-body font-semibold uppercase tracking-[0.14em] text-[10px] text-text-muted">Phase</span>
                        </div>
                        <p className="font-body font-bold text-ink text-[15px] leading-[1.4] mt-3">{p.name}</p>
                        <p className="font-body text-text-sub text-[13px] leading-[1.6] mt-1.5">{p.desc}</p>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>
            ) : (
              /* 가독성 개선 — 상단 액센트 룰 + 인덱스 번호로 위계를 또렷하게 */
              <div className="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-3">
                {room.casePanels!.map((panel, i) => (
                  <Reveal key={panel.title}>
                    <article className="border-t-2 pt-5" style={{ borderColor: project.ink }}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-body font-semibold uppercase tracking-[0.18em] text-[11px]" style={{ color: project.ink }}>
                          {panel.eyebrow}
                        </p>
                        <span className="font-display font-bold text-[13px] tabular-nums" style={{ color: project.ink, opacity: 0.45 }}>
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="font-body font-bold text-ink text-[17px] leading-[1.42] mt-3">
                        {panel.title}
                      </h3>
                      <p className="font-body text-text-sub text-[14px] leading-[1.78] mt-3">
                        {panel.body}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {room.aiUsage && (
        <section id="ai-usage" aria-label="AI 사용 방식" style={{ ...roomPad, paddingTop: 0 }}>
          <AiUsageSection aiUsage={room.aiUsage} project={project} />
        </section>
      )}

      {/* FloatingEvidenceFrames — 보조 근거 (그룹 라벨 = 내러티브 흐름, 지그재그는 2열에서만) */}
      <section aria-label="근거 자료" style={{ ...roomPad, paddingTop: 0 }}>
        <div className={`mx-auto ${evidenceCols === 3 ? 'max-w-[960px]' : 'max-w-[1080px]'} flex flex-col gap-20`}>
          {evidenceGroups.map((group, gi) => (
            <div key={group.label || `group-${gi}`}>
              {group.label && (
                <Reveal>
                  <h2
                    className="border-t border-line pt-5 font-body font-semibold tracking-[0.08em] text-[13.5px]"
                    style={{ color: project.ink }}
                  >
                    {group.label}
                  </h2>
                  {group.desc && (
                    <p className="font-body text-text-sub text-[14.5px] leading-[1.72] mt-3 max-w-[72ch]">
                      {group.desc}
                    </p>
                  )}
                </Reveal>
              )}
              {group.layout === 'gallery' ? (
                /* 갤러리 — 균일 썸네일 + 클릭 확대(그래프 벽 방지) */
                <div className={`grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 ${group.label ? 'mt-8' : ''}`}>
                  {group.items.map((item, i) => (
                    <Reveal key={item.src} delay={i * 0.06}>
                      <EvidenceFrame item={item} thumb onExpand={() => setZoom(item)} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className={`${evidenceGridClass} ${group.label ? 'mt-8' : ''}`}>
                  {group.items.map((item, i) => (
                    <Reveal
                      key={item.src}
                      delay={i * 0.08}
                      className={[
                        // 지그재그는 margin으로 — GSAP transform(Reveal)과의 합성 충돌 방지
                        evidenceCols === 2 && i % 2 === 1 ? 'md:mt-10' : '',
                        evidenceLayoutClass(item, evidenceCols, group.items.length),
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <EvidenceFrame item={item} tiltDir={i % 2 === 0 ? 1 : -1} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* OriginStory — 세로 내러티브(voice에서는 작업 과정 01~05) */}
      {room.originStory && (
        <section aria-label="원점 스토리" style={{ ...roomPad, paddingTop: 0 }}>
          <OriginStoryView story={room.originStory} ink={project.ink} />
        </section>
      )}

      {/* SlideViewer — Peek Carousel: 세션 PPT 슬라이드 */}
      {room.slideViewer && (
        <section aria-label="세션 슬라이드" style={{ ...roomPad, paddingTop: 0 }}>
          <div className="mx-auto max-w-[880px]">
            <Reveal>
              <h2
                className="border-t border-line pt-5 font-body font-semibold tracking-[0.08em] text-[13.5px]"
                style={{ color: project.ink }}
              >
                {room.slideViewer.label}
              </h2>
            </Reveal>
            <Reveal className="mt-8" delay={0.1}>
              <SlideViewer items={room.slideViewer.items} />
            </Reveal>
          </div>
        </section>
      )}

      {/* CardNewsStack — 겹침 콜라주: 내용 판독보다 "직접 만들었다"는 증거 */}
      {room.cardStack && (
        <section aria-label="카드뉴스 모음" style={{ ...roomPad, paddingTop: 0 }}>
          <div className="mx-auto max-w-[880px]">
            <Reveal>
              <h2
                className="border-t border-line pt-5 font-body font-semibold tracking-[0.08em] text-[13.5px]"
                style={{ color: project.ink }}
              >
                {room.cardStack.label}
              </h2>
            </Reveal>
            <Reveal className="mt-8" delay={0.1}>
              <CardNewsStack groups={room.cardStack.groups} caption={room.cardStack.caption} />
            </Reveal>
          </div>
        </section>
      )}

      {room.writingRefs && (
        <section aria-label="벨로그 연결" style={{ ...roomPad, paddingTop: 0 }}>
          <div className="mx-auto max-w-[1080px]">
            <Label as="h2" lang="ko">벨로그 연결</Label>
            <p className="font-body text-text-sub text-[15px] leading-[1.7] mt-4 max-w-[72ch]">
              멋사 세션에서 다룬 내용을 글로 다시 정리해, 강의 자료와 개인적인 사고 기록이 같은 방향으로 쌓이도록 했습니다.
            </p>
            <div className="mt-8 flex flex-col">
              {room.writingRefs.map((ref) => (
                <Reveal key={ref.title}>
                  <article className="border-t border-line py-6 grid gap-3 md:grid-cols-[220px_1fr]">
                    <div>
                      <p className="font-body font-semibold text-[12px] tracking-[0.08em]" style={{ color: project.ink }}>
                        {ref.source}
                      </p>
                      <h3 className="font-body font-bold text-ink text-[17px] leading-[1.45] mt-2">
                        {ref.title}
                      </h3>
                    </div>
                    <div>
                      <p className="font-body text-text-sub text-[15px] leading-[1.7]">{ref.summary}</p>
                      <p className="font-body text-text-muted text-[13.5px] leading-[1.65] mt-2">
                        {ref.application}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* InfoDock — 문제 정의 / 핵심 판단 / 역할 / 흐름 / 산출물 / 검증 / UX Writing / 배운 점 */}
      <section id="info" aria-label="프로젝트 정보" style={roomPad}>
        <div className="mx-auto max-w-[1080px]">
          <Label as="h2" lang="ko">프로젝트 정보</Label>
          <dl className="mt-8 flex flex-col">
            {(
              [
                ['문제 정의', room.infoDock.problem],
                ['핵심 판단', room.infoDock.insight],
                ['맡은 역할', room.infoDock.role],
                ['설계한 흐름', room.infoDock.coreFlow],
                ['산출물', room.infoDock.output],
                ['검증', room.infoDock.verification],
                ['측정·설계 관점', room.infoDock.uxWritingPoint],
                ['이후 작업 방식', room.infoDock.learning],
              ] as const
            ).map(([k, v]) => (
              <Reveal key={k}>
                <div className="border-t border-line py-7 grid gap-3 md:grid-cols-[200px_1fr]">
                  <dt className="font-body font-semibold tracking-[0.08em] text-[12px]" style={{ color: project.ink }}>
                    {k}
                  </dt>
                  <dd className="m-0 max-w-[76ch]">
                    {Array.isArray(v) ? (
                      <ul className="grid gap-2.5">
                        {v.map((item) => (
                          <li
                            key={item}
                            className="font-body text-text-sub text-[15.5px] leading-[1.7] grid grid-cols-[8px_1fr] gap-3"
                          >
                            <span
                              className="mt-[0.72em] h-1.5 w-1.5 rounded-full"
                              style={{ background: project.ink }}
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body text-text-sub text-[16px] leading-[1.75] m-0">{v}</p>
                    )}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* RoomExit — 다음 룸 */}
      <section aria-label="다음 룸" className="border-t border-line" style={{ background: next.tintSoft }}>
        <div className="mx-auto max-w-[1080px]" style={roomPad}>
          <Label as="h2">Next Room</Label>
          <button
            type="button"
            onClick={() => void crossfadeToRoom(next, navigate)}
            className="block text-left font-display font-bold uppercase tracking-[-0.04em] text-h2 mt-4 cursor-pointer transition-transform duration-300 hover:translate-x-2"
            style={{ color: next.ink, lineHeight: 1 }}
            aria-label={`다음 룸 ${next.name}으로 이동`}
          >
            {next.name} →
          </button>
          <button
            type="button"
            onClick={goBackToProject}
            className="font-body font-medium text-text-muted text-[13px] mt-8 hover:text-ink transition-colors cursor-pointer block"
          >
            ← 프로젝트 목록으로 돌아가기
          </button>
        </div>
      </section>
      </div>{/* ── 콘텐츠 래퍼 끝 ── */}

      <AnimatePresence>
        {zoom && <Lightbox item={zoom} onClose={() => setZoom(null)} />}
      </AnimatePresence>
    </main>
  )
}
