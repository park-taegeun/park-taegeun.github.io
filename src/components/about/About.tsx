// 일하는 방식(About). 인물(사진·연락처) + 일하는 원칙 4개(각 한두 문장, 핵심 구절 틸 강조, 근거 링크 2개).
// 원칙은 주장만 두지 않고, 상세 페이지의 해당 블록으로 바로 이어진다. 이력(Timeline)은 별도 섹션으로 뺐다.
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PRINCIPLES, PROFILE, TIMELINE, type EvidenceLink, type Principle, type TimelineGroup, type TimelineItem } from '../../data/about'
import { projectByKey } from '../../data/projects'
import { scrollToId } from '../../lib/lenis'
import { onImgError } from '../../lib/placeholder'
import { crossfadeToRoom } from '../../lib/signature'
import Label, { labelEnClass as labelEn } from '../Label'
import Marked from '../Mark'

const aboutPad = { paddingBlock: 'clamp(64px, 8vw, 112px)' }

function useEvidenceNav() {
  const navigate = useNavigate()
  return (e: { project?: EvidenceLink['project']; tab?: string; anchor?: string; href?: string }) => {
    if (e.href) {
      window.open(e.href, '_blank', 'noopener,noreferrer')
      return
    }
    if (!e.project) return
    const suffix = `${e.tab ? `?tab=${e.tab}` : ''}${e.anchor ? `#${e.anchor}` : ''}`
    void crossfadeToRoom(projectByKey(e.project), navigate, suffix)
  }
}

export default function About() {
  return (
    <section id="about" aria-label="일하는 방식" className="relative overflow-hidden border-t border-line bg-soft/50">
      <div className="mx-auto max-w-[1200px] container-pad" style={aboutPad}>
        <Label as="p">How I work</Label>
        <h2 className="font-body font-bold text-ink mt-3 tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
          일하는 방식
        </h2>

        <div className="mt-9 grid gap-10 lg:grid-cols-[236px_minmax(0,1fr)] lg:items-start">
          <Identity />
          <Principles />
        </div>
      </div>
    </section>
  )
}

function Identity() {
  // 모바일·태블릿에서는 사진과 이름을 한 줄에 두어 원칙 카드가 첫 화면에 보이게 하고, 데스크톱에서는 세로 프로필.
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] items-start gap-x-4 sm:grid-cols-[120px_minmax(0,1fr)] lg:block">
      <figure className="w-full lg:w-[150px] bg-panel overflow-hidden" style={{ borderRadius: 16, border: 'var(--frame-border)', boxShadow: 'var(--shadow-soft)' }}>
        <div className="p-1.5 lg:p-2">
          <img
            src={PROFILE.portrait}
            alt={`${PROFILE.name} 프로필 사진`}
            onError={onImgError}
            loading="lazy"
            decoding="async"
            width={134}
            height={153}
            className="block w-full object-cover object-top"
            style={{ aspectRatio: '7 / 8', borderRadius: 8 }}
          />
        </div>
      </figure>

      <div className="min-w-0">
      <p className="font-display font-bold uppercase tracking-[-0.03em] text-ink text-[19px] lg:mt-4">{PROFILE.romanized}</p>
      <p className="font-body text-text-sub text-[12.5px] mt-0.5">
        {PROFILE.name} · {PROFILE.role}
      </p>

      <dl className="mt-4">
        <MetaRow
          k="Email"
          v={
            <a href={`mailto:${PROFILE.email}`} className="hover:text-ink transition-colors">
              {PROFILE.email}
            </a>
          }
        />
        <MetaRow
          k="GitHub"
          v={
            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">
              {PROFILE.githubHandle}
            </a>
          }
        />
      </dl>
      </div>
    </div>
  )
}

function MetaRow({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="border-t border-line py-2 grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-2">
      <dt className={labelEn}>{k}</dt>
      <dd className="font-body text-text-sub text-[12.5px] m-0 break-all">{v}</dd>
    </div>
  )
}

function Principles() {
  return (
    <ul className="grid gap-3.5 sm:grid-cols-2">
      {PRINCIPLES.map((p, i) => (
        <PrincipleCard key={p.en} item={p} n={i + 1} />
      ))}
    </ul>
  )
}

function PrincipleCard({ item, n }: { item: Principle; n: number }) {
  const go = useEvidenceNav()
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay: n * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col bg-panel p-5 sm:p-6"
      style={{ borderRadius: 'var(--frame-radius)', border: 'var(--frame-border)', boxShadow: 'var(--shadow-soft)' }}
    >
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono font-semibold text-[13px] text-signal" aria-hidden>
          {String(n).padStart(2, '0')}
        </span>
        <span className="font-display font-semibold uppercase tracking-[0.12em] text-text-muted text-[10.5px]">{item.en}</span>
      </div>
      <p className="font-body font-bold text-ink text-[17px] leading-[1.4] mt-2 break-keep">{item.title}</p>
      <p className="font-body text-text-sub text-[14.5px] leading-[1.7] mt-2 break-keep flex-1">
        <Marked text={item.body} mark={item.highlight} />
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${item.title} 근거`}>
        {item.evidence.map((e) => (
          <li key={e.label}>
            <button
              type="button"
              onClick={() => go(e)}
              className="group/ev inline-flex items-center gap-1.5 font-body text-[12.5px] text-navy px-2.5 py-1.5 rounded-full border border-line bg-base hover:border-navy transition-colors"
            >
              {e.label}
              <span aria-hidden className="text-signal transition-transform group-hover/ev:translate-x-0.5">
                {e.href ? '↗' : '→'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </motion.li>
  )
}

export function TimelineSection() {
  return (
    <section id="timeline" aria-label="이력" className="relative border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={aboutPad}>
        <Label as="p">Timeline</Label>
        <h2 className="font-body font-bold text-ink mt-3 tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
          이력
        </h2>
        <div className="mt-9 grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          {TIMELINE.map((g) => (
            <TimelineGroupView key={g.year} group={g} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineGroupView({ group }: { group: TimelineGroup }) {
  return (
    <div>
      <p className="font-body font-bold tracking-[-0.02em] text-ink text-[16px] leading-none border-b-2 pb-3" style={{ borderColor: 'var(--color-navy)' }}>
        {group.year}
      </p>
      <ul>
        {group.items.map((it) => (
          <TimelineEntry key={it.title} item={it} />
        ))}
      </ul>
    </div>
  )
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  const navigate = useNavigate()
  const linked = !!item.project || !!item.anchorId
  const open = () => {
    if (item.project) void crossfadeToRoom(projectByKey(item.project), navigate)
    else if (item.anchorId) scrollToId(item.anchorId)
  }
  // 이력서처럼 왼쪽에 기간, 오른쪽에 내용. 기간 열 폭을 고정해 날짜가 한 줄로 내려 읽힌다.
  const when = (
    <div className="flex items-center gap-2 sm:block">
      <p className="font-mono text-text-muted text-[12px] leading-[1.6] tabular-nums whitespace-nowrap">{item.period}</p>
      {item.ongoing && (
        <p className="inline-flex items-center gap-1.5 whitespace-nowrap sm:mt-1">
          <span aria-hidden className="h-[6px] w-[6px] rounded-full animate-pulse" style={{ background: 'var(--color-signal)' }} />
          <span className="font-body font-semibold text-[11px] text-signal">{item.ongoingLabel ?? '진행 중'}</span>
        </p>
      )}
    </div>
  )
  const body = (
    <div className="min-w-0">
      <p className={`font-body text-[14.5px] leading-[1.45] ${linked ? 'font-bold text-ink group-hover/t:underline underline-offset-4' : 'font-semibold text-ink'}`}>{item.title}</p>
      {item.org && <p className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-1">{item.org}</p>}
      {item.note && (
        <p className="font-body text-text-sub text-[13px] leading-[1.6] mt-1 max-w-[64ch]">
          {item.note} {linked && <span aria-hidden className="text-signal">→</span>}
        </p>
      )}
    </div>
  )
  const grid = 'grid gap-1.5 sm:grid-cols-[124px_minmax(0,1fr)] sm:gap-4'
  return (
    <li className="border-b border-line py-3.5">
      {linked ? (
        <button type="button" onClick={open} className={`group/t w-full text-left ${grid}`}>
          {when}
          {body}
        </button>
      ) : (
        <div className={grid}>
          {when}
          {body}
        </div>
      )}
    </li>
  )
}
