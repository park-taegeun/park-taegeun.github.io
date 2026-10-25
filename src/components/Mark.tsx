// 강조. text 안에서 mark 구절 하나만 강조한다(없으면 그대로).
//  highlight(기본) = 틸 형광펜(첫 화면 헤드라인, 일하는 방식의 핵심 구절)
//  value           = 측정값(프로젝트 패널의 결과 줄): 청록 글자 + 고정폭 숫자
//  strong          = 색 없이 굵기만
export default function Marked({ text, mark, as = 'highlight' }: { text: string; mark?: string; as?: 'highlight' | 'value' | 'strong' }) {
  if (!mark) return <>{text}</>
  const at = text.indexOf(mark)
  if (at === -1) return <>{text}</>
  const cls = as === 'value' ? 'font-bold text-signal-deep tabular-nums' : as === 'strong' ? 'font-semibold text-ink' : 'mark'
  return (
    <>
      {text.slice(0, at)}
      <span className={cls}>{mark}</span>
      {text.slice(at + mark.length)}
    </>
  )
}
