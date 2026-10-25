// 일하는 방식(About) + 이력(Timeline).
// 원칙 4개는 한두 문장과 근거 링크 2개씩. 근거 링크는 상세 페이지의 해당 블록으로 바로 간다.
// 사진·연락처는 첫 화면과 마무리 섹션에 있으므로 여기서는 두지 않는다.
import { useNavigate } from 'react-router-dom'
import { PRINCIPLES, TIMELINE, type EvidenceLink, type Principle, type TimelineGroup, type TimelineItem } from '../../data/about'
import { projectByKey } from '../../data/projects'
import { scrollToId } from '../../lib/lenis'
import { crossfadeToRoom } from '../../lib/signature'
import Marked from '../Mark'

const sectionPad = { paddingBlock: 'clamp(56px, 6vw, 96px)' }
const h2Style = { fontSize: 'clamp(26px,3vw,34px)' }

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
    <section id="about" aria-label="일하는 방식" className="relative border-t border-line bg-soft/50">
      <div className="mx-auto max-w-[1200px] container-pad" style={sectionPad}>
        <h2 className="font-body font-bold text-ink tracking-[-0.03em]" style={h2Style}>
          일하는 방식
        </h2>
        <ul className="mt-8 grid gap-x-14 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <PrincipleItem key={p.en} item={p} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function PrincipleItem({ item }: { item: Principle }) {
  const go = useEvidenceNav()
  return (
    <li className="border-t border-line-strong pt-5 pb-9">
      <p className="font-body font-bold text-[18px] leading-[1.4] text-ink break-keep">{item.title}</p>
      <p className="mt-2 max-w-[44ch] font-body text-[15px] leading-[1.7] text-text-sub break-keep">
        <Marked text={item.body} mark={item.highlight} />
      </p>
      <p className="mt-3.5 flex flex-wrap items-baseline gap-x-4 gap-y-1.5 font-body text-[13.5px]">
        <span className="font-semibold text-text-sub">근거</span>
        {item.evidence.map((e) => (
          <button
            key={e.label}
            type="button"
            onClick={() => go(e)}
            className="font-semibold text-navy underline decoration-line-strong decoration-1 underline-offset-[5px] transition-colors hover:decoration-navy"
          >
            {e.label}
            {e.href && <span aria-hidden> ↗</span>}
          </button>
        ))}
      </p>
    </li>
  )
}

export function TimelineSection() {
  return (
    <section id="timeline" aria-label="이력" className="relative border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={sectionPad}>
        <h2 className="font-body font-bold text-ink tracking-[-0.03em]" style={h2Style}>
          이력
        </h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
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
      <p className="border-b border-line-strong pb-3 font-body font-bold text-[15px] leading-none text-ink">{group.year}</p>
      <ul>
        {group.items.map((it) => (
          <TimelineEntry key={it.title} item={it} />
        ))}
      </ul>
    </div>
  )
}

// 프로젝트 행은 제목·소속·기간만(설명은 프로젝트 탭에 있다). 학업·자격 행은 내용(note)을 보여 준다.
function TimelineEntry({ item }: { item: TimelineItem }) {
  const navigate = useNavigate()
  const linked = !!item.project || !!item.anchorId
  const open = () => {
    if (item.project) void crossfadeToRoom(projectByKey(item.project), navigate)
    else if (item.anchorId) scrollToId(item.anchorId)
  }
  const sub = linked ? item.org : item.note
  const body = (
    <span className="grid items-baseline gap-x-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <span className="min-w-0">
        <span className={`block font-body font-semibold text-[15px] leading-[1.45] text-ink break-keep ${linked ? 'group-hover/t:underline underline-offset-4' : ''}`}>{item.title}</span>
        {sub && <span className="mt-0.5 block font-body text-[13.5px] leading-[1.55] text-text-sub break-keep">{sub}</span>}
      </span>
      <span className="num mt-1 text-[13px] text-text-sub sm:mt-0 sm:whitespace-nowrap sm:text-right">{item.period}</span>
    </span>
  )
  return (
    <li className="border-b border-line">
      {linked ? (
        <button type="button" onClick={open} className="group/t block w-full py-3.5 text-left">
          {body}
        </button>
      ) : (
        <div className="py-3.5">{body}</div>
      )}
    </li>
  )
}
