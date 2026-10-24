// 본문 렌더러: 문장 단위 줄바꿈 + 용어 툴팁.
// 본문은 인사담당자가 읽기 쉽게 두고, 정밀한 정의는 점선 밑줄 툴팁이 맡는다(구성안 2절 공통 장치).
// 한 RichText 안에서 같은 용어는 첫 등장에만 툴팁을 단다.
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { GLOSSARY, GLOSSARY_TERMS } from '../data/glossary'
import { splitSentences } from '../lib/text'

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const TERM_RE = new RegExp(GLOSSARY_TERMS.map(escape).join('|'), 'g')

function withTerms(text: string, used: Set<string>, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(TERM_RE)) {
    const term = m[0]
    if (used.has(term)) continue
    used.add(term)
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    out.push(
      <Term key={`${keyBase}-${at}`} term={term}>
        {term}
      </Term>,
    )
    last = at + term.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

interface RichTextProps {
  text: string
  /** 문장마다 줄을 바꿀지(다문장 본문). 기본 true */
  lines?: boolean
  /** 용어 툴팁. 기본 true */
  terms?: boolean
}

export default function RichText({ text, lines = true, terms = true }: RichTextProps) {
  const used = new Set<string>()
  const parts = lines ? splitSentences(text) : [text]
  if (parts.length <= 1) return <>{terms ? withTerms(text, used, 's0') : text}</>
  return (
    <>
      {parts.map((s, i) => (
        <span key={i} className="block">
          {terms ? withTerms(s, used, `s${i}`) : s}
        </span>
      ))}
    </>
  )
}

export function Term({ term, children }: { term: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [align, setAlign] = useState<'left' | 'right'>('left')
  const [below, setBelow] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const id = useId()
  const def = GLOSSARY[term]

  useLayoutEffect(() => {
    if (!open || !btn.current) return
    const r = btn.current.getBoundingClientRect()
    const w = Math.min(300, window.innerWidth * 0.8)
    setAlign(r.left + w > window.innerWidth - 16 ? 'right' : 'left')
    setBelow(r.top < 150)
  }, [open])

  if (!def) return <>{children}</>
  return (
    <span className="relative inline">
      <button
        ref={btn}
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="inline p-0 m-0 bg-transparent border-0 text-inherit cursor-help underline decoration-dotted decoration-[1.5px] underline-offset-[4px]"
        style={{ font: 'inherit', textDecorationColor: 'var(--color-signal)', letterSpacing: 'inherit' }}
      >
        {children}
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`absolute z-40 block w-[min(300px,80vw)] rounded-[10px] px-3.5 py-3 text-left font-body font-normal text-[12.5px] leading-[1.65] tracking-normal text-white ${
            below ? 'top-full mt-2' : 'bottom-full mb-2'
          } ${align === 'left' ? 'left-0' : 'right-0'}`}
          style={{ background: 'var(--color-ink)', boxShadow: '0 10px 28px rgba(16,26,44,0.22)' }}
        >
          <span className="block font-semibold text-[11.5px] tracking-[0.04em] mb-1" style={{ color: 'var(--color-signal-bright)' }}>
            {term}
          </span>
          {def}
        </span>
      )}
    </span>
  )
}
