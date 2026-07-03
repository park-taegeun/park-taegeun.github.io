// 유사 제품 기능 비교표 — 발표자료 원본 표를 사이트 톤(네이티브 <table>)으로 재현.
// 팔레트 규율: 빨강 X 대신 딥틸 ●(지원) / 뮤트 ✕(미지원), 자사(띵동) 열은 딥틸 틴트 하이라이트.
// 반응형: 프레임 안에서 가로 스크롤 격리(overflow-x-auto)로 모바일 오버플로 0, 셀 텍스트는 실제 폰트라 390에서도 판독 가능.
import type { ComparisonTable as ComparisonTableData } from '../../data/rooms'
import { Sentences } from '../Sentences'

const TINT_HEAD = 'rgba(14,124,134,0.12)'
const TINT_BODY = 'rgba(14,124,134,0.05)'
const SIGNAL = 'var(--color-signal)'

function YesMark() {
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 rounded-full align-middle"
      style={{ background: SIGNAL }}
    />
  )
}

function NoMark() {
  return (
    <svg
      aria-hidden
      width="11"
      height="11"
      viewBox="0 0 12 12"
      className="inline-block align-middle text-text-faint"
    >
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function ComparisonTable({ table, ink }: { table: ComparisonTableData; ink: string }) {
  const { columns, rows, highlightCol, note, caption } = table

  return (
    <figure className="m-0">
      <div
        className="bg-panel overflow-hidden"
        style={{
          borderRadius: 'var(--frame-radius)',
          border: 'var(--frame-border)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left" style={{ minWidth: 340 }}>
            <caption className="sr-only">유사 제품 기능 비교표</caption>
            <colgroup>
              <col style={{ width: '27%' }} />
              {columns.map((c) => (
                <col key={c} style={{ width: `${73 / columns.length}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-line">
                <th
                  scope="col"
                  className="px-2.5 py-3.5 sm:px-4 font-body font-semibold text-[11px] sm:text-[13px] leading-tight break-keep"
                  style={{ color: 'var(--color-text-muted, #6b7280)' }}
                >
                  기능
                </th>
                {columns.map((c, i) => {
                  const hl = i === highlightCol
                  return (
                    <th
                      key={c}
                      scope="col"
                      className="px-1.5 py-3.5 sm:px-3 text-center font-body font-semibold text-[11px] sm:text-[13px] leading-tight [word-break:keep-all] [overflow-wrap:normal]"
                      style={{ color: hl ? SIGNAL : ink, background: hl ? TINT_HEAD : undefined }}
                    >
                      {c}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.feature} className={ri < rows.length - 1 ? 'border-b border-line' : undefined}>
                  <th
                    scope="row"
                    className="px-2.5 py-3.5 sm:px-4 text-left font-body font-semibold text-ink text-[12px] sm:text-[14px] leading-snug break-keep"
                  >
                    {row.feature}
                  </th>
                  {row.cells.map((yes, ci) => {
                    const hl = ci === highlightCol
                    return (
                      <td
                        key={ci}
                        className="px-1.5 py-3.5 sm:px-3 text-center align-middle"
                        style={{ background: hl ? TINT_BODY : undefined }}
                      >
                        {yes ? <YesMark /> : <NoMark />}
                        <span className="sr-only">{yes ? '지원' : '미지원'}</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {note && (
          <p className="border-t border-line px-3 py-2.5 sm:px-4 text-right font-mono text-[10.5px] sm:text-[11.5px] text-text-faint leading-snug break-keep">
            {note}
          </p>
        )}
      </div>
      {caption && (
        <figcaption className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-3 px-1 break-keep">
          <Sentences text={caption} />
        </figcaption>
      )}
    </figure>
  )
}
