// AI 사용 방식 — HYBRID (§ design-direction §8 준수)
// 레이어1(10초 스캔): 상단 프로세스맵 + 5단계 스캔카드(eyebrow·단계명·남긴 결과 1줄).
// 레이어2(펼침): 카드 클릭 시 사용한 때 / 사용 방식 / 남긴 결과 + 인라인 증거 슬라이드.
// 펼침은 transform·opacity만(높이 애니메이션 없음). reduced-motion이면 전 카드 기본 펼침 → 정보 손실 0.
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import type { Project } from '../../data/projects'
import type { EvidenceItem, RoomData } from '../../data/rooms'
import { prefersReducedMotion } from '../../lib/motion'
import Label from '../Label'
import EvidenceFrame from './EvidenceFrame'
import Lightbox from './Lightbox'
import Reveal from './Reveal'

type AiUsage = NonNullable<RoomData['aiUsage']>

export default function AiUsageSection({ aiUsage, project }: { aiUsage: AiUsage; project: Project }) {
  const reduced = prefersReducedMotion()
  const blocks = aiUsage.blocks
  // reduced-motion: 전 카드 기본 펼침(정보 즉시 가시). 그 외: 전부 접힘(10초 스캔).
  const [open, setOpen] = useState<Set<number>>(() =>
    reduced ? new Set(blocks.map((_, i) => i)) : new Set<number>(),
  )
  const [zoom, setZoom] = useState<EvidenceItem | null>(null)
  const closeZoom = useCallback(() => setZoom(null), [])
  const toggle = (i: number) =>
    setOpen((prev) => {
      const n = new Set(prev)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })

  return (
    <div className="mx-auto max-w-[920px]">
      <Label as="h2" lang="ko" className="text-[15px]">AI 사용 방식</Label>
      <p className="font-body text-text-sub text-[15.5px] leading-[1.75] mt-4 max-w-[72ch]">
        {aiUsage.intro}
      </p>

      {/* 프로세스 맵 — 10초 스캔용 한 줄 흐름(제작 과정의 순서) */}
      <ol className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-2.5">
        {blocks.map((block, i, arr) => (
          <li key={block.title} className="flex items-center gap-2.5">
            <span className="font-body text-[12.5px] tracking-[0.01em] text-text-sub">
              <span className="font-display text-[12px] mr-1.5 align-[1px]" style={{ color: project.ink }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {block.step ?? block.eyebrow}
            </span>
            {i < arr.length - 1 && (
              <span className="text-text-muted/55 select-none" aria-hidden>→</span>
            )}
          </li>
        ))}
      </ol>

      {/* 펼침 안내 — 누르면 자세히 열린다는 어포던스 */}
      <p className="mt-9 font-body text-[12.5px] text-text-muted">
        각 단계를 누르면 사용 방식과 증거가 펼쳐집니다.
      </p>

      {/* 스캔 카드 + 펼침 아코디언 (박스 대신 구분선·번호·색점으로 위계 — §8) */}
      <ol className="mt-3 border-t border-line">
        {blocks.map((block, i) => {
          const num = String(i + 1).padStart(2, '0')
          const isOpen = open.has(i)
          const panelId = `ai-step-panel-${i}`
          return (
            <li key={block.title} className="border-b border-line">
              <Reveal>
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group w-full text-left py-6 grid grid-cols-[40px_1fr_auto] items-baseline gap-x-4 md:grid-cols-[48px_1fr_auto] md:gap-x-6 cursor-pointer"
                  >
                    <span
                      className="font-display font-bold text-[22px] md:text-[26px] leading-none tracking-[-0.04em]"
                      style={{ color: project.ink }}
                    >
                      {num}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-x-2.5 flex-wrap">
                        <span
                          className="font-body font-semibold uppercase tracking-[0.18em] text-[11px]"
                          style={{ color: project.ink }}
                        >
                          {block.eyebrow}
                        </span>
                        {block.step && (
                          <span className="font-body text-[12px] text-text-muted">· {block.step}</span>
                        )}
                      </span>
                      <span className="block font-body font-semibold text-ink text-[15.5px] md:text-[16.5px] leading-[1.5] mt-1.5 group-hover:underline underline-offset-4 decoration-1">
                        {block.scanResult ?? block.output}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 justify-self-end text-text-muted transition-transform duration-300"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transitionTimingFunction: 'var(--ease-default)',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={reduced ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-9 md:grid-cols-[1fr_auto] md:items-start pl-[56px] md:pl-[68px] pr-1">
                        <div className="max-w-[60ch]">
                          <p className="font-body font-bold text-ink text-[17px] md:text-[18px] leading-[1.45] m-0">
                            {block.title}
                          </p>
                          <dl className="mt-4 grid gap-3.5">
                            <div className="grid grid-cols-[max-content_1fr] gap-x-3 items-baseline">
                              <dt className="font-body font-semibold text-[11.5px] tracking-[0.05em] text-text-muted whitespace-nowrap">
                                사용한 때
                              </dt>
                              <dd className="font-body text-text-sub text-[14px] leading-[1.65] m-0">
                                {block.usedWhen}
                              </dd>
                            </div>
                            <div>
                              <dt className="font-body font-semibold text-[11.5px] tracking-[0.05em] text-text-muted">
                                사용 방식
                              </dt>
                              <dd className="m-0 mt-2">
                                <ul className="grid gap-2">
                                  {block.how.map((item) => (
                                    <li
                                      key={item}
                                      className="font-body text-text-sub text-[14.5px] leading-[1.65] grid grid-cols-[7px_1fr] gap-3"
                                    >
                                      <span
                                        className="mt-[0.7em] h-1.5 w-1.5 rounded-full shrink-0"
                                        style={{ background: project.ink }}
                                        aria-hidden
                                      />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </dd>
                            </div>
                            <div className="grid grid-cols-[max-content_1fr] gap-x-3 items-baseline">
                              <dt className="font-body font-semibold text-[11.5px] tracking-[0.05em] text-text-muted whitespace-nowrap">
                                남긴 결과
                              </dt>
                              <dd className="font-body text-text-sub text-[14px] leading-[1.65] m-0">
                                {block.output}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {block.evidence && (
                          <button
                            type="button"
                            onClick={() => setZoom(block.evidence!)}
                            aria-label={`${block.evidence.caption} — 확대해서 보기`}
                            className="block w-full text-left cursor-zoom-in md:w-[340px] lg:w-[400px]"
                          >
                            <EvidenceFrame item={block.evidence} tiltDir={i % 2 === 0 ? 1 : -1} />
                            <span className="mt-1.5 inline-flex items-center gap-1 font-body text-[11.5px] text-text-muted">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M7.6 7.6 10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                              </svg>
                              눌러서 확대
                            </span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            </li>
          )
        })}
      </ol>

      {/* 풀스택 깊이 — DB 스키마 보조 1장(AI가 만든 결과를 떠받치는 데이터 구조) */}
      {aiUsage.fullStackProof && (
        <Reveal className="mt-14">
          <div className="border-t border-line pt-8 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-10">
            <div className="max-w-[46ch]">
              <p className="font-body font-semibold uppercase tracking-[0.18em] text-[11px]" style={{ color: project.ink }}>
                full-stack depth
              </p>
              <p className="font-body font-bold text-ink text-[18px] leading-[1.4] mt-2">
                {aiUsage.fullStackProof.label}
              </p>
              <p className="font-body text-text-sub text-[14px] leading-[1.7] mt-3">
                AI가 빠르게 만든 결과도, 받쳐주는 데이터 구조가 있어야 실제로 동작합니다.
                추천 요청부터 저장·피드백까지의 흐름을 직접 설계했습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setZoom(aiUsage.fullStackProof!.item)}
              aria-label={`${aiUsage.fullStackProof.item.caption} — 확대해서 보기`}
              className="block w-full text-left cursor-zoom-in mt-6 md:mt-0 md:w-[400px] lg:w-[460px]"
            >
              <EvidenceFrame item={aiUsage.fullStackProof.item} />
              <span className="mt-1.5 inline-flex items-center gap-1 font-body text-[11.5px] text-text-muted">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M7.6 7.6 10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                눌러서 확대
              </span>
            </button>
          </div>
        </Reveal>
      )}

      <AnimatePresence>
        {zoom && <Lightbox item={zoom} onClose={closeZoom} />}
      </AnimatePresence>
    </div>
  )
}
