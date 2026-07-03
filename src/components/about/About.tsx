// About / 소개 — Hero 다음 상단에 배치(자기소개).
// 인물 포지셔닝 + 일하는 원칙(의심·분리·책임·기록) + 이력·인정. 헤어라인·모노 라벨로 절제.
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { PRINCIPLES, PROFILE, TIMELINE, type Principle, type TimelineGroup, type TimelineItem } from '../../data/about'
import { scrollToId } from '../../lib/lenis'
import { onImgError } from '../../lib/placeholder'
import { splitSentences } from '../../lib/text'
import Label, { labelEnClass as labelEn } from '../Label'

const aboutPad = { paddingBlock: 'clamp(72px, 8vw, 120px)' }

export default function About() {
  return (
    <section id="about" aria-label="소개" className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={aboutPad}>
        <Label as="p">About</Label>
        <Headline />

        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
          <Identity />
          <Principles />
        </div>

        <Recognition />
      </div>
    </section>
  )
}

function Headline() {
  // '시스템 전체를 검증하고 책임집니다' 구절을 강조(밑줄)
  const EMPH = '시스템 전체를 검증하고 책임집니다'
  const [before, after] = PROFILE.headline.split(EMPH)
  return (
    <h2
      className="font-body font-bold text-ink mt-4 leading-[1.4]"
      style={{ fontSize: 'clamp(24px,3.2vw,40px)', letterSpacing: '-0.03em' }}
    >
      {before}
      <span
        style={{
          textDecorationLine: 'underline',
          textDecorationColor: 'var(--color-signal)',
          textDecorationThickness: '3px',
          textUnderlineOffset: '5px',
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
      <figure
        className="w-[150px] bg-panel overflow-hidden"
        style={{ borderRadius: 16, border: 'var(--frame-border)', boxShadow: 'var(--shadow-soft)' }}
      >
        <div className="p-2">
          <img
            src={PROFILE.portrait}
            alt={`${PROFILE.name} 프로필 사진`}
            onError={onImgError}
            loading="lazy"
            decoding="async"
            className="block w-full object-cover object-top"
            style={{ aspectRatio: '7 / 8', borderRadius: 8 }}
          />
        </div>
      </figure>

      <p className="font-display font-bold uppercase tracking-[-0.03em] text-ink text-[19px] mt-4">
        {PROFILE.romanized}
      </p>
      <p className="font-body text-text-muted text-[12.5px] mt-0.5">
        {PROFILE.name} · {PROFILE.role}
      </p>

      <dl className="mt-4">
        <MetaRow k="Role" v={PROFILE.role} />
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
    <div className="border-t border-line py-2 grid grid-cols-[58px_minmax(0,1fr)] items-baseline gap-3">
      <dt className={labelEn}>{k}</dt>
      <dd className="font-body text-text-sub text-[13px] m-0 truncate">{v}</dd>
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

// 원칙 본문 — 문장 경계에서 줄바꿈(다문장이면 문장마다 block), 핵심 문구는 굵게.
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
  return (
    <motion.li
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, delay: n * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-t border-line py-6 grid gap-3 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] sm:gap-7 lg:gap-9"
    >
      {/* hover 시 좌측 강조 라인 (transform scaleY만 사용) */}
      <span
        aria-hidden
        className="absolute left-0 top-6 bottom-6 w-[2px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{ background: 'var(--color-navy)' }}
      />
      <div className="flex items-baseline gap-3 sm:flex-col sm:gap-2 sm:pl-4">
        <span
          className="font-display font-bold text-[40px] leading-[0.85] text-text-faint transition-colors duration-300 group-hover:text-[var(--color-signal)]"
          style={{ letterSpacing: '-0.04em' }}
        >
          {String(n).padStart(2, '0')}
        </span>
        <div className="sm:mt-1">
          <p className="font-display font-semibold uppercase tracking-[0.12em] text-text-muted text-[11px]">
            {item.en}
          </p>
          <p className="font-body font-bold text-ink text-[15px] leading-[1.35] mt-0.5">{item.title}</p>
        </div>
      </div>
      <p className="font-body text-text-sub text-[14.5px] leading-[1.78] sm:pt-1.5 break-keep">
        <PrincipleBody body={item.body} highlight={item.highlight} />
      </p>
    </motion.li>
  )
}

function Recognition() {
  return (
    <section aria-label="이력과 인정" className="mt-14">
      <div className="flex items-baseline gap-3">
        <Label as="h3">Recognition</Label>
        <span className="font-body text-text-muted text-[13px]">활동하고, 인정받은 것들.</span>
      </div>

      {/* 좌측 레일 타임라인 — 중앙선 지그재그 대신, 좌측 정렬·스캔성 유지(§8 박스 금지) */}
      <div className="relative mt-8 sm:pl-7">
        <span
          aria-hidden
          className="absolute left-[3px] top-1.5 bottom-1.5 w-px bg-line hidden sm:block"
        />
        <div className="flex flex-col gap-9">
          {TIMELINE.map((g) => (
            <TimelineRow key={g.year} group={g} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineRow({ group }: { group: TimelineGroup }) {
  return (
    <div className="relative">
      {/* 연도 노드 (레일 위 점) */}
      <span
        aria-hidden
        className="absolute -left-7 top-[5px] hidden sm:block h-[7px] w-[7px] rounded-full ring-4 ring-base"
        style={{ background: 'var(--color-ink)' }}
      />
      <p className="font-display font-bold tracking-[-0.02em] text-ink text-[19px] leading-none">{group.year}</p>
      <ul className="mt-3">
        {group.items.map((it) => (
          <TimelineEntry key={it.title} item={it} />
        ))}
      </ul>
    </div>
  )
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  const { link } = item
  // 위계: 수상·진행 중 = 또렷한 ink 굵게 / 단순 활동 = 한 톤 죽여 노이즈 축소
  const emphasized = !!item.award || !!item.ongoing
  return (
    <li className="border-t border-line first:border-t-0 py-3.5">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5">
        {item.award && (
          <span
            className="font-body font-bold text-[10px] leading-none uppercase tracking-[0.08em] px-2 py-1 border rounded-full whitespace-nowrap"
            style={{ color: 'var(--color-signal)', borderColor: 'var(--color-signal)' }}
          >
            {item.award}
          </span>
        )}
        <p
          className={`font-body text-[15px] leading-[1.4] ${emphasized ? 'font-bold text-ink' : 'font-medium text-text-sub'}`}
        >
          {item.title}
        </p>
        {item.ongoing && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span
              aria-hidden
              className="h-[6px] w-[6px] rounded-full animate-pulse"
              style={{ background: 'var(--color-signal)' }}
            />
            <span className="font-body font-semibold text-[10.5px] tracking-[0.04em]" style={{ color: 'var(--color-signal)' }}>
              진행 중
            </span>
          </span>
        )}
        <span className="font-body text-text-muted text-[12px] ml-auto whitespace-nowrap">{item.period}</span>
      </div>
      {item.org && <p className="font-body text-text-muted text-[12px] leading-[1.5] mt-1">{item.org}</p>}
      {item.note && <p className="font-body text-text-sub text-[13px] leading-[1.6] mt-1 max-w-[64ch]">{item.note}</p>}
      {link && (
        <button
          type="button"
          onClick={() => scrollToId(link.anchorId)}
          className="group/link font-body font-semibold text-[12px] tracking-[0.04em] mt-2 inline-flex items-center gap-1"
          style={{ color: link.color }}
        >
          <span aria-hidden className="shrink-0 transition-transform group-hover/link:translate-x-0.5">→</span>
          <span className="min-w-0 break-keep group-hover/link:underline underline-offset-4">
            {link.label}{link.suffix ?? '에서 활용'}
          </span>
        </button>
      )}
    </li>
  )
}
