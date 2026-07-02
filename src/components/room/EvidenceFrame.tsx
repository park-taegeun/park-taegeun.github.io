// 증거 액자 — 실제 화면·사진이 주인공(가드레일: 장식이 증거를 가리지 않기).
// 프레임 토큰(design-system §9): radius 24 / 옅은 보더 / 깊은 그림자. 호버 = 살짝 기울어짐 + 확대(transform만).
import type { EvidenceItem } from '../../data/rooms'
import { onImgError } from '../../lib/placeholder'

interface EvidenceFrameProps {
  item: EvidenceItem
  /** 지그재그 기울임 방향 (인덱스 교차) — Tailwind 정적 클래스 2종으로 분기 */
  tiltDir?: 1 | -1
  /** 대표 화면(MainWall)이면 기울임 없이 미세 확대만 */
  large?: boolean
}

export default function EvidenceFrame({ item, tiltDir = 1, large = false }: EvidenceFrameProps) {
  const hover = large
    ? 'group-hover:scale-[1.01]'
    : tiltDir === 1
      ? 'group-hover:scale-[1.02] group-hover:rotate-[0.8deg]'
      : 'group-hover:scale-[1.02] group-hover:-rotate-[0.8deg]'

  return (
    <figure className="group">
      <div
        className={`bg-panel overflow-hidden transition-transform duration-300 will-change-transform ${hover}`}
        style={{
          borderRadius: 'var(--frame-radius)',
          border: 'var(--frame-border)',
          boxShadow: 'var(--shadow-frame)',
          transitionTimingFunction: 'var(--ease-default)',
        }}
      >
        <div className={large ? 'p-3 md:p-4' : 'p-2.5'}>
          {/* 대표 화면(large)은 룸 진입 직후 첫 페인트 — lazy면 LCP 저하 */}
          <img
            src={item.src}
            alt={item.alt}
            onError={onImgError}
            loading={large ? 'eager' : 'lazy'}
            fetchPriority={large ? 'high' : undefined}
            decoding="async"
            className="block w-full h-auto"
            style={{ borderRadius: 'calc(var(--frame-radius) - 10px)' }}
          />
        </div>
      </div>
      <figcaption className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-3 px-1">
        {item.caption}
      </figcaption>
    </figure>
  )
}
