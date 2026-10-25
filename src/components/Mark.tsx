// 강조 규칙(색에 의미를 둔다):
//  value  = 실제로 측정한 값 → 포인트 컬러(청록) + 고정폭 숫자. 사이트 전체에서 청록은 이 용도로만 쓴다.
//  strong = 문장 안의 핵심 구절 → 색 없이 굵기만.
export default function Marked({ text, mark, as = 'strong' }: { text: string; mark?: string; as?: 'value' | 'strong' }) {
  if (!mark) return <>{text}</>
  const at = text.indexOf(mark)
  if (at === -1) return <>{text}</>
  const cls = as === 'value' ? 'font-bold text-signal-deep tabular-nums' : 'font-semibold text-ink'
  return (
    <>
      {text.slice(0, at)}
      <span className={cls}>{mark}</span>
      {text.slice(at + mark.length)}
    </>
  )
}
