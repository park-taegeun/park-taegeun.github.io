// 포인트 컬러 강조. text 안에서 mark 구절 하나만 틸 형광펜으로 칠한다(없으면 그대로).
export default function Marked({ text, mark, strong = false }: { text: string; mark?: string; strong?: boolean }) {
  if (!mark) return <>{text}</>
  const at = text.indexOf(mark)
  if (at === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <span className={strong ? 'mark-strong' : 'mark'}>{mark}</span>
      {text.slice(at + mark.length)}
    </>
  )
}
