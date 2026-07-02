// 카드뉴스 콜라주 — 주제별 그룹, 좌우 미러 교번, 첫 장 기본 최상위.
// 우측 그룹은 포지션 전체 좌우 반전 → 진짜 fan 방향이 교번됨.
// transform/opacity만(가드레일 §8). prefers-reduced-motion 대응.
import { useState } from 'react'
import type { EvidenceItem } from '../../data/rooms'

export interface CardGroup {
  label: string
  items: EvidenceItem[]
}

interface CardNewsStackProps {
  groups: CardGroup[]
  caption: string
}

const HERO_W = 36 // % — 첫 번째 카드 (그대로 유지)
const CARD_W = 27 // % — 나머지 카드 (약간 축소 + 간격 확대)

// 좌측 그룹 기준 포지션 (hero + 좌측 보조 + 우측 보조)
// l=left%, t=top%, rot=rotation(deg)
const HERO_BASE = { l: 28, t: 10, rot: -2 }
const L_SLOTS = [
  { l: 1,  t: 6,  rot: -7 },
  { l: 16, t: 21, rot:  5 },
  { l: 26, t: 13, rot: -3 },
]
const R_SLOTS = [
  { l: 52, t: 4,  rot: -4 },
  { l: 64, t: 18, rot:  7 },
  { l: 71, t: 26, rot: -5 },
  { l: 71, t: 8,  rot:  3 },
]

/** 카드 i의 left/top/rot/width/z 계산. flip=true이면 X축 미러 + rot 반전. */
function getPos(i: number, n: number, flip: boolean) {
  const side = n - 1
  const lCt  = Math.floor(side / 2)
  let raw: { l: number; t: number; rot: number }
  let w: number

  if (i === 0) {
    raw = HERO_BASE
    w   = HERO_W
  } else if (i <= lCt) {
    raw = L_SLOTS[(i - 1) % L_SLOTS.length]
    w   = CARD_W
  } else {
    raw = R_SLOTS[(i - lCt - 1) % R_SLOTS.length]
    w   = CARD_W
  }

  // z: hero 항상 최상위(n+3), 나머지는 인덱스 순서
  const z = i === 0 ? n + 3 : i + 1

  if (flip) {
    return { l: 100 - raw.l - w, t: raw.t, rot: -raw.rot, w, z }
  }
  return { l: raw.l, t: raw.t, rot: raw.rot, w, z }
}

function GroupStack({ group, align }: { group: CardGroup; align: 'left' | 'right' }) {
  // 첫 번째 카드(index 0)가 기본으로 최상위에 위치
  const [active, setActive] = useState<number | null>(0)
  const n   = group.items.length
  const flip = align === 'right'

  return (
    <div className={`flex flex-col ${flip ? 'items-end' : 'items-start'}`}>
      {/* 그룹 라벨 */}
      <p className="font-body font-semibold text-[11.5px] tracking-[0.12em] uppercase text-text-muted border-b border-line pb-2 mb-6">
        {group.label}
      </p>

      <div className="w-full" role="group" aria-label={`${group.label} 카드뉴스 ${n}장`}>
        {/* 모바일 — 3열 그리드 */}
        <div className="grid grid-cols-3 gap-2 md:hidden">
          {group.items.map(item => (
            <div
              key={item.src}
              className="bg-panel p-1"
              style={{ borderRadius: 10, border: 'var(--frame-border)', boxShadow: 'var(--shadow-soft)' }}
            >
              <div className="aspect-[4/5] overflow-hidden" style={{ borderRadius: 5 }}>
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑 — 겹침 팬 (aspect 18:10, 전체 너비 사용) */}
        <div className="hidden md:block relative" style={{ aspectRatio: '18/10' }}>
          {group.items.map((item, i) => {
            const isActive = active === i
            const { l, t, rot, w, z } = getPos(i, n, flip)

            return (
              <button
                key={item.src}
                type="button"
                aria-label={item.alt}
                aria-pressed={isActive}
                onClick={() => setActive(isActive ? null : i)}
                className="absolute cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{
                  left:    `${l}%`,
                  top:     `${t}%`,
                  width:   `${w}%`,
                  zIndex:  isActive ? 50 : z,
                  transform: isActive
                    ? 'rotate(0deg) scale(1.04)'
                    : `rotate(${rot}deg)`,
                  transition: 'transform 0.3s var(--ease-default)',
                  willChange: 'transform',
                }}
              >
                <div
                  className="bg-panel p-1.5"
                  style={{
                    borderRadius: 12,
                    border:      'var(--frame-border)',
                    boxShadow:   isActive
                      ? '0 14px 40px rgba(0,0,0,0.18)'
                      : 'var(--shadow-soft)',
                    transition: 'box-shadow 0.3s var(--ease-default)',
                  }}
                >
                  <div className="aspect-[4/5] overflow-hidden" style={{ borderRadius: 6 }}>
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="block w-full h-full object-cover"
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function CardNewsStack({ groups, caption }: CardNewsStackProps) {
  return (
    <figure role="group" aria-label="직접 제작한 카드뉴스 모음">
      <div className="flex flex-col gap-12 md:gap-16">
        {groups.map((group, gi) => (
          <GroupStack
            key={group.label}
            group={group}
            align={gi % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
      <figcaption className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-8 px-1">
        {caption}
      </figcaption>
    </figure>
  )
}
