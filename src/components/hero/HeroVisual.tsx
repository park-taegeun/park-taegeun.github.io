// Hero 비주얼 — 재측정 모티프: 오디오 길이(x) vs 출력 길이(y) 상관 산점도.
// 상태가 base(r=0.024) → attention LoRA(0.128) → 융합 통로 LoRA(0.755)로 전환되며
// 흩어진 점이 대각선을 따라 정렬되고 회귀선 기울기가 살아난다. 색은 회색(개입 전) → 틸(검증됨).
// reduced-motion이면 최종 정렬 상태(r=0.755)를 정적으로 표시.
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

const CLAIMED = '#9AA6B4'
const SIGNAL = '#0E7C86'

// 좌표계 (데이터 0..1 → 픽셀)
const W = 440
const H = 320
const PAD = { l: 44, r: 22, t: 20, b: 40 }
const px = (x: number) => PAD.l + x * (W - PAD.l - PAD.r)
const py = (y: number) => H - PAD.b - y * (H - PAD.t - PAD.b)

// x=오디오 길이(고정), yb=흩어진 base, yf=정렬된 fusion
const PTS: { x: number; yb: number; yf: number }[] = [
  { x: 0.08, yb: 0.52, yf: 0.14 },
  { x: 0.14, yb: 0.44, yf: 0.2 },
  { x: 0.2, yb: 0.6, yf: 0.24 },
  { x: 0.27, yb: 0.38, yf: 0.33 },
  { x: 0.33, yb: 0.56, yf: 0.3 },
  { x: 0.4, yb: 0.47, yf: 0.44 },
  { x: 0.46, yb: 0.63, yf: 0.42 },
  { x: 0.52, yb: 0.41, yf: 0.55 },
  { x: 0.58, yb: 0.58, yf: 0.53 },
  { x: 0.64, yb: 0.49, yf: 0.66 },
  { x: 0.7, yb: 0.62, yf: 0.64 },
  { x: 0.76, yb: 0.44, yf: 0.72 },
  { x: 0.82, yb: 0.57, yf: 0.78 },
  { x: 0.88, yb: 0.5, yf: 0.83 },
  { x: 0.93, yb: 0.6, yf: 0.9 },
  { x: 0.5, yb: 0.53, yf: 0.5 },
]

// 단계별 회귀선(y = m·x + b)과 상관계수
const STAGES = [
  { key: 'base', label: 'base', r: 0.024, m: 0.03, b: 0.5, mix: 0 },
  { key: 'attn', label: 'attention LoRA', r: 0.128, m: 0.35, b: 0.32, mix: 0.35 },
  { key: 'fusion', label: '융합 통로 LoRA', r: 0.755, m: 0.78, b: 0.06, mix: 1 },
] as const

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function HeroVisual() {
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(reduced ? 2 : 0)
  const r = useMotionValue(reduced ? 0.755 : 0.024)
  const rText = useTransform(r, (v) => v.toFixed(3))

  useEffect(() => {
    if (reduced) return
    let alive = true
    const timers: ReturnType<typeof setTimeout>[] = []
    const run = () => {
      // base → attn → fusion, 각 단계 유지 후 다시 처음으로 (조용한 반복)
      const seq = [
        { s: 1, at: 1400 },
        { s: 2, at: 3000 },
        { s: 0, at: 8000 },
      ]
      for (const step of seq) {
        timers.push(
          setTimeout(() => {
            if (!alive) return
            setStage(step.s)
            animate(r, STAGES[step.s].r, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })
            if (step.s === 0) run() // loop
          }, step.at),
        )
      }
    }
    run()
    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
  }, [reduced, r])

  const st = STAGES[stage]
  const isSignal = stage === 2
  const color = isSignal ? SIGNAL : CLAIMED

  // 회귀선 양끝
  const lineX0 = px(0)
  const lineY0 = py(st.b)
  const lineX1 = px(1)
  const lineY1 = py(st.m + st.b)

  return (
    <figure
      className="w-full"
      role="img"
      aria-label="오디오 길이 대비 출력 길이 상관 산점도. 융합 통로 재학습으로 상관계수가 0.024에서 0.755로 회복된다."
    >
      <div
        className="bg-panel"
        style={{
          borderRadius: 'var(--frame-radius)',
          border: 'var(--frame-border)',
          boxShadow: 'var(--shadow-frame)',
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="presentation">
          {/* 격자 */}
          {[0, 0.25, 0.5, 0.75, 1].map((g) => (
            <g key={g}>
              <line x1={px(g)} y1={py(0)} x2={px(g)} y2={py(1)} stroke="var(--color-line)" strokeWidth={1} />
              <line x1={px(0)} y1={py(g)} x2={px(1)} y2={py(g)} stroke="var(--color-line)" strokeWidth={1} />
            </g>
          ))}
          {/* 축 */}
          <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(0)} stroke="var(--color-line-strong)" strokeWidth={1.4} />
          <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(1)} stroke="var(--color-line-strong)" strokeWidth={1.4} />

          {/* 정답(ref) 대각선 — r=0.739, 항상 옅은 점선 */}
          <line
            x1={px(0)}
            y1={py(0.05)}
            x2={px(1)}
            y2={py(0.79)}
            stroke={SIGNAL}
            strokeWidth={1.2}
            strokeDasharray="4 4"
            opacity={0.4}
          />

          {/* 회귀선 — initial로 y1/y2 기본값 지정(reduced-motion 시 undefined 좌표 방지) */}
          <motion.line
            x1={lineX0}
            x2={lineX1}
            initial={{ y1: lineY0, y2: lineY1 }}
            animate={{ y1: lineY0, y2: lineY1, stroke: color }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            strokeWidth={2.2}
            strokeLinecap="round"
          />

          {/* 점 */}
          {PTS.map((p, i) => {
            const y = lerp(p.yb, p.yf, st.mix)
            return (
              <motion.circle
                key={i}
                cx={px(p.x)}
                initial={{ cy: py(y) }}
                animate={{ cy: py(y), fill: color }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: i * 0.012 }}
                r={4.4}
                opacity={0.9}
              />
            )
          })}

          {/* 축 라벨 (mono) */}
          <text x={px(0.5)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--color-text-faint)" fontFamily="var(--font-mono)">
            audio length
          </text>
          <text
            x={14}
            y={py(0.5)}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-text-faint)"
            fontFamily="var(--font-mono)"
            transform={`rotate(-90 14 ${py(0.5)})`}
          >
            output length
          </text>
        </svg>

        {/* 상태·상관계수 표시 (mono) */}
        <div className="flex items-center justify-between gap-3 px-4 pb-3.5 pt-1">
          <span
            className="font-mono text-[12px] tracking-tight"
            style={{ color: isSignal ? SIGNAL : 'var(--color-text-muted)' }}
          >
            {st.label}
          </span>
          <span className="font-mono text-[12px] text-text-muted">
            r: <span className="text-text-faint">0.024</span> →{' '}
            <motion.span style={{ color: isSignal ? SIGNAL : 'var(--color-text-sub)' }}>{rText}</motion.span>
          </span>
        </div>
      </div>
    </figure>
  )
}
