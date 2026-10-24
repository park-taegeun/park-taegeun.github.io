// About. 인물 소개(사진·연락처) + 소개 세 줄 + 일하는 원칙 4개(각각 근거 링크 2개) + 이력 요약.
// 원칙은 주장만 두지 않고, 상세 페이지의 해당 블록으로 바로 이어진다(구성안 3절 3번).
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PRINCIPLES, PROFILE, TIMELINE, type EvidenceLink, type Principle, type TimelineGroup, type TimelineItem } from '../../data/about'
import { projectByKey } from '../../data/projects'
import { scrollToId } from '../../lib/lenis'
import { onImgError } from '../../lib/placeholder'
import { crossfadeToRoom } from '../../lib/signature'
import { splitSentences } from '../../lib/text'
import Label, { labelEnClass as labelEn } from '../Label'

const aboutPad = { paddingBlock: 'clamp(72px, 8vw, 120px)' }

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
    <section id="about" aria-label="소개" className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={aboutPad}>
        <Label as="p">About</Label>
        <Headline />
        <div className="mt-5 max-w-[68ch]">
          {PROFILE.intro.map((line) => (
            <p key={line} className="font-body text-text-sub text-[16px] leading-[1.8] break-keep">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
          <Identity />
          <Principles />
        </div>

        <Timeline />
      </div>
    </section>
  )
}

function Headline() {
  const EMPH = PROFILE.headlineEmphasis
  const [before, after] = PROFILE.headline.split(EMPH)
  return (
    <h2 className="font-body font-bold text-ink mt-4 leading-[1.4] break-keep" style={{ fontSize: 'clamp(24px,3.2vw,40px)', letterSpacing: '-0.03em' }}>
      {before}
      <span
        style={{
          textDecorationLine: 'underline',
          textDecorationColor: 'var(--color-signal)',
          textDecorationThickness: '3px',
          textUnderlineOffset: '6px',
        }}
      >
        {EMPH}
      </span>
      {after}
    </h2>
  )
}

function Identity() {
  return (
    <div>
      <figure className="w-[150px] bg-panel overflow-hidden" style={{ borderRadius: 16, border: 'var(--frame-border)', boxShadow: 'var(--shadow-soft)' }}>
        <div className="p-2">
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

      <p className="font-display font-bold uppercase tracking-[-0.03em] text-ink text-[19px] mt-4">{PROFILE.romanized}</p>
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
    <div className="border-t border-line pt-6 lg:border-t-0 lg:pt-0">
      <Label as="h3">How I work</Label>
      <ul className="mt-3">
        {PRINCIPLES.map((p, i) => (
          <PrincipleRow key={p.en} item={p} n={i + 1} />
        ))}
      </ul>
    </div>
  )
}

function PrincipleBody({ body, highlight }: { body: string; highlight: string }) {
  const sentences = splitSentences(body)
  const multi = sentences.length > 1
  return (
    <>
      {sentences.map((s, i) => {
        const idx = s.indexOf(highlight)
        const content =
          idx === -1 ? (
            s
          ) : (
            <>
              {s.slice(0, idx)}
              <strong className="font-semibold text-ink">{highlight}</strong>
              {s.slice(idx + highlight.length)}
            </>
          )
        return (
          <span key={i} className={multi ? 'block' : undefined}>
            {content}
          </span>
        )
      })}
    </>
  )
}

function PrincipleRow({ item, n }: { item: Principle; n: number }) {
  const go = useEvidenceNav()
  return (
    <motion.li
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, delay: n * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-t border-line py-6 grid gap-3 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] sm:gap-7 lg:gap-9"
    >
      <span
        aria-hidden
        className="absolute left-0 top-6 bottom-6 w-[2px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{ background: 'var(--color-navy)' }}
      />
      <div className="flex items-baseline gap-3 sm:flex-col sm:gap-2 sm:pl-4">
        <span className="font-display font-bold text-[40px] leading-[0.85] text-line-strong transition-colors duration-300 group-hover:text-[var(--color-signal)]" style={{ letterSpacing: '-0.04em' }} aria-hidden>
          {String(n).padStart(2, '0')}
        </span>
        <div className="sm:mt-1">
          <p className="font-display font-semibold uppercase tracking-[0.12em] text-text-muted text-[11px]">{item.en}</p>
          <p className="font-body font-bold text-ink text-[15px] leading-[1.35] mt-0.5">{item.title}</p>
        </div>
      </div>
      <div className="sm:pt-1.5">
        <p className="font-body text-text-sub text-[14.5px] leading-[1.78] break-keep">
          <PrincipleBody body={item.body} highlight={item.highlight} />
        </p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${item.title} 근거`}>
          <li className="font-body font-semibold text-[11.5px] text-text-muted self-center mr-1">근거 보기</li>
          {item.evidence.map((e) => (
            <li key={e.label}>
              <button
                type="button"
                onClick={() => go(e)}
                className="group/ev inline-flex items-center gap-1.5 font-body text-[12.5px] text-navy px-2.5 py-1.5 rounded-full border border-line bg-panel hover:border-navy transition-colors"
              >
                {e.label}
                <span aria-hidden className="text-signal transition-transform group-hover/ev:translate-x-0.5">
                  {e.href ? '↗' : '→'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  )
}

function Timeline() {
  return (
    <section aria-label="이력" className="mt-16">
      <div className="flex items-baseline gap-3">
        <Label as="h3">Timeline</Label>
        <span className="font-body text-text-sub text-[13px]">연구·프로젝트와 학업·자격</span>
      </div>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        {TIMELINE.map((g) => (
          <TimelineGroupView key={g.year} group={g} />
        ))}
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
  const head = (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <p className={`font-body text-[14.5px] leading-[1.45] ${linked ? 'font-bold text-ink group-hover/t:underline underline-offset-4' : 'font-semibold text-ink'}`}>{item.title}</p>
      {item.ongoing && (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span aria-hidden className="h-[6px] w-[6px] rounded-full animate-pulse" style={{ background: 'var(--color-signal)' }} />
          <span className="font-body font-semibold text-[10.5px] tracking-[0.04em] text-signal">진행 중</span>
        </span>
      )}
      <span className="font-mono text-text-muted text-[11.5px] ml-auto whitespace-nowrap">{item.period}</span>
    </div>
  )
  return (
    <li className="border-b border-line py-3.5">
      {linked ? (
        <button type="button" onClick={open} className="group/t block w-full text-left">
          {head}
          {item.org && <p className="font-body text-text-muted text-[12px] leading-[1.5] mt-1">{item.org}</p>}
          {item.note && (
            <p className="font-body text-text-sub text-[13px] leading-[1.6] mt-1 max-w-[64ch]">
              {item.note} <span aria-hidden className="text-signal">→</span>
            </p>
          )}
        </button>
      ) : (
        <>
          {head}
          {item.note && <p className="font-body text-text-sub text-[13px] leading-[1.6] mt-1 max-w-[64ch]">{item.note}</p>}
        </>
      )}
    </li>
  )
}
