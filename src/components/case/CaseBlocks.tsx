// 상세(2층) 공통 블록: 블록 머리, 요약 박스, 결과 표, 설계 결정, 검증(접기), AI 위임 네 칸, 한계, 증거 링크.
// 디자인 시스템(헤어라인·모노 라벨·네이비/틸)은 그대로 쓰고, 정보 구조만 케이스 스터디형으로 바꾼다.
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Check, Decision, EvidenceItem, RecordLink, ResultRow, RoomData } from '../../data/rooms'
import { splitSentences } from '../../lib/text'
import RichText from '../RichText'
import EvidenceFrame from '../room/EvidenceFrame'
import { SECTION_LABELS } from './sections'
import Reveal from '../room/Reveal'


export function BlockHead({ id, no, children }: { id: string; no?: string; children?: ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 border-t border-line pt-5">
      {no && <span className="num font-semibold text-[13px] text-text-sub">{no}</span>}
      <h2 className="font-body font-bold text-ink text-[19px] sm:text-[21px] leading-[1.35] tracking-[-0.02em]">
        {children ?? SECTION_LABELS[id]}
      </h2>
    </div>
  )
}

export function Body({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`font-body text-text-sub text-[15.5px] leading-[1.8] max-w-[70ch] break-keep ${className}`}>
      <RichText text={text} />
    </p>
  )
}

export function RecordChip({ record }: { record: RecordLink }) {
  return (
    <a
      href={record.href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-1.5 font-body font-semibold text-[13px] text-navy hover:text-ink transition-colors"
    >
      <span aria-hidden className="h-[5px] w-[5px] rounded-full bg-navy" />
      <span className="underline-offset-4 group-hover:underline">{record.label}</span>
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
    </a>
  )
}

/* ── 요약 박스: 역할 1줄 · 결과 3개(숫자+조건) · 기술 · 이 페이지 목차 ── */
export function SummaryBox({
  room,
  toc,
  onJump,
}: {
  room: RoomData
  toc: { id: string; label: string }[]
  onJump: (id: string) => void
}) {
  const s = room.summary
  return (
    <section
      id="summary"
      aria-label="요약"
      className="scroll-mt-28 bg-panel overflow-hidden"
      style={{ borderRadius: 'var(--frame-radius)', border: 'var(--frame-border)', boxShadow: 'var(--shadow-soft)' }}
    >
      <div className="px-5 py-5 sm:px-7 sm:py-6 border-b border-line">
        <p className="font-body font-semibold text-text-sub text-[13px]">담당 역할</p>
        <p className="font-body text-ink text-[15.5px] leading-[1.75] mt-2 max-w-[78ch] break-keep">
          <RichText text={s.role} />
        </p>
      </div>
      <dl className="grid sm:grid-cols-3 gap-px bg-line">
        {s.results.map((r) => (
          <div key={r.label} className="bg-panel px-5 py-5 sm:px-6">
            <dt className="num font-bold text-signal-deep text-[21px] sm:text-[22px] leading-[1.2] tracking-[-0.02em] break-keep">
              {r.value}
            </dt>
            <dd className="m-0 mt-2">
              <span className="block font-body font-semibold text-ink text-[13.5px] leading-[1.5]">{r.label}</span>
              <span className="block font-body text-text-muted text-[12.5px] leading-[1.55] mt-1">{r.cond}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="px-5 py-4 sm:px-7 border-t border-line grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="font-body font-semibold text-text-sub text-[13px]">기술 스택</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="사용 기술">
            {s.tech.map((t) => (
              <li key={t} className="font-mono text-[11.5px] leading-none px-2 py-1.5 border border-line text-text-sub bg-base" style={{ borderRadius: 6 }}>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="이 페이지 목차" className="md:max-w-[300px]">
          <p className="font-body font-semibold text-text-sub text-[13px]">이 페이지</p>
          <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
            {toc
              .filter((t) => t.id !== 'summary')
              .map((t) => (
                <li key={t.id}>
                  <button type="button" onClick={() => onJump(t.id)} className="font-body text-[13px] text-navy underline decoration-line-strong underline-offset-4 hover:decoration-navy transition-colors">
                    {t.label}
                  </button>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}

/* ── 결과 표: 네이티브 표, 조건 열 필수 ── */
export function ResultsTable({
  rows,
  columns = ['항목', '결과', '측정 조건'],
}: {
  rows: ResultRow[]
  columns?: [string, string, string]
}) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b-2" style={{ borderColor: 'var(--color-navy)' }}>
            {columns.map((c) => (
              <th key={c} scope="col" className="font-body font-semibold text-[12px] tracking-[0.08em] text-text-muted py-2.5 pr-4">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-b border-line align-top">
              <th scope="row" className="font-body font-semibold text-ink text-[14px] leading-[1.55] py-3.5 pr-4 w-[22%]">
                {r.item}
              </th>
              <td className="font-body text-ink text-[14.5px] leading-[1.6] py-3.5 pr-4 w-[40%] tabular-nums break-keep">
                <RichText text={r.value} lines={false} />
              </td>
              <td className="font-body text-text-muted text-[13px] leading-[1.6] py-3.5 break-keep">
                <RichText text={r.cond} lines={false} terms={false} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── 설계 결정 카드 ── */
export function DecisionList({ items, onZoom }: { items: Decision[]; onZoom: (i: EvidenceItem) => void }) {
  return (
    <ol className="grid gap-10">
      {items.map((d, i) => (
        <li key={d.title} id={`decision-${i}`} className="scroll-mt-28">
          <Reveal>
            <article className={d.image ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start' : ''}>
              <div className="border-l-2 pl-5" style={{ borderColor: 'var(--color-navy)' }}>
                <p className="num font-semibold text-[13px] text-text-sub">결정 {i + 1}</p>
                <h3 className="font-body font-bold text-ink text-[17px] leading-[1.45] mt-1.5">{d.title}</h3>
                <p className="font-body text-text-sub text-[15px] leading-[1.8] mt-3 break-keep">
                  <RichText text={d.body} />
                </p>
                {d.record && (
                  <div className="mt-3">
                    <RecordChip record={d.record} />
                  </div>
                )}
              </div>
              {d.image && <ZoomFrame item={d.image} onZoom={onZoom} />}
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}

/* ── 검증: 첫 문장만 보이고 「자세히」로 펼침 ── */
export function CheckList({ items, initialOpen }: { items: Check[]; initialOpen?: string }) {
  return (
    <ol className="border-t border-line">
      {items.map((c, i) => (
        <CheckItem key={c.title} check={c} index={i} defaultOpen={initialOpen === `check-${i}`} />
      ))}
    </ol>
  )
}

function CheckItem({ check, index, defaultOpen }: { check: Check; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const sentences = splitSentences(check.body)
  const [first, ...rest] = sentences
  const panelId = `check-${index}-more`
  return (
    <li id={`check-${index}`} className="scroll-mt-28 border-b border-line py-6">
      <div className="grid gap-2 sm:grid-cols-[44px_minmax(0,1fr)]">
        <span className="num font-semibold text-[13px] text-text-sub pt-0.5">{index + 1}</span>
        <div className="min-w-0">
          <h3 className="font-body font-bold text-ink text-[16.5px] leading-[1.45]">{check.title}</h3>
          <p className="font-body text-text-sub text-[15px] leading-[1.8] mt-2 max-w-[70ch] break-keep">
            <RichText text={first ?? ''} lines={false} />
          </p>
          {rest.length > 0 && (
            <>
              <div
                id={panelId}
                className="grid transition-[grid-template-rows] duration-300"
                style={{ gridTemplateRows: open ? '1fr' : '0fr', transitionTimingFunction: 'var(--ease-default)' }}
              >
                <div className="overflow-hidden min-h-0" inert={!open}>
                  <p className="font-body text-text-sub text-[15px] leading-[1.8] max-w-[70ch] break-keep">
                    <RichText text={rest.join(' ')} />
                  </p>
                  {check.image && (
                    <div className="mt-5 mb-1 max-w-[620px]">
                      <EvidenceFrame item={check.image} large />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpen((o) => !o)}
                  className="font-body font-semibold text-[13px] text-navy hover:text-signal transition-colors inline-flex items-center gap-1"
                >
                  {open ? '접기' : '자세히'}
                  <span aria-hidden className="inline-block transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
                    ↓
                  </span>
                </button>
                {check.record && <RecordChip record={check.record} />}
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

/* ── AI 위임 네 칸 + 한 줄 사례 (+ 검증 방법 표) ── */
export function AiDelegation({ d }: { d: NonNullable<RoomData['delegation']> }) {
  const cells: [string, string][] = [
    ['AI에 맡긴 일', d.delegated],
    ['직접 한 일', d.did],
    ['검증 방법', d.verify],
    ['발견하고 고친 점', d.fixed],
  ]
  return (
    <div>
      <div className="grid gap-px overflow-hidden bg-line sm:grid-cols-2" style={{ borderRadius: 'var(--frame-radius)', border: 'var(--frame-border)' }}>
        {cells.map(([k, v], i) => (
          <div key={k} className={i === 0 ? 'bg-soft px-5 py-5 sm:px-6' : 'bg-panel px-5 py-5 sm:px-6'}>
            <p className="font-body font-semibold text-[12.5px] tracking-[0.06em]" style={{ color: i === 0 ? 'var(--color-text-muted)' : 'var(--color-navy)' }}>
              {k}
                          </p>
            <p className="font-body text-text-sub text-[14.5px] leading-[1.75] mt-2 break-keep">
              <RichText text={v} lines={false} />
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 border-l-2 pl-5" style={{ borderColor: 'var(--color-navy)' }}>
        <p className="font-body font-semibold text-[13px] text-navy">{d.caseLabel}</p>
        <p className="font-body text-ink text-[15px] leading-[1.8] mt-1.5 max-w-[70ch] break-keep">
          <RichText text={d.caseLine} />
        </p>
      </div>
      {d.methods && (
        <div className="mt-8">
          <p className="font-body font-semibold text-[13px] text-ink">이 연구에서 쓴 검증 방법</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <tbody>
                {d.methods.map((m) => (
                  <tr key={m.method} className="border-b border-line align-top">
                    <th scope="row" className="font-body font-semibold text-ink text-[13.5px] py-3 pr-4 w-[32%]">
                      {m.method}
                    </th>
                    <td className="font-body text-text-sub text-[13.5px] leading-[1.65] py-3">{m.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── 한계와 다음 행동 ── */
export function Limits({ items }: { items: RoomData['limits'] }) {
  return (
    <ul className="grid gap-px overflow-hidden bg-line sm:grid-cols-2" style={{ borderRadius: 'var(--frame-radius)', border: 'var(--frame-border)' }}>
      {items.map((l) => (
        <li key={l.title} className="bg-panel px-5 py-5 sm:[&:last-child:nth-child(odd)]:col-span-2">
          <p className="font-body font-bold text-ink text-[14.5px]">{l.title}</p>
          <p className="font-body text-text-sub text-[14px] leading-[1.75] mt-1.5 break-keep">
            <RichText text={l.body} lines={false} />
          </p>
        </li>
      ))}
    </ul>
  )
}

/* ── 증거 링크 ── */
export function LinksBlock({ items, citation }: { items: RoomData['links']; citation?: string }) {
  const navigate = useNavigate()
  return (
    <div>
      {citation && (
        <blockquote className="border-l-2 pl-5 mb-6 font-body text-text-sub text-[14px] leading-[1.75] max-w-[78ch]" style={{ borderColor: 'var(--color-navy)' }}>
          {citation}
        </blockquote>
      )}
      <ul className="border-t border-line">
        {items.map((l) => {
          const content = (
            <>
              <span className="font-body font-semibold text-ink text-[14.5px]">{l.label}</span>
              <span className="font-mono text-[12.5px] text-text-muted break-all">{l.note}</span>
              <span aria-hidden className="justify-self-end text-text-muted">
                {l.href ? (l.href.startsWith('/') ? '→' : '↗') : ''}
              </span>
            </>
          )
          const cls = 'grid grid-cols-[minmax(0,140px)_minmax(0,1fr)_20px] items-baseline gap-4 py-3.5'
          return (
            <li key={l.label} className="border-b border-line">
              {l.href ? (
                l.href.startsWith('/') ? (
                  <button type="button" onClick={() => navigate(l.href!)} className={`${cls} w-full text-left group hover:bg-soft/60 transition-colors`}>
                    {content}
                  </button>
                ) : (
                  <a href={l.href} target="_blank" rel="noreferrer" className={`${cls} group hover:bg-soft/60 transition-colors`}>
                    {content}
                  </a>
                )
              ) : (
                <div className={cls}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ── 클릭 확대 가능한 증거 프레임 ── */
export function ZoomFrame({ item, onZoom }: { item: EvidenceItem; onZoom: (i: EvidenceItem) => void }) {
  return <EvidenceFrame item={item} large onExpand={() => onZoom(item)} />
}
