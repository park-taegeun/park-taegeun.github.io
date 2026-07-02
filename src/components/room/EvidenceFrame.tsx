// 증거 액자 — 실제 화면·사진이 주인공(가드레일: 장식이 증거를 가리지 않기).
// 프레임 토큰(design-system §9): radius 24 / 옅은 보더 / 깊은 그림자. 호버 = 살짝 기울어짐 + 확대(transform만).
// thumb 모드: 그래프 벽을 피하려 균일 높이 썸네일 + 클릭 확대(Lightbox)로 압축.
import type { EvidenceItem } from '../../data/rooms'
import { onImgError } from '../../lib/placeholder'

interface EvidenceFrameProps {
  item: EvidenceItem
  /** 지그재그 기울임 방향 (인덱스 교차) — Tailwind 정적 클래스 2종으로 분기 */
  tiltDir?: 1 | -1
  /** 대표 화면(MainWall)이면 기울임 없이 미세 확대만 */
  large?: boolean
  /** 갤러리 썸네일 — 균일 높이 카드로 정규화, 클릭 시 확대 */
  thumb?: boolean
  /** 썸네일 클릭 → 라이트박스 열기 */
  onExpand?: () => void
}

export default function EvidenceFrame({ item, tiltDir = 1, large = false, thumb = false, onExpand }: EvidenceFrameProps) {
  if (thumb) {
    return (
      <figure className="group">
        <button
          type="button"
          onClick={onExpand}
          aria-label={`${item.alt} — 확대 보기`}
          className="block w-full text-left cursor-zoom-in"
        >
          <div
            className="relative bg-panel overflow-hidden transition-transform duration-300 will-change-transform group-hover:scale-[1.015]"
            style={{
              borderRadius: 'var(--frame-radius)',
              border: 'var(--frame-border)',
              boxShadow: 'var(--shadow-soft)',
              transitionTimingFunction: 'var(--ease-default)',
            }}
          >
            {/* 균일 높이 미디어 박스 — 제각각 배경/비율을 하나의 시스템으로 */}
            <div className="grid place-items-center h-[168px] sm:h-[184px] p-3">
              <img
                src={item.src}
                alt={item.alt}
                onError={onImgError}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            </div>
            {/* 확대 어포던스 */}
            <span
              aria-hidden
              className="absolute top-2.5 right-2.5 grid place-items-center h-7 w-7 rounded-full bg-white/85 text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 2px 8px rgba(16,26,44,0.12)' }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </button>
        <figcaption className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-2.5 px-0.5">
          {item.caption}
        </figcaption>
      </figure>
    )
  }

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
