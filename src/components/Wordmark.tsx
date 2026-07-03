// Hero 워드마크 — PORTFOLIO(크게·타이트) / PARK TAEGEUN(같은 폭 바이라인) 두 줄을 동일 폭(1000)으로 잠근다.
// Space Grotesk 디스플레이. textLength로 자간을 등폭 스택 락업.
export default function Wordmark({ className = '', maxW = '820px' }: { className?: string; maxW?: string }) {
  return (
    <h1 aria-label="PORTFOLIO · PARK TAEGEUN" className={className}>
      <svg
        viewBox="0 0 1000 352"
        aria-hidden
        focusable="false"
        className="block w-full"
        style={{ maxWidth: maxW }}
      >
        <text
          x="0"
          y="194"
          textLength="1000"
          lengthAdjust="spacing"
          fontSize="188"
          fontWeight="700"
          fill="var(--color-navy)"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          PORTFOLIO
        </text>
        <text
          x="0"
          y="330"
          textLength="1000"
          lengthAdjust="spacing"
          fontSize="52"
          fontWeight="500"
          fill="var(--color-text-muted)"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          PARK TAEGEUN
        </text>
      </svg>
    </h1>
  )
}
