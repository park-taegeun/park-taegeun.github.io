// 문장 단위 줄바꿈 렌더 — 다문장 본문에서 새 문장이 새 줄에서 시작하게.
// 각 문장을 block으로 감싼다(줄 안에서는 keep-all로 어절 단위 wrap). 단일 문장은 그대로(과교정 방지).
import { type ReactNode } from 'react'
import { splitSentences } from '../lib/text'

export function Sentences({ text }: { text: string }): ReactNode {
  const parts = splitSentences(text)
  if (parts.length <= 1) return text
  return parts.map((s, i) => (
    <span key={i} className="block">
      {s}
    </span>
  ))
}

/**
 * 앞에 인라인 라벨(예: "핵심 판단:")이 붙는 본문 — 첫 문장은 라벨과 같은 줄에서 이어지고,
 * 이후 문장만 새 줄로 내려 문장 경계를 살린다.
 */
export function SentencesAfterLabel({ text }: { text: string }): ReactNode {
  const parts = splitSentences(text)
  if (parts.length <= 1) return text
  return parts.map((s, i) =>
    i === 0 ? (
      s
    ) : (
      <span key={i} className="block">
        {s}
      </span>
    ),
  )
}
